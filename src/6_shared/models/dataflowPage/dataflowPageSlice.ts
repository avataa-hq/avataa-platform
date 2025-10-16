import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Pipeline } from '6_shared/api/dataview/types';
import { Source } from '6_shared/api/dataflowV3/types';
import { INestedMultiFilterForm } from '6_shared';

interface InitialState {
  isAddDataSourceModalOpen: boolean;
  isPipelineInfoModalOpen: boolean;
  isEditFileManualModalOpen: boolean;
  isEditDbSourceModalOpen: boolean;
  isEditApiSourceModalOpen: boolean;
  isEditFileSftpModalOpen: boolean;
  isDeleteSourceModalOpen: boolean;
  isDeletePipelineModalOpen: boolean;
  isCopyPipelineModalOpen: boolean;
  isConfigureDataSourceModalOpen: boolean;
  isTableRelationSettingsModalopen: boolean;
  selectedPipeline?: Pipeline;
  selectedSource?: Source;
  isAddDestinationModalOpen: boolean;
  isSourceDeleted: number;
  filterFormState: INestedMultiFilterForm | null;
  selectedTags: Record<string, boolean> | null;
  tablePage: number;
}

const initialState: InitialState = {
  isAddDataSourceModalOpen: false,
  isPipelineInfoModalOpen: false,
  isDeletePipelineModalOpen: false,
  isEditFileManualModalOpen: false,
  isEditDbSourceModalOpen: false,
  isEditApiSourceModalOpen: false,
  isEditFileSftpModalOpen: false,
  isDeleteSourceModalOpen: false,
  isCopyPipelineModalOpen: false,
  isConfigureDataSourceModalOpen: false,
  isTableRelationSettingsModalopen: false,
  isAddDestinationModalOpen: false,
  isSourceDeleted: 0,
  filterFormState: null,
  selectedTags: null,
  tablePage: 0,
};

const dataflowPageSlice = createSlice({
  name: 'dataflowPage',
  initialState,
  reducers: {
    setAddDataSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isAddDataSourceModalOpen = payload;
    },
    setPipelineInfoModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isPipelineInfoModalOpen = payload;
    },
    setEditFileManualModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditFileManualModalOpen = payload;
    },
    setEditDbSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditDbSourceModalOpen = payload;
    },
    setEditApiSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditApiSourceModalOpen = payload;
    },
    setEditFileSftpModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditFileSftpModalOpen = payload;
    },
    setDeleteSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeleteSourceModalOpen = payload;
    },
    setDeletePipelineModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeletePipelineModalOpen = payload;
    },
    setCopyPipelineModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isCopyPipelineModalOpen = payload;
    },
    setConfigureDataSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isConfigureDataSourceModalOpen = payload;
    },
    setTableRelationSettingsModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isTableRelationSettingsModalopen = payload;
    },
    setSelectedPipeline: (state, { payload }: PayloadAction<Pipeline | undefined>) => {
      state.selectedPipeline = payload;
    },
    setSelectedSource: (state, { payload }: PayloadAction<Source>) => {
      state.selectedSource = payload;
    },
    setAddDestinationModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isAddDestinationModalOpen = payload;
    },
    setIsSourceDeleted: (state, { payload }: PayloadAction<number>) => {
      state.isSourceDeleted = payload;
    },
    setFilterFormState: (state, { payload }: PayloadAction<INestedMultiFilterForm | null>) => {
      state.filterFormState = payload;
    },
    setSelectedTags: (state, { payload }: PayloadAction<Record<string, boolean> | null>) => {
      state.selectedTags = payload;
    },
    setTablePage: (state, { payload }: PayloadAction<number>) => {
      state.tablePage = payload;
    },
    restore: (_, action: PayloadAction<InitialState>) => action.payload,
  },
});

export const dataflowPageActions = dataflowPageSlice.actions;
export const dataflowPageReducer = dataflowPageSlice.reducer;
export const dataflowPageSliceName = dataflowPageSlice.name;
