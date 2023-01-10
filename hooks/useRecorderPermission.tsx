import { useState, useCallback, useEffect } from "react";
import { invokeSaveAsDialog, RecordRTCPromisesHandler } from "recordrtc";

export type Recorder = {
  startRecord: () => void,
  stopRecord: () => void,
  downloadRecord: () => void,
  isVideoActive: boolean,
  isRecording: boolean,
}

export const useRecorderPermission = (audioTracks: Array<MediaStreamTrack>) => {
  const [audioContext] = useState(new AudioContext());
  const [isRecording, setRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<any>();
  const [audio, setAudio] = useState<MediaStreamAudioDestinationNode>();
  const [video, setVideo] = useState<MediaStream>();
  const [mixer, setMixer] = useState<MediaStream>();

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
    if (video && audio) {
      console.log('update mixer');
      setMixer(new MediaStream([...video.getTracks(), ...audio.stream.getTracks()]));
    }
  }, [audioTracks, audio, audioContext, video]);

  const getPermissionInitializeRecorder = useCallback(async () => {
    let video = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    setVideo(video);

    const mixer = new MediaStream([...video.getTracks(), ...audio.stream.getTracks()])
    setMixer(mixer);

    return mixer;
  }, [audio]);

  const handleStartRecorder = useCallback(async () => {
    const mixer = await getPermissionInitializeRecorder();

    let recorder = new RecordRTCPromisesHandler(mixer, {
      type: 'video',
      canvas: { width: 480, height: 360 },
      checkForInactiveTracks: true
    });
    setRecorder(recorder);

    if (isRecording) {
      alert('Recording already started');
    } else {
      setRecording(true);
      recorder.startRecording();
      alert('Start Recording');
    }
  }, [getPermissionInitializeRecorder, isRecording]);

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