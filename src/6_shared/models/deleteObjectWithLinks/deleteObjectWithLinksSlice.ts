import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeleteObjectWithLinksData } from './types';

const initialState: DeleteObjectWithLinksData = {
  addedConnectorNodesList: [],
  addedObjectId: null,
  currentObjectId: null,
  currentTmoId: null,
};

const deleteObjectWithLinksSlice = createSlice({
  name: 'deleteObjectWithLinksComponent',
  initialState,
  reducers: {
    setAddedConnectorNodesList: (state, action: PayloadAction<number[]>) => {
      state.addedConnectorNodesList = action.payload;
    },
    setAddedObjectId: (state, action: PayloadAction<number>) => {
      state.addedObjectId = action.payload;
    },
    setCurrentObjectId: (state, action: PayloadAction<number>) => {
      state.currentObjectId = action.payload;
    },
    setCurrentTmoId: (state, action: PayloadAction<number>) => {
      state.currentTmoId = action.payload;
    },
    restore: (_, action: PayloadAction<DeleteObjectWithLinksData>) => action.payload,
  },
});

export const deleteObjectWithLinksActions = deleteObjectWithLinksSlice.actions;
export const deleteObjectWithLinksReducer = deleteObjectWithLinksSlice.reducer;
export const deleteObjectWithLinksSliceName = deleteObjectWithLinksSlice.name;
