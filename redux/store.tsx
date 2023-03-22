import { configureStore } from '@reduxjs/toolkit';
import filesSlice from './reducers/filesSlice';

export default configureStore({
  reducer: {
    files: filesSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
