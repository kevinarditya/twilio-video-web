import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface trackState {
  audioTracks: Array<MediaStreamTrack>
}

const initialState: trackState = {
  audioTracks: []
}

export const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    addAudioTrack: (state, action: PayloadAction<MediaStreamTrack>) => {
      state.audioTracks.push(action.payload);
    },
    deleteAudioTrack: (state, action: PayloadAction<MediaStreamTrack>) => {
      state.audioTracks = state.audioTracks.filter((audioTrack) => audioTrack !== action.payload);
    },
  }
})

export const getTrackState = (state: { track: trackState}) => state.track;

export const { addAudioTrack, deleteAudioTrack } = trackSlice.actions;

export default trackSlice.reducer;
