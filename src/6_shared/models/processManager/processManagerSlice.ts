import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColorRangeModel } from '6_shared';
import { IProcessManagerData, ProcessManagerPageMode, SelectedColumn } from './types';

const initialState: IProcessManagerData = {
  multiSearchValue: '',
  // isOpenLeftPanel: true,
  selectedColumnForColoring: undefined,
  // isOpenSelectingColorModal: false,
  // isOpenSettingColorModal: false,
  tprmColIds: [],
  selectedGroup: null,
  colorRangesData: [],
  groupedColorRangesData: null,
  // isLinkedObjectsModalOpen: false,
  // isRelatedObjectsModalOpen: false,
  isOpenMapActive: false,
  isOpenDashboardActive: false,
  viewType: 'list',
};

const processManagerSlice = createSlice({
  name: 'processManagerData',
  initialState,
  reducers: {
    setPmTmoId: (state, action: PayloadAction<number>) => {
      state.pmTmoId = action.payload;
    },
    setMultiSearchValue: (state, action: PayloadAction<string>) => {
      state.multiSearchValue = action.payload;
    },
    // setIsOpenLeftPanel: (state, action: PayloadAction<boolean>) => {
    //   state.isOpenLeftPanel = action.payload;
    // },

    setSelectedColumnForColoring: (state, action: PayloadAction<SelectedColumn>) => {
      state.selectedColumnForColoring = action.payload;
    },
    // setIsOpenSelectingColorModal: (s, a: PayloadAction<boolean>) => {
    //   s.isOpenSelectingColorModal = a.payload;
    // },
    // setIsOpenSettingColorModal: (s, a: PayloadAction<boolean>) => {
    //   s.isOpenSettingColorModal = a.payload;
    // },
    setTprmColIds: (state, action: PayloadAction<string[]>) => {
      state.tprmColIds = action.payload;
    },
    setColorRangesData: (state, action: PayloadAction<IColorRangeModel[]>) => {
      state.colorRangesData = action.payload;
    },
    setGroupedColorRangesData: (
      state,
      action: PayloadAction<Record<string, IColorRangeModel[]>>,
    ) => {
      state.groupedColorRangesData = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroup = action.payload;
    },
    // setIsLinkedObjectsModalOpen: (state, action: PayloadAction<boolean>) => {
    //   state.isLinkedObjectsModalOpen = action.payload;
    // },
    // setIsRelatedObjectsModalOpen: (state, action: PayloadAction<boolean>) => {
    //   state.isRelatedObjectsModalOpen = action.payload;
    // },
    setIsOpenMapActive: (state, action: PayloadAction<boolean>) => {
      state.isOpenMapActive = action.payload;
    },
    setIsOpenDashboardActive: (state, action: PayloadAction<boolean>) => {
      state.isOpenDashboardActive = action.payload;
    },

    setViewType: (state, action: PayloadAction<ProcessManagerPageMode>) => {
      state.viewType = action.payload;
    },

    restore: (_, action: PayloadAction<IProcessManagerData>) => action.payload,
  },
});

export const processManagerActions = processManagerSlice.actions;
export const processManagerReducer = processManagerSlice.reducer;
export const processManagerSliceName = processManagerSlice.name;
