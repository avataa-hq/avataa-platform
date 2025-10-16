import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GantScaleType, IGantProcess, IGanttTask } from './types';

interface ITaskManagerState {
  selectedProcess: IGantProcess[];
  ganttTasks: IGanttTask[];
  currentScale: GantScaleType;
  selectedTask: IGanttTask | null;
}

const initialState: ITaskManagerState = {
  selectedProcess: [],
  ganttTasks: [],
  currentScale: 'weeks',
  selectedTask: null,
};

const taskManagerSlice = createSlice({
  name: 'taskManager',
  initialState,
  reducers: {
    setSelectedProcess: (state, action: PayloadAction<IGantProcess[]>) => {
      state.selectedProcess = action.payload;
    },
    setGanttTasks: (state, action: PayloadAction<IGanttTask[]>) => {
      state.ganttTasks = action.payload;
    },
    setCurrentScale: (state, action: PayloadAction<GantScaleType>) => {
      state.currentScale = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<IGanttTask | null>) => {
      state.selectedTask = action.payload;
    },

    restore: (_, action: PayloadAction<ITaskManagerState>) => action.payload,
  },
});

export const taskManagerActions = taskManagerSlice.actions;
export const taskManagerReducer = taskManagerSlice.reducer;
export const taskManagerSliceName = taskManagerSlice.name;
