import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IKanbanTask } from './types';

interface IInitialState {
  editableTask?: IKanbanTask | null;
}

const initialState: IInitialState = {
  editableTask: null,
};

const kanbanBoardSlice = createSlice({
  name: 'kanbanBoard',
  initialState,
  reducers: {
    setEditableTask: (state, action: PayloadAction<IKanbanTask | null>) => {
      state.editableTask = action.payload;
    },

    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});
export const kanbanBoardActions = kanbanBoardSlice.actions;
export const kanbanBoardReducer = kanbanBoardSlice.reducer;
export const kanbanBoardSliceName = kanbanBoardSlice.name;
