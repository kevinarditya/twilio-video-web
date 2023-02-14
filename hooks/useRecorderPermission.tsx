import { useCallback, useEffect, useState } from "react";
import { invokeSaveAsDialog, RecordRTCPromisesHandler } from "recordrtc";

export type Recorder = {
  startRecord: () => void,
  stopRecord: () => void,
  downloadRecord: () => void,
  isVideoActive: boolean,
  isRecording: boolean,
}

export const useRecorderPermission = (audioTracks: Array<MediaStreamTrack>, type: string) => {
  const [audioContext] = useState(new AudioContext());
  const [isRecording, setRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<any>();
  const [audio, setAudio] = useState<MediaStreamAudioDestinationNode>();
  const [video, setVideo] = useState<MediaStream>();

  useEffect(() => {
    if (!audio) {
      const finalAudioStream = audioContext.createMediaStreamDestination();
      setAudio(finalAudioStream);
    }

    audioTracks.forEach((audioTrack) => {
      const audioMediaStream = new MediaStream();
      audioMediaStream.addTrack(audioTrack);

      const audioSource = audioContext.createMediaStreamSource(audioMediaStream);
      audioSource.connect(audio);
    });
  }, [audioTracks, audio, audioContext, video]);

  const initVideoRecorder = useCallback(async () => {
    let video = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 854,
        height: 480
      },
      audio: false,
    });
    setVideo(video);

    return new MediaStream([...video.getTracks(), ...audio.stream.getTracks()]);
  }, [audio])

  const initAudioRecorder = useCallback(async () => {
    return new MediaStream([...audio.stream.getTracks()])
  }, [audio]);

  const getPermissionInitializeRecorder = useCallback(async () => {
    if(type === 'audio') {
      return initAudioRecorder();
    }

    return initVideoRecorder();
  }, [initVideoRecorder, initAudioRecorder, type]);

  const handleStartRecorder = useCallback(async () => {
    let recorder;
    const mixer = await getPermissionInitializeRecorder();

    if (type === 'audio') {
      recorder = new RecordRTCPromisesHandler(mixer, {
        type: 'audio',
        mimeType: 'audio/webm',
      });
    } else {
      recorder = new RecordRTCPromisesHandler(mixer, {
        type: 'video',
        mimeType: "video/webm;codecs=vp9",
        frameInterval: 10,
      });
    }
    setRecorder(recorder);

    if (isRecording) {
      alert('Recording already started');
    } else {
      setRecording(true);
      recorder.startRecording();
      alert('Start Recording');
    }
  }, [getPermissionInitializeRecorder, isRecording, type]);

  const handleStopRecorder = useCallback(async () => {
    if (isRecording) {
      recorder.stopRecording();
      setRecording(false);
      alert('Stop Recording');
    } else {
      alert('Recording not started yet');
    }
  }, [recorder, isRecording])

  const handleGetBlob = useCallback(async () => {
    const blob = await recorder.getBlob()
    return invokeSaveAsDialog(blob, 'video-call-' + Date.now())
  }, [recorder])

  const customRecorder: Recorder = {
    startRecord: handleStartRecorder,
    stopRecord: handleStopRecorder,
    downloadRecord: handleGetBlob,
    isVideoActive: false,
    isRecording: isRecording,
  }

  return customRecorder;
};
