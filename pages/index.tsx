import { AlertColor, Box, Button, Grid, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useState, useCallback, ChangeEvent } from 'react';
import MySnackbar from '../components/MySnackbar';
import { grey } from '@mui/material/colors';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<AlertColor>('success');

  const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      if(username === 'admin' && password === 'P@ssw0rdApa') {
        setType('success');
        setMessage('Login Success');
        sessionStorage.setItem("token", "4bf6d212-f81d-4a89-aa9d-3c50d55e6f95")
      } else {
        setType('error');
        setMessage('Login Failed');
      }
      setLoading(false);
    }, 3000);
  }, [username, password])

  const resetMessage = useCallback(() => {
    setMessage('');
  }, []) 

  return (
    <>
      <Head>
        <title>Vinslab Video Call App</title>
        <meta name="description" content="Vinslab Video Call" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/video-call-icon.svg" />
      </Head>
      <main>
        {
          isLoading && <LinearProgress />
        }
        <Grid container direction="row" sx={{ height: '100vh' }} >
          <Grid item sm={8} sx={{ position: 'relative' }}>
            <Box
              sx={{
                backgroundImage: `url('/large-triangles.svg')`,
                height: '100vh'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: '100vh', px: '2rem', bgcolor: grey[100] }}
            >
              <Typography variant="h3">Video Call</Typography>
              <TextField id="admin-username" label="username" variant="outlined" value={username} onChange={handleUsernameChange} fullWidth />
              <TextField id="admin-password" label="password" type="password" variant="outlined" value={password} onChange={handlePasswordChange} fullWidth />
              <Button disabled={username === '' || password === '' || isLoading} variant="contained" onClick={handleSubmit} fullWidth>Login</Button>
            </Stack>
          </Grid>
        </Grid>
        <MySnackbar message={message} type={type} resetMessage={resetMessage} />
      </main>
    </>
  )
}
