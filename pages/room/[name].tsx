import { Box, Container, CssBaseline } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState, useRef, useMemo, useCallback } from 'react';
import Loading from '../../components/Loading';
import Lobby from '../../components/Lobby';
import Room from '../../components/Room';
import RoomNotFound from '../../components/RoomNotFound';

export default function VideoCall() {
  const [isLoading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const roomFetchedRef = useRef(false);
  const usernameSubmitRef = useRef(false);
  const router = useRouter()
  const {name} = router.query
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

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
          const response = await axios.get<AccessRoom>(serverUrl + '/room/' + name)

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
    }, [name, serverUrl]
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post<AccessRoom>(serverUrl + '/room/' + name + '/join', {username})

      if (response.status === 200) {
        setToken(response.data.token);
        usernameSubmitRef.current = true;
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
  }, [name, username, serverUrl]);

  const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUsername('');
    usernameSubmitRef.current = false;
  }, []);

  return (
    <>
      <CssBaseline/>
      <Head>
        <title>Join Video Call</title>
        <meta name="description" content="Join Video Call"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/video-call-icon.svg"/>
      </Head>
      <main>
        {
          usernameSubmitRef.current && (
            <Room
              roomName={roomName}
              token={token}
              handleLogout={handleLogout}
            />
          )
        }
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
              isLoading ? <Loading/> : ''
            }
            {
              !isLoading && roomName === '' ? <RoomNotFound/> : ''
            }
            {
              !usernameSubmitRef.current ?
                (
                  <Lobby
                    username={username}
                    handleUsernameChange={handleUsernameChange}
                    handleSubmit={handleSubmit}
                  />
                ) : ''
            }
          </Container>
        </Box>
      </main>
    </>
  )
}
