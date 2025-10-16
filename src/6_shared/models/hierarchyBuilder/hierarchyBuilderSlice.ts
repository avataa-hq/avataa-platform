import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hierarchy, HierarchyLevel } from '6_shared/api/hierarchy/types';

interface HierarchyBuilderState {
  isAddLevelDialogOpen: boolean;
  isEditLevelDialogOpen: boolean;
  isEditHierarchyDialogOpen: boolean;
  isAddHierarchyDialogOpen: boolean;
  isDeleteHierarchyDialogOpen: boolean;
  isDeleteHierarchyLevelDialogOpen: boolean;
  hierarchyLevelToEdit: HierarchyLevel | null;
  selectedHierarchy: Hierarchy | null;
  selectedHierarchyLevel: {
    data: HierarchyLevel;
    parentData?: HierarchyLevel;
  } | null;
  activeHierarchyMenuItem: Hierarchy | null;
}

const initialState: HierarchyBuilderState = {
  isEditLevelDialogOpen: false,
  isEditHierarchyDialogOpen: false,
  isAddHierarchyDialogOpen: false,
  isAddLevelDialogOpen: false,
  isDeleteHierarchyDialogOpen: false,
  isDeleteHierarchyLevelDialogOpen: false,
  hierarchyLevelToEdit: null,
  selectedHierarchy: null,
  selectedHierarchyLevel: null,
  activeHierarchyMenuItem: null,
};

const hierarchyBuilderSlice = createSlice({
  name: 'hierarchyBuilder',
  initialState,
  reducers: {
    setSelectedHierarchy: (state, action) => {
      state.selectedHierarchy = action.payload;
    },
    setSelectedHierarchyLevel: (state, action) => {
      state.selectedHierarchyLevel = action.payload;
    },
    setIsEditLevelDialogOpen: (state, action) => {
      state.isEditLevelDialogOpen = action.payload;
    },
    setIsAddLevelDialogOpen: (state, action) => {
      state.isAddLevelDialogOpen = action.payload;
    },
    setIsEditHierarchyDialogOpen: (state, action) => {
      state.isEditHierarchyDialogOpen = action.payload;
    },
    setIsAddHierarchyDialogOpen: (state, action) => {
      state.isAddHierarchyDialogOpen = action.payload;
    },
    setIsDeleteHierarchyDialogOpen: (state, action) => {
      state.isDeleteHierarchyDialogOpen = action.payload;
    },
    setIsDeleteHierarchyLevelDialogOpen: (state, action) => {
      state.isDeleteHierarchyLevelDialogOpen = action.payload;
    },
    setActiveHierarchyMenuItem: (state, action) => {
      state.activeHierarchyMenuItem = action.payload;
    },

    restore: (_, action: PayloadAction<HierarchyBuilderState>) => action.payload,
  },
});

export const hierarchyBuilderActions = hierarchyBuilderSlice.actions;
export const hierarchyBuilderReducer = hierarchyBuilderSlice.reducer;
export const hierarchyBuilderSliceName = hierarchyBuilderSlice.name;
