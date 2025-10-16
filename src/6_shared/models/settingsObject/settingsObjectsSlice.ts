import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryObjectType, InventoryParameterType } from '6_shared/api/inventory/types';
import { v4 } from 'uuid';

type IArrayOfGroupsObjects = {
  group: string;
  id: string;
};

interface IParamState {
  name: string;
  isErrorName: boolean;
  errorNameMessage: string;
  description: string;
  group: string | null;
  type:
    | 'str'
    | 'int'
    | 'float'
    | 'bool'
    | 'date'
    | 'datetime'
    | 'mo_link'
    | 'prm_link'
    | 'formula'
    | 'sequence'
    | 'user_link'
    | 'two-way link'
    | 'enum';
  constraint: boolean;
  regex: string;
  isErrorRegex: boolean;
  errorRegexMessage: string;
  intMin: string;
  isErrorIntMin: boolean;
  errorIntMinMessage: string;
  intMax: string;
  isErrorIntMax: boolean;
  errorIntMaxMessage: string;
  floatMin: string;
  isErrorFloatMin: boolean;
  errorFloatMinMessage: string;
  floatMax: string;
  isErrorFloatMax: boolean;
  errorFloatMaxMessage: string;
  objLink: null | InventoryObjectType;
  isErrorObjLink: boolean;
  errorObjLinkMessage: string;
  paramLink: null | InventoryParameterType;
  isErrorParamLink: boolean;
  errorParamLinkMessage: string;
  internalPrmLinkFilter: null | InventoryParameterType;
  isErrorInternal: boolean;
  errorInternalMessage: string;
  externalPrmLinkFilter: null | InventoryParameterType;
  isErrorExternal: boolean;
  errorExternalMessage: string;
  formula: string;
  isErrorFormula: boolean;
  errorFormulaMessage: string;
  multiple: boolean;
  required: boolean;
  searchable: boolean;
  automation: boolean;
  returnable: boolean;
  fieldValue: null | string | string[] | boolean[] | number[];
  sequenceConstraint: InventoryParameterType | null;
  isErrorSequenceConstraint: boolean;
  errorSequenceConstraintMessage: string;
  tmoWayMoLink: InventoryParameterType | null;
  isErrorTwoWayMoLink: boolean;
  errorTwoWayMoLinkMessage: string;
  enumConstraint: string[];
  isErrorEnumConstraint: boolean;
}

interface IInitialState {
  objType: null | InventoryObjectType;
  paramType: null | InventoryParameterType;
  paramState: IParamState;
  paramTypeDataAtTheStartEditing: null | InventoryParameterType;
  isCreateObjectModalgOpen: boolean;
  isEditObjectModalOpen: boolean;
  isDeleteObjectModalOpen: boolean;
  isShowObjectModalOpen: boolean;
  isCreateParamModalOpen: boolean;
  isEditParamModalOpen: boolean;
  isDeleteParamModalOpen: boolean;
  isShowParamModalOpen: boolean;
  isForceModalOpen: boolean;
  isRequiredModalOpen: boolean;
  isRequiredAndMultipleModalOpen: boolean;
  arrayOfGroupsObjects: IArrayOfGroupsObjects[];
  nameOfSelectedGroup: string | null;
  isOpenSelectingColorModal: boolean;
  isOpenSettingColorModal: boolean;
  isChangedTypeInValueWithColorPalete: boolean;
  limitForColorPaleteRequst: number;
  elementIdToScroll: string | null;
}

