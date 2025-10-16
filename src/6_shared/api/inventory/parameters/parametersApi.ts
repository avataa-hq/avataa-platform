import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { PromiseWithKnownReason } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { eventManagerApi } from '6_shared/api/eventManager';
import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import {
  DeleteParameterRequestParams,
  GetFullDataAboutMoLinkModel,
  GetFullDataAboutPrmLinkModel,
  GetFullDataAboutTwoWayMoLink,
  GetObjectParamsRequest,
  GetParameterHistoryRequestParams,
  GetParameterRequestParams,
  GetParameterValuesBody,
  IGetParameterDataModel,
  InventoryObjectLinkModel,
  InventoryObjectOutInLinkModel,
  InventoryParameterModel,
  MultipleCreateResponse,
  MultipleDeleteResponse,
  MultipleParameterDeleteBody,
  MultipleParameterUpdateBody,
  MultipleUpdateResponse,
} from './types';
import { searchApiV2 } from '../../searchV2';
import { IInventoryObjectParamsModel } from '../../../types';

const updateObjects = async (
  dispatch: ThunkDispatch<any, any, AnyAction>,
  queryFulfilled: PromiseWithKnownReason<{ data: any; meta: FetchBaseQueryMeta | undefined }, any>,
) => {
  try {
    await queryFulfilled;
    dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
    setTimeout(() => {
      dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
    }, 2000);
  } catch (error) {
    console.error(error);
  }
};

export const parametersApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectParams: builder.query<IInventoryObjectParamsModel[], GetObjectParamsRequest>({
      query: ({ object_id, tprm_id }) => ({
        url: tprm_id
          ? `object/${object_id}/parameters/?tprm_id=${tprm_id.join('&tprm_id=')}`
          : `object/${object_id}/parameters`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getParameter: builder.query<InventoryParameterModel, GetParameterRequestParams>({
      query: ({ object_id, param_type_id }) => ({
        url: `object/${object_id}/param_types/${param_type_id}/parameter/`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteParameter: builder.mutation<any, DeleteParameterRequestParams>({
      query: ({ object_id, param_type_id }) => ({
        url: `object/${object_id}/param_types/${param_type_id}/parameter/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await updateObjects(dispatch, queryFulfilled);
      },
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectOutLink: builder.query<InventoryObjectOutInLinkModel[], number>({
      query: (id) => ({
        url: `object/${id}/out_links/`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectInLink: builder.query<InventoryObjectOutInLinkModel[], number>({
      query: (id) => ({
        url: `object/${id}/in_links/`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectAllLink: builder.query<InventoryObjectLinkModel, number>({
      query: (id) => ({
        url: `object/${id}/links/`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getUniqueParamTypeValues: builder.query<string[], number>({
      query: (param_type_id) => ({
        url: `param_type/${param_type_id}/unique_values/`,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getParameterHistory: builder.query<string[], GetParameterHistoryRequestParams>({
      query: ({ id, ...params }) => ({
        url: `parameter/${id}/history`,
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getParameterValues: builder.query<InventoryParameterModel[], GetParameterValuesBody>({
      query: ({ id, body }) => ({
        url: `object/${id}/list_of_param_types/{param_type_id}/parameter/`,
        method: 'POST',
        body,
      }),
    }),
    multipleParameterUpdate: builder.mutation<
      MultipleUpdateResponse,
      MultipleParameterUpdateBody[]
    >({
      query: (body) => ({
        url: `multiple_parameter_update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(eventManagerApi.util.invalidateTags([{ type: 'Events', id: 'LIST' }]));
          setTimeout(() => {
            dispatch(
              searchApiV2.util.invalidateTags([
                { type: 'Objects', id: 'V2' },
                { type: 'Processes', id: 'LIST' },
              ]),
            );
          }, 1500);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    multipleParameterCreate: builder.mutation<
      MultipleCreateResponse,
      MultipleParameterUpdateBody[]
    >({
      query: (body) => ({
        url: `multiple_parameter_create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            searchApiV2.util.invalidateTags([
              { type: 'Objects', id: 'V2' },
              { type: 'Processes', id: 'LIST' },
            ]),
          );
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    multipleParameterDelete: builder.mutation<
      MultipleDeleteResponse,
      MultipleParameterDeleteBody[]
    >({
      query: (body) => ({
        url: `multiple_parameter_delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          setTimeout(() => {
            dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    getFullDataAboutPrmLink: builder.query<GetFullDataAboutPrmLinkModel, number[]>({
      query: (body) => ({
        url: `get_full_data_about_prm_link`,
        method: 'POST',
        body,
      }),
      extraOptions: inventoryNewApiOptions,
    }),
    getFullDataAboutMoLink: builder.query<GetFullDataAboutMoLinkModel, number[]>({
      query: (body) => ({
        url: `get_full_data_about_mo_link`,
        method: 'POST',
        body,
      }),
      extraOptions: inventoryNewApiOptions,
    }),
    getFullDataAboutTwoWayMoLink: builder.query<GetFullDataAboutTwoWayMoLink, number[]>({
      query: (body) => ({
        url: 'get_full_data_about_two_way_mo_link',
        method: 'POST',
        body,
      }),
      extraOptions: inventoryNewApiOptions,
    }),
    getParameterData: builder.query<IGetParameterDataModel[], number[]>({
      query: (body) => ({
        url: 'get_parameter_data',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});
