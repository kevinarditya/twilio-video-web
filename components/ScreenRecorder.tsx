import { StopCircle, VideoCall } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Recorder, useRecorderPermission } from '../hooks/useRecorderPermission';
import Timer from './Timer';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import moment from 'moment/moment';
import { addFile } from '../redux/reducers/fileSlice';
import { getTrackState } from '../redux/reducers/trackSlice';

export default function ScreenRecorder() {
  const { audioTracks } = useSelector(getTrackState);
  const recorder: Recorder = useRecorderPermission(audioTracks, 'video');
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
      type: 'video',
      filename: 'video-' + moment().format('DDMMYYYYHmmss'),
      value: recorderFile,
      timestamp: moment().format('DD-MM-YYYY, H:mm:ss'),
    }

    dispatch(addFile(metadata));
  }, [dispatch])

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
        handleAddRecorder(recorderFileBlob);
      }
    }
  }, [recorder, handleAddRecorder]);

  return (
    <>
      <Button
        variant={recorder.isRecording ? 'outlined' : 'contained'}
        startIcon={recorder.isRecording ? <StopCircle /> : <VideoCall />}
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
