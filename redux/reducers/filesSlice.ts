import { createSlice } from '@reduxjs/toolkit';
import { Item } from '../../components/ListItemPreview';

interface filesState{
  list: Item[]
}

const initialState: filesState = {
  list: []
}

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.list.push(action.payload);
    },
    deleteFile: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  }
})

export const getFilesState = (state: { files: filesState }) => state.files;

export const { addFile, deleteFile } = filesSlice.actions;

export default filesSlice.reducer;
