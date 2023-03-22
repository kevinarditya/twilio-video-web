import { MusicNote, StopCircle } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';
import Timer from './Timer';
import { v4 } from 'uuid';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { addFile } from '../redux/reducers/fileSlice';
import { getTrackState } from '../redux/reducers/trackSlice';

export default function AudioRecorder() {
  const { audioTracks } = useSelector(getTrackState);
  const recorder: Recorder = useRecorderPermission(audioTracks, 'audio');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleAddRecorder = useCallback((recorderFile: Blob) => {
    const metadata = {
      id: v4(),
      type: 'audio',
      filename: 'audio-' + moment().format('DDMMYYYYHmmss'),
      value: recorderFile,
      timestamp: moment().format('DD-MM-YYYY, H:mm:ss'),
    }

    dispatch(addFile(metadata));
  }, [dispatch])

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
        handleAddRecorder(recorderFileBlob);
      }
    }
  }, [recorder, handleAddRecorder]);

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
