import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Video from 'twilio-video';
import VideoAudio from './VideoAudio';

type ParticipantProps = {
  participant: Video.LocalParticipant | Video.RemoteParticipant,
}

export default function Participant({ participant } : ParticipantProps) {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const audioRef = useRef<HTMLAudioElement>(null!);

  const trackAudioPubsToTracks = useCallback((trackMap: Map<string, Video.LocalAudioTrackPublication | Video.RemoteAudioTrackPublication>) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null), []);
  
  const trackVideoPubsToTracks = useCallback((trackMap: Map<string, Video.LocalVideoTrackPublication | Video.RemoteVideoTrackPublication>) =>
    Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter((track) => track !== null), []);

  useEffect(() => {
    setVideoTracks(trackVideoPubsToTracks(participant.videoTracks));
    setAudioTracks(trackAudioPubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: Video.Track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: Video.Track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant, trackVideoPubsToTracks, trackAudioPubsToTracks]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <Box
        sx={{
          backgroundColor: grey[500],
          minHeight: '31rem'
        }}
      >
        <Typography variant="body1" align="center">{participant.identity}</Typography>
        <VideoAudio 
          videoRef={videoRef}
          audioRef={audioRef}
        />
      </Box>
    </div>
  );
}