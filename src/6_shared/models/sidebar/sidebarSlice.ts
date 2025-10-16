import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISidebar {
  isOpen: boolean;
  selectedGR: string;
}

const initialState: ISidebar = {
  isOpen: true,
  selectedGR: '',
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setSelectedGR(state, action: PayloadAction<string>) {
      state.selectedGR = action.payload;
    },

    restore: (_, action: PayloadAction<ISidebar>) => action.payload,
  },
});

export const sidebarActions = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
export const sidebarSliceName = sidebarSlice.name;
