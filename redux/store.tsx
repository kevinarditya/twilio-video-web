import { configureStore } from '@reduxjs/toolkit';
import filesSlice from './reducers/fileSlice';
import trackSlice from './reducers/trackSlice';

export default configureStore({
  reducer: {
    files: filesSlice,
    track: trackSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
