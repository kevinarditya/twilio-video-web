import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../components/ListItemPreview';

interface filesState{
  list: Item[]
}

const initialState: filesState = {
  list: []
}

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<Item>) => {
      state.list.push(action.payload);
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  }
})

export const getFilesState = (state: { files: filesState }) => state.files;

export const { addFile, deleteFile } = fileSlice.actions;

export default fileSlice.reducer;
