import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

type RoomProps = {
  roomName: string,
  token: string,
  handleLogout: () => void
}

export default function Room({ roomName, token, handleLogout }: RoomProps) {
  const [room, setRoom] = React.useState<Video.Room>(null);
  const [participants, setParticipants] = React.useState([]);

  useEffect(() => {
    const participantConnected = (participant: Video.RemoteParticipant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: Video.RemoteParticipant) => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    console.log(`connect to twilio with token: ${token}`)

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom: Video.Room) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            (trackPublication.track as Video.LocalVideoTrack | Video.LocalAudioTrack).stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map((participant) => (
    <Grid item xs={6} key={participant.sid}>
      <Participant participant={participant} />
    </Grid>
  ));

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url('/protruding-squares.svg')`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Typography variant="h5" align="center" sx={{ color: 'white' }}>Room: {roomName}</Typography>
          <Stack alignItems="end">
            <Button variant="contained" onClick={handleLogout}>Log out</Button>
          </Stack>
          {room ? (
            <Grid container>
              <Grid item xs={6}>
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                />
              </Grid>
              {remoteParticipants}
            </Grid>
          ) : (
            ''
          )}
        </Stack>
      </Container>
    </Box>
  )
}