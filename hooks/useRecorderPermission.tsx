import { useState, useCallback } from "react";
import { invokeSaveAsDialog, RecordRTCPromisesHandler } from "recordrtc";

export type Recorder = {
  startRecord: () => void,
  stopRecord: () => void,
  downloadRecord: () => void,
  isVideoActive: boolean,
  isRecording: boolean,
}

export const useRecorderPermission = (audioTracks: Array<MediaStreamTrack>) => {
  const [isRecording, setRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<any>();

  const getPermissionInitializeRecorder = useCallback(async () => {
    let video = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    const audioContext = new AudioContext();
    const finalAudioStream = audioContext.createMediaStreamDestination();
    audioTracks.forEach((audioTrack) => {
      const audioMediaStream = new MediaStream();
      audioMediaStream.addTrack(audioTrack);

      const audio = audioContext.createMediaStreamSource(audioMediaStream);
      audio.connect(finalAudioStream);
    });

    let mixer = new MediaStream([...video.getTracks(), ...finalAudioStream.stream.getTracks()]);

    let recorder = new RecordRTCPromisesHandler(mixer, {
      type: 'video',
      canvas: {width: 480, height: 360},
      checkForInactiveTracks: true
    });
    setRecorder(recorder);

    return recorder;
  }, [audioTracks]);

  const handleStartRecorder = useCallback(async () => {
    let usedRecorder = await getPermissionInitializeRecorder();

    if (isRecording) {
      alert('Recording already started');
    } else {
      setRecording(true);
      usedRecorder.startRecording();
      alert('Start Recording');
    }
  }, [getPermissionInitializeRecorder, isRecording]);

  const handleStopRecorder = useCallback(async () => {
    if(isRecording) {
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