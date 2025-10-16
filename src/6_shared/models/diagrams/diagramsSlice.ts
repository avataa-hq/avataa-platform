import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IInventoryObjectModel } from '6_shared';
import { INode } from '@antv/g6';
import { IConnectivityDiagramData } from '5_entites/inventory/graph/connectivityDiagram/modal/types';
import {
  defaultGraphLinksConfig,
  IDefaultGraphLink,
} from '5_entites/inventory/graph/configGraph/lib';
import { GraphTmosWithColorRanges } from './types';

interface State {
  graph: any | null;
  currentGraphKey?: string | null;
  currentTableNodeToConnectivity: INode | null;
  connectivityDiagramOutputData: IConnectivityDiagramData | null;
  connectivityDiagramSelectedEdgeObjects: IInventoryObjectModel[];
  connectivityDiagramSelectedObject: IInventoryObjectModel | null;
  sizeExceededModalState: {
    isOpen: boolean;
    size: number;
    diagramKey: string;
  };
  graphTmosWithColorRanges: GraphTmosWithColorRanges | null;
  defaultGraphLinks: Record<string, IDefaultGraphLink>;
}

const initialState: State = {
  graph: null,
  connectivityDiagramOutputData: null,
  currentTableNodeToConnectivity: null,
  connectivityDiagramSelectedEdgeObjects: [],
  connectivityDiagramSelectedObject: null,
  currentGraphKey: null,
  sizeExceededModalState: {
    isOpen: false,
    size: 0,
    diagramKey: '',
  },
  graphTmosWithColorRanges: null,
  defaultGraphLinks: defaultGraphLinksConfig,
};

const diagramsSlice = createSlice({
  name: 'diagrams',
  initialState,
  reducers: {
    setGraph: (state, { payload }: PayloadAction<any | null>) => {
      state.graph = payload;
    },
    setCurrentGraphKey(state, action: PayloadAction<string | null>) {
      state.currentGraphKey = action.payload;
    },
    setConnectivityDiagramOutputData(
      state,
      action: PayloadAction<IConnectivityDiagramData | null>,
    ) {
      state.connectivityDiagramOutputData = action.payload;
    },
    setConnectivityDiagramSelectedEdgeObjects(
      state,
      action: PayloadAction<IInventoryObjectModel[]>,
    ) {
      state.connectivityDiagramSelectedEdgeObjects = action.payload;
    },
    setCurrentTableNodeToConnectivity(state, action: PayloadAction<INode | null>) {
      state.currentTableNodeToConnectivity = action.payload;
    },
    setConnectivityDiagramSelectedObject(
      state,
      action: PayloadAction<IInventoryObjectModel | null>,
    ) {
      state.connectivityDiagramSelectedObject = action.payload;
    },
    setIsSizeExceededModalOpen: (
      state,
      { payload }: PayloadAction<Partial<State['sizeExceededModalState']>>,
    ) => {
      const currentModalState = current(state).sizeExceededModalState;
      state.sizeExceededModalState = { ...currentModalState, ...payload };
    },
    setGraphTmosWithColorRanges: (
      state,
      { payload }: PayloadAction<GraphTmosWithColorRanges | null>,
    ) => {
      state.graphTmosWithColorRanges = payload;
    },
    setDefaultGraphLinks: (
      state,
      { payload }: PayloadAction<Record<string, IDefaultGraphLink>>,
    ) => {
      state.defaultGraphLinks = payload;
    },
  },
});

export const diagramsActions = diagramsSlice.actions;
export const diagramsReducer = diagramsSlice.reducer;
export const diagramsSliceName = diagramsSlice.name;
