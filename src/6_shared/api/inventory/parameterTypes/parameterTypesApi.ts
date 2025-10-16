import { objectTemplatesApi } from '6_shared';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import {
  CreateObjectTypeParamTypesBody,
  CreateParamTypeBody,
  GetObjectTypeParamTypesRequestParams,
  GetParamTypeHistoryRequestParam,
  InventoryParameterTypesModel,
  InventoryRequiredParameterTypesModel,
  UpdateParamTypeBody,
  UpdateValTypeBody,
  UpdateBatchOfParamTypesBody,
  UpdateBatchOfParamTypesCheckResponse,
} from './types';

const invalidateObjectTemplatesList = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  dispatch(objectTemplatesApi.util.invalidateTags([{ type: 'ObjectTemplates', id: 'LIST' }]));

  setTimeout(() => {
    dispatch(objectTemplatesApi.util.invalidateTags([{ type: 'ObjectTemplates', id: 'LIST' }]));
  }, 3000);
};

const getObjectTypeParamTypesQueryBuilder = (id: number, tprmsArr?: string[]) => {
  let url = `object_type/${id}/param_types/?`;
  if (tprmsArr && tprmsArr.length) {
    url += `tprm_ids=${tprmsArr.join('&tprm_ids=')}`;
  }

  return url;
};

export const parameterTypesApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getParamTypes: builder.query<InventoryParameterTypesModel[], void>({
      query: () => `param_types/`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createParamType: builder.mutation<InventoryParameterTypesModel, CreateParamTypeBody>({
      query: (body) => ({ url: `param_type/`, method: 'POST', body }),
      invalidatesTags: [
        { type: 'Objects', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: inventoryNewApiOptions,
    }),
    getParamTypeById: builder.query<InventoryParameterTypesModel, number>({
      query: (id) => `param_type/${id}`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteParamType: builder.mutation<void, number>({
      query: (id) => ({ url: `param_type/${id}`, method: 'DELETE' }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateObjectTemplatesList(dispatch);
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    updateParamType: builder.mutation<InventoryParameterTypesModel, UpdateParamTypeBody>({
      query: ({ id, ...body }) => ({ url: `param_type/${id}`, method: 'PATCH', body }),
      invalidatesTags: [
        { type: 'Objects', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectTypeParamTypes: builder.query<
      InventoryParameterTypesModel[],
      GetObjectTypeParamTypesRequestParams
    >({
      query: ({ id, tprm_ids, ...params }) => {
        return {
          url: getObjectTypeParamTypesQueryBuilder(id, tprm_ids),
          params,
        };
      },
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createObjectTypeParamTypes: builder.mutation<
      InventoryParameterTypesModel,
      CreateObjectTypeParamTypesBody
    >({
      query: ({ id, body }) => ({ url: `object_type/${id}/param_types/`, method: 'POST', body }),
      invalidatesTags: [
        { type: 'Objects', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: inventoryNewApiOptions,
    }),
    updateValType: builder.mutation<InventoryParameterTypesModel[], UpdateValTypeBody>({
      query: ({ id, ...body }) => ({
        url: `param_type/${id}/change_val_type/`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateObjectTemplatesList(dispatch);
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getRequiredParamTypes: builder.query<InventoryRequiredParameterTypesModel[], number>({
      query: (id) => `object_type/${id}/required_param_types/`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    searchParamTypes: builder.query<InventoryParameterTypesModel[], string>({
      query: (name) => ({ url: `search_param_types/`, params: { name } }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getParamTypeHistory: builder.query<
      InventoryParameterTypesModel[],
      GetParamTypeHistoryRequestParam
    >({
      query: ({ id, ...params }) => ({ url: `param_type/${id}/history`, params }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),

    // **********************************
    checkBatchOfParamTypesUpdate: builder.mutation<
      UpdateBatchOfParamTypesCheckResponse,
      UpdateBatchOfParamTypesBody
    >({
      query: ({ id, body }) => ({
        url: `param_types/${id}/batch_create_or_update_param_types?check=true`,
        method: 'POST',
        body,
      }),
      // invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),

    // **********************************
    updateBatchOfParamTypes: builder.mutation<any, UpdateBatchOfParamTypesBody>({
      query: ({ id, body }) => ({
        url: `param_types/${id}/batch_create_or_update_param_types?check=false`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});

export const { useCheckBatchOfParamTypesUpdateMutation, useUpdateBatchOfParamTypesMutation } =
  parameterTypesApi;
