import { Button, CircularProgress, Stack } from '@mui/material';
import Head from 'next/head';
import React, { useCallback, useMemo, useState } from 'react';
import MySnackbar from '../../components/MySnackbar';

export default function Dashboard() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [message , setMessage] = useState<string>('');

  useMemo(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    return false;
  }, [])

  const handleCreateRoom = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      setMessage('Room Created');
      setLoading(false);
    }, 3000);
  }, []);

  const resetMessage = useCallback(() => {
    setMessage('');
  }, []);

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/video-call-icon.svg" />
      </Head>
      <main>
        <Stack sx={{ height: '100vh' }} justifyContent="center" alignItems="center">
          { isLoading ? <CircularProgress /> : (
            <Button variant="contained" onClick={handleCreateRoom}>Create Room</Button> 
          )}
        </Stack>
      </main>
      <MySnackbar message={message} type="success" resetMessage={resetMessage} />
    </>
  )
}