const initialState: IInitialState = {
  objType: null,
  paramType: null,
  paramState: {
    name: '',
    isErrorName: false,
    errorNameMessage: ' ',
    description: '',
    group: '',
    type: 'str',
    constraint: false,
    regex: '',
    isErrorRegex: false,
    errorRegexMessage: ' ',
    intMin: '0',
    isErrorIntMin: false,
    errorIntMinMessage: ' ',
    intMax: '0',
    isErrorIntMax: false,
    errorIntMaxMessage: ' ',
    floatMin: '0',
    isErrorFloatMin: false,
    errorFloatMinMessage: ' ',
    floatMax: '0',
    isErrorFloatMax: false,
    errorFloatMaxMessage: ' ',
    objLink: null,
    isErrorObjLink: false,
    errorObjLinkMessage: ' ',
    paramLink: null,
    isErrorParamLink: false,
    errorParamLinkMessage: ' ',
    internalPrmLinkFilter: null,
    errorInternalMessage: ' ',
    isErrorInternal: false,
    externalPrmLinkFilter: null,
    errorExternalMessage: ' ',
    isErrorExternal: false,
    formula: '',
    isErrorFormula: false,
    errorFormulaMessage: ' ',
    sequenceConstraint: null,
    isErrorSequenceConstraint: false,
    errorSequenceConstraintMessage: ' ',
    tmoWayMoLink: null,
    isErrorTwoWayMoLink: false,
    errorTwoWayMoLinkMessage: ' ',
    enumConstraint: [],
    isErrorEnumConstraint: false,
    multiple: false,
    required: false,
    searchable: false,
    automation: false,
    returnable: false,
    fieldValue: null,
  },
  paramTypeDataAtTheStartEditing: null,
  isCreateObjectModalgOpen: false,
  isEditObjectModalOpen: false,
  isDeleteObjectModalOpen: false,
  isShowObjectModalOpen: false,
  isCreateParamModalOpen: false,
  isEditParamModalOpen: false,
  isDeleteParamModalOpen: false,
  isShowParamModalOpen: false,
  isForceModalOpen: false,
  isRequiredModalOpen: false,
  isRequiredAndMultipleModalOpen: false,
  arrayOfGroupsObjects: [],
  nameOfSelectedGroup: null,
  isOpenSelectingColorModal: false,
  isOpenSettingColorModal: false,
  isChangedTypeInValueWithColorPalete: false,
  limitForColorPaleteRequst: 1000,
  elementIdToScroll: null,
};

const settingsObjectSlice = createSlice({
  name: 'settingsObject',
  initialState,
  reducers: {
    setObjType(state, action) {
      state.objType = action.payload;
    },
    setParamType(state, action) {
      state.paramType = action.payload;
    },
    setParamState(state, action) {
      state.paramState = action.payload;
    },
    setArrayOfGroupsObjects(state, action) {
      const arrGroup: string[] = [];

      action.payload?.forEach((item: IArrayOfGroupsObjects) => {
        if (item.group && !arrGroup.includes(item.group)) {
          arrGroup.push(item.group);
        }
      });

      const arrayOfObjGroup = arrGroup
        .filter((g): g is string => typeof g === 'string')
        .sort((a, b) => a.localeCompare(b))
        .map((group) => ({ group, id: v4() }));

      arrayOfObjGroup.push({ group: 'No group', id: v4() });

      state.arrayOfGroupsObjects = arrayOfObjGroup;
    },
    setNameOfSelectedGroup(state, action) {
      state.nameOfSelectedGroup = action.payload;
    },
    setParamTypeDataAtTheStartEditing(state, action) {
      state.paramTypeDataAtTheStartEditing = action.payload;
    },
    setIsCreateObjectModalOpen(state, action) {
      state.isCreateObjectModalgOpen = action.payload;
    },
    setIsEditObjectModalOpen(state, action) {
      state.isEditObjectModalOpen = action.payload;
    },
    setIsDeleteObjectModalOpen(state, action) {
      state.isDeleteObjectModalOpen = action.payload;
    },
    setIsShowObjectModalOpen(state, action) {
      state.isShowObjectModalOpen = action.payload;
    },
    setIsCreateParamModalOpen(state, action) {
      state.isCreateParamModalOpen = action.payload;
    },
    setIsEditParamModalOpen(state, action) {
      state.isEditParamModalOpen = action.payload;
    },
    setIsDeleteParamModalOpen(state, action) {
      state.isDeleteParamModalOpen = action.payload;
    },
    setIsShowParamModalOpen(state, action) {
      state.isShowParamModalOpen = action.payload;
    },
    setIsForceModalOpen(state, action) {
      state.isForceModalOpen = action.payload;
    },
    setIsRequiredModalOpen(state, action) {
      state.isRequiredModalOpen = action.payload;
    },
    setIsRequiredAndMultipleModalOpen(state, action: PayloadAction<boolean>) {
      state.isRequiredAndMultipleModalOpen = action.payload;
    },
    setIsOpenSelectingColorModal(state, action: PayloadAction<boolean>) {
      state.isOpenSelectingColorModal = action.payload;
    },
    setIsOpenSettingColorModal(state, action: PayloadAction<boolean>) {
      state.isOpenSettingColorModal = action.payload;
    },
    setIsChangedTypeInValueWithColorPalete(state, action: PayloadAction<boolean>) {
      state.isChangedTypeInValueWithColorPalete = action.payload;
    },
    setLimitForColorPaleteRequst(state, action: PayloadAction<number>) {
      state.limitForColorPaleteRequst = action.payload;
    },

    setElementIdToScroll(state, action: PayloadAction<string | null>) {
      state.elementIdToScroll = action.payload;
    },

    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const settingsObjectActions = settingsObjectSlice.actions;
export const settingsObjectReducer = settingsObjectSlice.reducer;
export const settingsObjectSliceName = settingsObjectSlice.name;
