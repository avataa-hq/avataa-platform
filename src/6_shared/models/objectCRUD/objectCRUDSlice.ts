import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILineGeometry, ObjectCRUDModeType } from './types';

interface IObjectCRUD {
  objectTmoId: number | null;
  // objectName: string;
  // objectId: number | null;
  // tmoParentId: number | null;
}

interface IObjectCRUDComponentUi {
  isObjectCRUDModalOpen: boolean;
  isObjectDeleteModalOpen: boolean;
  objectCRUDComponentMode: ObjectCRUDModeType;
}

interface IObjectCRUDCoordinates {
  latitude: number | null;
  longitude: number | null;
}

interface IObjectPointDetails {
  objectId: number;
  objectName: string;
}

interface IGeometryPointsDetails {
  point_a_details: IObjectPointDetails | null;
  point_b_details: IObjectPointDetails | null;
}

interface IObjectCRUDInitialState {
  objectCRUDData: IObjectCRUD;
  objectCRUDComponentUi: IObjectCRUDComponentUi;
  isObjectsActive: boolean;
  objectCoordinates: IObjectCRUDCoordinates | null;
  lineGeometry: ILineGeometry | null;
  geometryPointsDetails: IGeometryPointsDetails | null;
  lastSelectedTmoId: number | null;
  createChildObjectId: number | null;
  duplicateObject: boolean;
  templateFormData: Record<string, any> | null;
  lastCreatedObjectId: number | null;
  parentIdFromTemplates: number | null;
}

const initialState: IObjectCRUDInitialState = {
  objectCRUDData: {
    objectTmoId: null,
    // objectName: 'Object Name',
    // objectId: null,
    // tmoParentId: null,
  },
  objectCRUDComponentUi: {
    isObjectCRUDModalOpen: false,
    isObjectDeleteModalOpen: false,
    objectCRUDComponentMode: 'creating',
  },
  isObjectsActive: true,
  objectCoordinates: null,
  lineGeometry: null,
  geometryPointsDetails: null,
  lastSelectedTmoId: null,
  createChildObjectId: null,
  duplicateObject: false,
  templateFormData: null,
  lastCreatedObjectId: null,
  parentIdFromTemplates: null,
};

const objectCRUDSlice = createSlice({
  name: 'objectCRUD',
  initialState,
  reducers: {
    setObjectTmoId(state, action: PayloadAction<number | null>) {
      state.objectCRUDData.objectTmoId = action.payload;
    },
    // setObjectId(state, action: PayloadAction<number | null>) {
    //   state.objectCRUDData.objectId = action.payload;
    // },
    // setTmoParentId(state, action: PayloadAction<number | null>) {
    //   state.objectCRUDData.tmoParentId = action.payload;
    // },
    // setObjectName(state, action: PayloadAction<string>) {
    //   state.objectCRUDData.objectName = action.payload;
    // },
    setIsObjectCRUDModalOpen(state, action: PayloadAction<boolean>) {
      state.objectCRUDComponentUi.isObjectCRUDModalOpen = action.payload;
    },
    setIsObjectDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.objectCRUDComponentUi.isObjectDeleteModalOpen = action.payload;
    },
    setObjectCRUDComponentMode(state, action: PayloadAction<'creating' | 'editing'>) {
      state.objectCRUDComponentUi.objectCRUDComponentMode = action.payload;
    },
    setIsObjectsActive(state, action: PayloadAction<boolean>) {
      state.isObjectsActive = action.payload;
    },
    setNewObjectCoordinates(state, action: PayloadAction<IObjectCRUDCoordinates | null>) {
      state.objectCoordinates = action.payload;
    },
    setLineCoordinates(state, action: PayloadAction<ILineGeometry | null>) {
      state.lineGeometry = action.payload;
    },
    setGeometryPointsDetails(state, action: PayloadAction<IGeometryPointsDetails | null>) {
      state.geometryPointsDetails = action.payload;
    },
    setLastSelectedTmoId(state, action: PayloadAction<number | null>) {
      state.lastSelectedTmoId = action.payload;
    },
    setCreateChildObjectId(state, action: PayloadAction<number | null>) {
      state.createChildObjectId = action.payload;
    },
    setDuplicateObject(state, action: PayloadAction<boolean>) {
      state.duplicateObject = action.payload;
    },
    setTemplateFormData(state, action: PayloadAction<Record<string, any> | null>) {
      state.templateFormData = action.payload;
    },
    setLastCreatedObjectId(state, action: PayloadAction<number | null>) {
      state.lastCreatedObjectId = action.payload;
    },
    setParentIdFromTemplates(state, action: PayloadAction<number | null>) {
      state.parentIdFromTemplates = action.payload;
    },

    restore: (_, action: PayloadAction<IObjectCRUDInitialState>) => action.payload,
  },
});

export const objectCRUDActions = objectCRUDSlice.actions;
export const objectCRUDReducer = objectCRUDSlice.reducer;
export const objectCRUDSliceName = objectCRUDSlice.name;
