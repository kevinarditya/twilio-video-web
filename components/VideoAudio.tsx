import { Box, styled } from '@mui/material';
import React, { MutableRefObject } from 'react';

type VideoAudioProps = {
  videoRef: MutableRefObject<HTMLVideoElement>
  audioRef: MutableRefObject<HTMLAudioElement>
}

const VideoPlayer = styled('video')(
  () => `
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
    border-radius: 0 0 10px 10px;
  `
);

export default function VideoAudio({ videoRef, audioRef }: VideoAudioProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <VideoPlayer ref={videoRef} autoPlay={true} width="100" height="100" />
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </Box>
  );
}