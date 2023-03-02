import React, { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Video from 'twilio-video';
import VideoAudio from './VideoAudio';

type ParticipantProps = {
  participant: Video.LocalParticipant | Video.RemoteParticipant,
  addAudioTrack: (audioTrack: any) => void,
  addScreenshot?: (screenshot: Blob) => void,
}
type RemoteRef = {
  handleScreenshot: () => void;
}

function Participant({ participant, addAudioTrack, addScreenshot }: ParticipantProps, ref: Ref<RemoteRef>) {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const audioRef = useRef<HTMLAudioElement>(null!);
  const canvasRef = useRef(null)

  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob: Blob) {
      addScreenshot(blob);
    });
  }

  useImperativeHandle(ref, () => ({
    handleScreenshot
  }));

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
      addAudioTrack(audioTrack.mediaStreamTrack);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks, addAudioTrack]);

  return (
    <>
      <VideoAudio
        videoRef={videoRef}
        audioRef={audioRef}
      />
      <canvas ref={canvasRef} width={854} height={480} style={{ display: "none" }}></canvas>
    </>
  );
}

export default forwardRef<RemoteRef, ParticipantProps>(Participant);
