import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChangeObjectActivityStatusModal, IInventoryData } from './types';

const initialState: IInventoryData = {
  objIds: null,
  isFileDownloadModalOpen: false,
  changeObjectActivityStatusModal: {
    isOpen: false,
    role: 'Delete',
  },
  isFileViewerOpen: false,
  isLinkedObjectsWidgetOpen: false,
  isRelatedObjectsWidgetOpen: false,
  isHistoryModalOpen: false,
  isChildObjectsWidgetOpen: false,
  isAssociatedObjectsWidgetOpen: false,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setTmoId: (state, action: PayloadAction<number>) => {
      state.tmoId = action.payload;
    },
    setObjIds: (state, action: PayloadAction<number[] | null | undefined>) => {
      state.objIds = action.payload;
    },
    setIsFileDownloadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFileDownloadModalOpen = action.payload;
    },
    setIsFileViewerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFileViewerOpen = action.payload;
    },
    setIsLinkedObjectsWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.isLinkedObjectsWidgetOpen = action.payload;
    },
    setIsRelatedObjectsWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.isRelatedObjectsWidgetOpen = action.payload;
    },
    setIsHistoryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistoryModalOpen = action.payload;
    },
    setIsChildObjectsWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.isChildObjectsWidgetOpen = action.payload;
    },
    setIsAssociatedObjectsWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.isAssociatedObjectsWidgetOpen = action.payload;
    },
    setChangeObjectActivityStatusModal: (
      state,
      action: PayloadAction<IChangeObjectActivityStatusModal>,
    ) => {
      state.changeObjectActivityStatusModal = action.payload;
    },
    restore: (_, action: PayloadAction<IInventoryData>) => action.payload,
  },
});

export const inventoryActions = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;
export const inventorySliceName = inventorySlice.name;
