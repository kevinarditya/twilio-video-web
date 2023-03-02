import { MusicNote, StopCircle } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';
import Timer from './Timer';

type AudioRecorderProps = {
  audioTracks: Array<MediaStreamTrack>,
  addRecorder: (recorderFile: Blob) => void
}

export default function AudioRecorder({ audioTracks, addRecorder }: AudioRecorderProps) {
  const recorder: Recorder = useRecorderPermission(audioTracks, 'audio');
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
        setMessage('Start Audio Recording');
        setOpen(true);
      }
    } else {
      if (recorder) {
        const recorderFileBlob = await recorder.stopRecord();
        setMessage('Stop Audio Recording');
        setOpen(true);
        addRecorder(recorderFileBlob);
      }
    }
  }, [recorder, addRecorder]);

  return (
    <>
      <Button
        variant={recorder.isRecording ? 'outlined' : 'contained'}
        startIcon={recorder.isRecording ? <StopCircle /> : <MusicNote />}
        sx={{ backgroundColor: recorder.isRecording ? 'white' : '' }}
        onClick={handleToggleRecording}
      >
        {recorder.isRecording ? <Timer time={recorder.time}/> : 'Audio Recording'}
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
}
