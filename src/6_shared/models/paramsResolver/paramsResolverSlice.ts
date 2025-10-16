import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultipleParameterUpdateBody, UpdateMultipleObjectsBody } from '6_shared';
import { ParentIDOption } from '5_entites';

interface IParamsResolver {
  isParamsResolverOpen: boolean;
  updateParamsBody: MultipleParameterUpdateBody[] | null;
  updateObjectBody: UpdateMultipleObjectsBody | null;
  parentIdOptions: Record<string, ParentIDOption> | null;
}

const initialState: IParamsResolver = {
  isParamsResolverOpen: false,
  updateParamsBody: null,
  updateObjectBody: null,
  parentIdOptions: null,
};

const paramsResolverSlice = createSlice({
  name: 'paramsResolver',
  initialState,
  reducers: {
    setIsParamsResolverOpen: (state, action) => {
      state.isParamsResolverOpen = action.payload;
    },
    setUpdateParamsBody: (state, action: PayloadAction<MultipleParameterUpdateBody[] | null>) => {
      state.updateParamsBody = action.payload;
    },
    setUpdateObjectBody: (state, action: PayloadAction<UpdateMultipleObjectsBody | null>) => {
      state.updateObjectBody = action.payload;
    },
    setParentIdOptions: (state, action: PayloadAction<Record<string, ParentIDOption> | null>) => {
      state.parentIdOptions = action.payload;
    },

    restore: (_, action: PayloadAction<IParamsResolver>) => action.payload,
  },
});

export const paramsResolverActions = paramsResolverSlice.actions;
export const paramsResolverReducer = paramsResolverSlice.reducer;
export const paramsResolverSliceName = paramsResolverSlice.name;
