import { Box, Button, Container, CssBaseline, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import { useRef } from 'react';
import { useMemo, useCallback } from 'react';
import Loading from '../../components/Loading';
import RoomNotFound from '../../components/RoomNotFound';

export default function VideoCall() {
  const [isLoading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const roomFetchedRef = useRef(false);
  const router = useRouter()
  const { name } = router.query

  type AccessRoom = {
    roomName: string,
    token: string,
  };
  type ServerError = { errorMessage: string };

  useMemo(
    async () => {
      if (name && !roomFetchedRef.current) {
        roomFetchedRef.current = true;
        try {
          const response = await axios.get<AccessRoom>('https://video-call.apps.vinslab.com/api/room/' + name)

          if (response.status === 200) {
            setRoomName(response.data.roomName);

            setLoading(false);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError<ServerError>;
            if (serverError && serverError.response) {
              console.log(error.response.status);
              setLoading(false);
            }
          }
        }
      }
    }, [name]
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post<AccessRoom>('https://video-call.apps.vinslab.com/api/room/' + name + '/join', { username })

      if (response.status === 200) {
        setToken(response.data.token);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>;
        if (serverError && serverError.response) {
          console.log(error.response.status);
        }
      }
    }

    setLoading(false);
  }, [name, username]);

  const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Join Video Call</title>
        <meta name="description" content="Join Video Call" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/video-call-icon.svg" />
      </Head>
      <main>
        <Box
          sx={{
            backgroundImage: `url('/large-triangles.svg')`,
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              bgcolor: grey[100],
              boxShadow: '0px 5px 30px 5px'
            }}
          >
            {
              isLoading ? <Loading /> : roomName === '' ? <RoomNotFound /> : (
                <Stack sx={{ height: '100vh' }} justifyContent="center" alignItems="center" spacing={3}>
                  <Typography variant="h3">Join Video Call</Typography>
                  <TextField
                    id="room-username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                  />
                  <Button disabled={username.length === 0} onClick={handleSubmit} variant="contained" fullWidth>Join</Button>
                </Stack>
              )
            }
          </Container>
        </Box>
      </main>
    </>
  )
}