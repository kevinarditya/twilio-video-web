import { PlayCircleFilled, StopCircle } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';

type AudioRecorderProps = {
  audioTracks: Array<MediaStreamTrack>
}

export default function AudioRecorder({ audioTracks }: AudioRecorderProps) {
  const recorder: Recorder = useRecorderPermission(audioTracks, 'audio');

  const handleToogleRecording = useCallback(() => {
    if (!recorder.isRecording) {
      if (recorder) {
        recorder.startRecord();
      }
    } else {
      if (recorder) {
        recorder.stopRecord();
      }
    }
  }, [recorder]);

  const handleDownloadRecording = useCallback(() => {
    recorder.downloadRecord();
  }, [recorder]);
  
  return (
    <>
      <Button
        variant={recorder.isRecording ? 'outlined' : 'contained'}
        startIcon={recorder.isRecording ? <StopCircle /> : <PlayCircleFilled />}
        sx={{ backgroundColor: recorder.isRecording ? 'white' : '' }}
        onClick={handleToogleRecording}
      >
        {recorder.isRecording ? 'Stop Recording' : 'Start Audio Recording'}
      </Button>
      <Button
        variant="contained"
        onClick={handleDownloadRecording}
      >
        Download Audio
      </Button>
    </>
  );
}