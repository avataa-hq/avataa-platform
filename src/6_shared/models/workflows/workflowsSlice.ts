import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BpmnModeler, { ImportXMLResult } from 'bpmn-js/lib/Modeler';
import { IProcessDefinition } from '6_shared';

interface ProcessDefinitionActiveItem {
  isCollapsed: boolean;
  item: IProcessDefinition | null;
}

interface ProcessDefinitionNewItem {
  isCollapsed: boolean;
  item: (IProcessDefinition & { diagramXml?: string }) | null;
}

interface SaveWarningModalState {
  isOpen: boolean;
  resolveFn: ((value: void) => void) | null;
  rejectFn: (() => void) | null;
}

interface IWorkflows {
  newItem: ProcessDefinitionNewItem;
  activeItem: ProcessDefinitionActiveItem;
  isCreateModalActive: boolean;
  isEditModalActive: boolean;
  isDeleteModalActive: boolean;
  isUploadModalActive: boolean;
  saveWarningModalState: SaveWarningModalState;
  createNewDiagramFn?: () => Promise<ImportXMLResult>;
  bpmnModeler: BpmnModeler | null;
  isDiagramChanged?: boolean;
  uniqueWorkflowsNames: string[];
}

const initialState: IWorkflows = {
  newItem: {
    isCollapsed: false,
    item: null,
  },
  activeItem: {
    isCollapsed: false,
    item: null,
  },
  isCreateModalActive: false,
  isEditModalActive: false,
  isDeleteModalActive: false,
  isUploadModalActive: false,
  saveWarningModalState: {
    isOpen: false,
    resolveFn: null,
    rejectFn: null,
  },
  bpmnModeler: null,
  isDiagramChanged: false,
  uniqueWorkflowsNames: [],
};

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setActiveItem(state, action: PayloadAction<IWorkflows['activeItem']>) {
      state.activeItem = action.payload;
    },
    setNewItem(state, action: PayloadAction<IWorkflows['newItem']>) {
      state.newItem = action.payload;
    },
    setIsCreateModalActive(state, action: PayloadAction<boolean>) {
      state.isCreateModalActive = action.payload;
    },
    setIsEditModalActive(state, action: PayloadAction<boolean>) {
      state.isEditModalActive = action.payload;
    },
    setIsDeleteModalActive(state, action: PayloadAction<boolean>) {
      state.isDeleteModalActive = action.payload;
    },
    setIsUploadModalActive(state, action: PayloadAction<boolean>) {
      state.isUploadModalActive = action.payload;
    },
    setSaveWarningModalState(state, action: PayloadAction<Partial<SaveWarningModalState>>) {
      state.saveWarningModalState = { ...state.saveWarningModalState, ...action.payload };
    },
    setCreateNewDiagramFn(state, action: PayloadAction<() => Promise<ImportXMLResult>>) {
      state.createNewDiagramFn = action.payload;
    },
    setIsDiagramChanged(state, action: PayloadAction<boolean>) {
      state.isDiagramChanged = action.payload;
    },
    setBpmnModeler(state, action: PayloadAction<IWorkflows['bpmnModeler']>) {
      state.bpmnModeler = action.payload;
    },
    setUniqueWorkflowsNames(state, action: PayloadAction<IWorkflows['uniqueWorkflowsNames']>) {
      state.uniqueWorkflowsNames = action.payload;
    },
    restore: (_, action: PayloadAction<IWorkflows>) => action.payload,
  },
});

export const workflowsActions = workflowsSlice.actions;
export const workflowsReducer = workflowsSlice.reducer;
export const workflowsSliceName = workflowsSlice.name;
