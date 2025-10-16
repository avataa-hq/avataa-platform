import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  // Modals
  isVariableModalOpen: boolean;
  isGroupModalOpen: boolean;
  isFilterModalOpen: boolean;
  isJoinModalOpen: boolean;
  isSourceModalOpen: boolean;
  isSplitModalOpen: boolean;
  isChoiceModalOpen: boolean;
  isCreateModalOpen: boolean;
  isLoadModalOpen: boolean;
  isPublishModalOpen: boolean;
  isTriggerModalOpen: boolean;
  isDataflowDiagramOpen: boolean;
  isDmnModalOpen: boolean;
  isAggregateModalOpen: boolean;
  isDataPreviewModalOpen: boolean;
  isMapModalOpen: boolean;
}

const initialState: State = {
  // Modals
  isVariableModalOpen: false,
  isGroupModalOpen: false,
  isFilterModalOpen: false,
  isJoinModalOpen: false,
  isSourceModalOpen: false,
  isSplitModalOpen: false,
  isChoiceModalOpen: false,
  isCreateModalOpen: false,
  isLoadModalOpen: false,
  isPublishModalOpen: false,
  isTriggerModalOpen: false,
  isDataflowDiagramOpen: false,
  isDmnModalOpen: false,
  isAggregateModalOpen: false,
  isDataPreviewModalOpen: false,
  isMapModalOpen: false,
};

const dataflowDiagramPageSlice = createSlice({
  name: 'dataflowDiagramPage',
  initialState,
  reducers: {
    // Modals reducers
    setIsVariableModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isVariableModalOpen = payload;
    },
    setIsGroupModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isGroupModalOpen = payload;
    },
    setIsFilterModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isFilterModalOpen = payload;
    },
    setIsJoinModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isJoinModalOpen = payload;
    },
    setIsSourceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isSourceModalOpen = payload;
    },
    setIsSplitModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isSplitModalOpen = payload;
    },
    setIsChoiceModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isChoiceModalOpen = payload;
    },
    setIsCreateModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreateModalOpen = payload;
    },
    setIsLoadModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadModalOpen = payload;
    },
    setIsPublishModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isPublishModalOpen = payload;
    },
    setIsTriggerModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isTriggerModalOpen = payload;
    },
    setIsDataflowDiagramOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDataflowDiagramOpen = payload;
    },
    setIsDmnModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDmnModalOpen = payload;
    },
    setIsAggregateModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isAggregateModalOpen = payload;
    },
    setIsDataPreviewModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDataPreviewModalOpen = payload;
    },
    setIsMapModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isMapModalOpen = payload;
    },
    // Reducer for restoring slice state
    restore: (_, action: PayloadAction<State>) => action.payload,
  },
});

export const dataflowDiagramPageActions = dataflowDiagramPageSlice.actions;
export const dataflowDiagramPageReducer = dataflowDiagramPageSlice.reducer;
export const dataflowDiagramPageSliceName = dataflowDiagramPageSlice.name;
