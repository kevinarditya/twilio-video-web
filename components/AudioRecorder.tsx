import { PlayCircleFilled, StopCircle } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';

type AudioRecorderProps = {
  audioTracks: Array<MediaStreamTrack>,
  addRecorder: (recorderFile: string) => void
}

export default function AudioRecorder({ audioTracks, addRecorder }: AudioRecorderProps) {
  const recorder: Recorder = useRecorderPermission(audioTracks, 'audio');

  const handleToggleRecording = useCallback(async () => {
    if (!recorder.isRecording) {
      if (recorder) {
        recorder.startRecord();
      }
    } else {
      if (recorder) {
        recorder.stopRecord();
        const recorderFileBlob = await recorder.getBlob();
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
        {recorder.isRecording ? 'Stop Recording' : 'Start Audio Recording'}
      </Button>
    </>
  );
}
