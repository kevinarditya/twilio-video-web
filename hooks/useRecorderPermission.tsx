import { useCallback, useEffect, useState } from "react";
import { invokeSaveAsDialog, RecordRTCPromisesHandler } from "recordrtc";

export type Recorder = {
  startRecord: () => void,
  stopRecord: () => Promise<string>,
  downloadRecord: () => void,
  isVideoActive: boolean,
  isRecording: boolean,
  time: number,
}

export const useRecorderPermission = (audioTracks: Array<MediaStreamTrack>, type: string) => {
  const [audioContext] = useState(new AudioContext());
  const [isRecording, setRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<any>();
  const [audio, setAudio] = useState<MediaStreamAudioDestinationNode>();
  const [video, setVideo] = useState<MediaStream>();
  const [time, setTime] = useState(0);

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

  useEffect(() => {
    let interval: NodeJS.Timer = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const handleStopRecorder = useCallback(async () => {
    if (isRecording) {
      await recorder.stopRecording();
      setRecording(false);
      setTime(0);
      if (type === 'video') {
        video.getTracks()
          .forEach(track => track.stop())
      }
      return recorder.getBlob();
      // alert('Stop Recording');
    }
  }, [recorder, isRecording, video])

  const initVideoRecorder = useCallback(async () => {
    let video = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 854,
        height: 480
      },
      audio: false,
    });
    setVideo(video);
    video.getVideoTracks()[0].addEventListener('ended', () => {
      setRecording(false);
      setRecorder(null);
    })

    return new MediaStream([...video.getTracks(), ...audio.stream.getTracks()]);
  }, [audio, recorder])

  const initAudioRecorder = useCallback(() => {
    return new MediaStream([...audio.stream.getTracks()])
  }, [audio]);

  const getPermissionInitializeRecorder = useCallback(async () => {
    if (type === 'audio') {
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

    if (!isRecording) {
      setRecording(true);
      recorder.startRecording();
    }
  }, [getPermissionInitializeRecorder, isRecording, type]);

  const handleDownloadRecord = useCallback(async () => {
    const blob = await recorder.getBlob();
    return invokeSaveAsDialog(blob, 'video-call-' + Date.now());
  }, [recorder])

  const handleGetBlob = useCallback( async () => {
    return await recorder.getBlob();
  }, [recorder])

  const customRecorder: Recorder = {
    startRecord: handleStartRecorder,
    stopRecord: handleStopRecorder,
    downloadRecord: handleDownloadRecord,
    isVideoActive: false,
    isRecording: isRecording,
    time: time,
  }

  return customRecorder;
};
