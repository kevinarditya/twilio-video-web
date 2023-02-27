import { PlayCircleFilled, StopCircle } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';
import Timer from './Timer';

type ScreenRecorderProps = {
  audioTracks: Array<MediaStreamTrack>
  addRecorder: (recorderFile: string) => void
}

export default function ScreenRecorder({ audioTracks, addRecorder }: ScreenRecorderProps) {
  const recorder: Recorder = useRecorderPermission(audioTracks, 'video');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleToggleRecording = useCallback(async () => {
    if (!recorder.isRecording) {
      if (recorder) {
        recorder.startRecord();
        setMessage('Start Screen Recording');
        setOpen(true);
      }
    } else {
      if (recorder) {
        const recorderFileBlob = await recorder.stopRecord();
        setMessage('Stop Screen Recording');
        setOpen(true);
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
        {recorder.isRecording ? <Timer time={recorder.time}/> : 'Screen Recording'}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
};
