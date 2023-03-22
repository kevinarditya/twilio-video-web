import { CallEnd, Mic, MicOff, ScreenshotMonitor, Videocam, VideocamOff } from '@mui/icons-material';
import { AppBar, Box, Button, CircularProgress, Divider, Grid, Stack, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import ListItemPreview from './ListItemPreview';
import { v4 } from 'uuid';
import moment from "moment";
import { VideoRoomMonitor } from '@twilio/video-room-monitor';
import ActionButton from './ActionButton';
import { useDispatch } from 'react-redux';
import { addFile } from '../redux/reducers/fileSlice';

const ScreenRecorder = dynamic(() => import('./ScreenRecorder'), { ssr: false });
const AudioRecorder = dynamic(() => import('./AudioRecorder'), { ssr: false });

type RoomProps = {
  roomName: string,
  token: string,
  handleLogout: () => void,
  mode: string
}

export default function Room({ roomName, token, handleLogout, mode }: RoomProps) {
  const [room, setRoom] = React.useState<Video.Room>();
  const [participants, setParticipants] = React.useState([]);
  const remoteRef = useRef(null);
  const [screenshotCount, setScreenshotCount] = React.useState(1);
  const [isCamera, setCamera] = React.useState(true);
  const [isMic, setMic] = React.useState(true);
  const dispatch = useDispatch();

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
      VideoRoomMonitor.registerVideoRoom(room);
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

  useEffect(() => {
    if (room && participants.filter((participant) => participant === room.localParticipant).length === 0) {
      setParticipants(prevParticipants => [...prevParticipants.filter(p => p.state !== 'disconnected'), room.localParticipant]);
    }
  }, [room, participants])

  const handleSwitchParticipant = useCallback(() => {
    const newParticipants = [participants[1], participants[0]]
    setParticipants(newParticipants);
  }, [participants]);

  const handleScreenshotRemoteParticipant = useCallback(() => {
    remoteRef.current.handleScreenshot();
  }, []);

  const handleAddScreenshot = useCallback((screenshot: Blob) => {
    const metadata = {
      id: v4(),
      type: 'image',
      filename: 'screenshot-' + screenshotCount,
      value: screenshot,
      timestamp: moment().format('DD-MM-YYYY, H:mm:ss'),
    };
    setScreenshotCount(screenshotCount + 1);
    dispatch(addFile(metadata));
  }, [screenshotCount, dispatch]);

  const handleToggleDebug = () => {
    if(VideoRoomMonitor.isOpen) {
      VideoRoomMonitor.closeMonitor();
      return;
    }

    VideoRoomMonitor.openMonitor();
  }

  const handleToggleCamera = () => {
    room.localParticipant.videoTracks.forEach((videoTrack) => {
      videoTrack.track.enable(!isCamera);
    });
    setCamera(!isCamera)
  }

  const handleToggleMic = () => {
    room.localParticipant.audioTracks.forEach((audioTrack) => {
      audioTrack.track.enable(!isMic);
    })
    setMic(!isMic);
  }

  const remoteParticipants = participants.map((participant, index) => {
    if (index === 1) {
      return (
        <Box
          key={participant.sid}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 10,
            width: { xl: '20%', md: '25%' },
            height: { xl: '30%', md: '25%', xs: '40%' },
            borderRadius: '10px',
            backgroundColor: 'black',
          }}
        >
          {
            participant !== room.localParticipant ? (
              <Participant participant={participant} ref={remoteRef} addScreenshot={handleAddScreenshot} />
            ) : (
              <Participant participant={participant} />
            )
          }

        </Box>
      )
    }
    return (
      <Box
        key={participant.sid}
        sx={{
          backgroundColor: 'black',
          borderRadius: '0 0 10px 10px',
          height: '100%'
        }}
      >
        {
          participant !== room.localParticipant ? (
            <Participant participant={participant} ref={remoteRef} addScreenshot={handleAddScreenshot} />
          ) : (
            <Participant participant={participant} />
          )
        }
      </Box>
    )
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        height: 'auto',
        overflow: 'auto',
        backgroundImage: `url('/protruding-squares.svg')`,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Room: {roomName}</Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={2}
        sx={{
          position: 'absolute',
          padding: '1rem 1rem',
          height: '96%',
          overflow: 'auto',
        }}
      >
        <Grid item xs={12} sm={8} md={9} container>
          <Grid item container direction="column" justifyContent="end" spacing={2}>
            <Grid item sx={{ flexGrow: 1 }}>
              <Stack sx={{ height: '100%', bgcolor: grey[600], borderRadius: '10px' }}>
                <Box sx={{ padding: '.5rem', borderBottom: '1px solid black' }}>
                  <Typography variant="h6" align="center">Video Call</Typography>
                </Box>
                <Stack direction="row" justifyContent="end" sx={{ padding: '.5rem', bgcolor: grey[500] }} spacing={1}>
                  {
                    mode === 'debug' && (
                      <Button
                        variant="contained"
                        onClick={handleToggleDebug}
                      >
                        Network Stats
                      </Button>
                    )
                  }
                  <Button
                    variant="contained"
                    onClick={handleScreenshotRemoteParticipant}
                    disabled={participants.length < 2}
                    startIcon={<ScreenshotMonitor />}
                  >
                    Screenshot
                  </Button>
                  <AudioRecorder />
                  <ScreenRecorder />
                  <Button
                    variant="contained"
                    onClick={handleSwitchParticipant}
                    disabled={participants.length < 2}
                  >
                    Switch
                  </Button>
                  <Divider orientation="vertical" flexItem />
                  <Stack direction="row" sx={{ bgcolor: grey[500] }} spacing={2}>
                    <ActionButton
                      icon={isCamera ? <Videocam /> : <VideocamOff />}
                      onClick={handleToggleCamera}
                    >
                      Camera
                    </ActionButton>
                    <ActionButton
                      icon={isMic ? <Mic /> : <MicOff />}
                      onClick={handleToggleMic}
                    >
                      Mic
                    </ActionButton>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<CallEnd />}
                  >
                    Exit
                  </Button>
                </Stack>
                {
                  room ? (
                    <Box sx={{ position: 'relative', flexGrow: 1 }}>
                      {remoteParticipants}
                    </Box>
                  ) : (
                    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', width: '100%', bgcolor: 'black', borderRadius: '0 0 10px 10px' }}>
                      <CircularProgress />
                    </Stack>
                  )
                }
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={3} sx={{ height: '100%' }}>
          <ListItemPreview/>
        </Grid>
      </Grid>
    </Box >
  )
}
