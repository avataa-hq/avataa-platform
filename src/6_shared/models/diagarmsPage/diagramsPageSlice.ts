import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphData } from '6_shared/api/graph/types';
import { Graph3000Data } from '../diagrams';

interface State {
  selectedDiagram: null | GraphData;
  isLoadingDiagram: boolean;
  graphInitialData: Graph3000Data | null;
}

const initialState: State = {
  selectedDiagram: null,
  graphInitialData: null,
  isLoadingDiagram: false,
};

const diagramsPageSlice = createSlice({
  name: 'diagramsPage',
  initialState,
  reducers: {
    setSelectedDiagram: (state, { payload }: PayloadAction<GraphData | null>) => {
      state.selectedDiagram = payload;
    },
    setGraphInitialData: (state, { payload }: PayloadAction<Graph3000Data | null>) => {
      state.graphInitialData = payload;
    },
    setIsLoadingDiagram: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDiagram = action.payload;
    },
  },
});

export const diagramsPageActions = diagramsPageSlice.actions;
export const diagramsPageReducer = diagramsPageSlice.reducer;
export const diagramsPageSliceName = diagramsPageSlice.name;
