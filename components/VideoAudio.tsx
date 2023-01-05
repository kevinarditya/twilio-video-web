import { styled } from '@mui/material';
import React, { MutableRefObject } from 'react';

type VideoAudioProps = {
  videoRef: MutableRefObject<HTMLVideoElement>
  audioRef: MutableRefObject<HTMLAudioElement>
}

const VideoPlayer = styled('video')(
  () => `
    width: 100%;
    height: auto;
    min-height: 26rem;
  `
);

export default function VideoAudio({ videoRef, audioRef }: VideoAudioProps) {
  return (
    <>
      <VideoPlayer ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </>
  );
}