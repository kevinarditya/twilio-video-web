import { PlayCircleFilled, StopCircle } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';

type ScreenRecorderProps = {
  audioTracks: Array<MediaStreamTrack>
  addRecorder: (recorderFile: string) => void
}

export default function ScreenRecorder({ audioTracks, addRecorder }: ScreenRecorderProps) {
  const recorder: Recorder = useRecorderPermission(audioTracks, 'video');

  const handleToggleRecording = useCallback(async () => {
    if (!recorder.isRecording) {
      if (recorder) {
        recorder.startRecord();
      }
    } else {
      if (recorder) {
        const recorderFileBlob = await recorder.stopRecord();
        addRecorder(recorderFileBlob);
      }
    }
  }, [recorder, addRecorder]);

  return (
    <>
      <Button
        variant={recorder.isRecording ? 'outlined' : 'contained'}
        startIcon={recorder.isRecording ? <StopCircle /> : <PlayCircleFilled />}
        sx={{ backgroundColor: recorder.isRecording ? 'white' : '' }}
        onClick={handleToggleRecording}
      >
        {recorder.isRecording ? 'Stop Recording' : 'Start Video Recording'}
      </Button>
    </>
  );
};
