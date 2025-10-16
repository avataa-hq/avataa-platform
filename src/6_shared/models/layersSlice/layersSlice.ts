import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILayerModel } from '6_shared';
import { set } from 'date-fns';
import { IListItem } from './types';

interface ILayersState {
  isCreateFolderModalOpen: boolean;
  isEditFolderModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isCreateLayerModalOpen: boolean;
  isEditLayerModalOpen: boolean;
  isConfirmModalOpen: boolean;
  selectedLayersItem: IListItem | null;
  activeFolder: IListItem | null;
  dropFolder: IListItem | null;
  selectedLayers: ILayerModel[];
  foldersSequence: number[];
}

const initialState: ILayersState = {
  isCreateFolderModalOpen: false,
  isEditFolderModalOpen: false,
  isDeleteModalOpen: false,
  isCreateLayerModalOpen: false,
  isEditLayerModalOpen: false,
  isConfirmModalOpen: false,
  selectedLayersItem: null,
  activeFolder: null,
  dropFolder: null,
  selectedLayers: [],
  foldersSequence: [],
};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    setIsCreateFolderModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateFolderModalOpen = action.payload;
    },
    setIsEditFolderModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditFolderModalOpen = action.payload;
    },
    setIsDeleteModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteModalOpen = action.payload;
    },
    setIsCreateLayerModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateLayerModalOpen = action.payload;
    },
    setIsEditLayerModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditLayerModalOpen = action.payload;
    },
    setIsConfirmModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConfirmModalOpen = action.payload;
    },
    setSelectedLayersItem: (state, action: PayloadAction<IListItem | null>) => {
      state.selectedLayersItem = action.payload;
    },
    setActiveFolder: (state, action: PayloadAction<IListItem | null>) => {
      state.activeFolder = action.payload;
    },
    setDropFolder: (state, action: PayloadAction<IListItem | null>) => {
      state.dropFolder = action.payload;
    },
    setSelectedLayers: (state, action: PayloadAction<ILayerModel[]>) => {
      state.selectedLayers = action.payload;
    },
    setFoldersSequence: (state, action: PayloadAction<number[]>) => {
      state.foldersSequence = action.payload;
    },

    restore: (_, action: PayloadAction<ILayersState>) => action.payload,
  },
});

export const layersActions = layersSlice.actions;
export const layersReducer = layersSlice.reducer;
export const layersSliceName = layersSlice.name;
