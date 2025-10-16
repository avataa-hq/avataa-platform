import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GraphData } from '6_shared/api/graph/types';
import { ConfigGraphNodeConfig } from '5_entites';

interface State {
  isCreateGraphModalOpen: boolean;
  isEditGraphDataModalOpen: boolean;
  isDeleteGraphModalOpen: boolean;
  isNodeOptionsModalOpen: boolean;
  selectedNode: ConfigGraphNodeConfig | null;
  // Power Bi Report on which an action will occur (delete, info etc.)
  selectedGraph: GraphData | null;
  // Power Bi Report that is displayed
  displayedGraph: GraphData | null;
}

const initialState: State = {
  isCreateGraphModalOpen: false,
  isEditGraphDataModalOpen: false,
  isDeleteGraphModalOpen: false,
  isNodeOptionsModalOpen: false,
  selectedNode: null,
  selectedGraph: null,
  displayedGraph: null,
};

const graphsSettingsPageSlice = createSlice({
  name: 'graphsSettingsPage',
  initialState,
  reducers: {
    setCreateGraphModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreateGraphModalOpen = payload;
    },
    setEditGraphDataModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditGraphDataModalOpen = payload;
    },
    setDeleteGraphModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeleteGraphModalOpen = payload;
    },
    setNodeOptionsModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.isNodeOptionsModalOpen = payload;
    },
    setSelectedNode: (state, { payload }: PayloadAction<State['selectedNode']>) => {
      state.selectedNode = payload;
    },
    setSelectedGraph: (state, { payload }: PayloadAction<State['selectedGraph']>) => {
      state.selectedGraph = payload;
    },
    setDisplayedGraph: (state, { payload }: PayloadAction<State['displayedGraph']>) => {
      state.displayedGraph = payload;
    },
    restore: (_, action: PayloadAction<State>) => action.payload,
  },
});

export const graphsSettingsPageActions = graphsSettingsPageSlice.actions;
export const graphsSettingsPageReducer = graphsSettingsPageSlice.reducer;
export const graphsSettingsPageSliceName = graphsSettingsPageSlice.name;
