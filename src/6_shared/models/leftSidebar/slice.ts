import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  isLeftSidebarOpen: boolean;
}

const initialState: IInitialState = {
  isLeftSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: 'leftSidebar',
  initialState,
  reducers: {
    setIsLeftSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isLeftSidebarOpen = action.payload;
    },
    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const leftSidebarActions = sidebarSlice.actions;
export const leftSidebarReducer = sidebarSlice.reducer;
export const leftSidebarSliceName = sidebarSlice.name;
