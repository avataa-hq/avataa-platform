import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import {
  CreateObjectTypeBody,
  DeleteObjectTypeRequestParams,
  GetChildrenTmoDataByTmoIdRequestParams,
  GetObjectTypeHistoryRequestParams,
  IGetObjectTypeRqParams,
  InventoryObjectTypesModel,
  UpdateObjectTypeParams,
} from './types';

const transformObjectTypesToQuery = (ids: number[] | undefined) => {
  const query = `object_types/`;

  if (!ids || !ids.length) return query;

  const withIds = ids.reduce((acc, id) => {
    let str = acc;
    str += `object_types_ids=${id}&`;
    return str;
  }, ``);

  return `${query}?${withIds}`;
};

export const objectTypesApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectTypes: builder.query<InventoryObjectTypesModel[], IGetObjectTypeRqParams | void>({
      query: (params) => ({
        url: transformObjectTypesToQuery(params?.object_types_ids),
        params: { with_tprms: params?.with_tprms },
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createObjectType: builder.mutation<InventoryObjectTypesModel, CreateObjectTypeBody>({
      query: (body) => ({
        url: `object_type/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectTypeById: builder.query<InventoryObjectTypesModel, number>({
      query: (id) => `object_type/${id}`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteObjectType: builder.mutation<void, DeleteObjectTypeRequestParams>({
      query: ({ id, ...params }) => ({
        url: `object_type/${id}`,
        method: 'DELETE',
        params,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    updateObjectType: builder.mutation<InventoryObjectTypesModel, UpdateObjectTypeParams>({
      query: ({ id, ...body }) => ({
        url: `object_type/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectTypesChild: builder.query<InventoryObjectTypesModel[], number>({
      query: (parent_id) => `child_object_types/${parent_id}/`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    searchObjectTypes: builder.query<InventoryObjectTypesModel[], string>({
      query: (name) => ({ url: `search_obj_types/`, params: { name } }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectTypeHistory: builder.query<
      InventoryObjectTypesModel[], // TODO Я не уверен, что приходит именно этот тип. Нужно перепроверить
      GetObjectTypeHistoryRequestParams
    >({
      query: ({ id, ...params }) => ({ url: `object_type/${id}/history`, params }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getBreadcrumbs: builder.query<InventoryObjectTypesModel[], number>({
      query: (obj_type_id) => `breadcrumbs/${obj_type_id}/`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getAllChildrenTmoIdByTmo: builder.query<number[], number>({
      query: (tmoId) => `/object_type/${tmoId}/all_children_tmo_ids`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getChildrenTmoDataByTmoId: builder.query<
      InventoryObjectTypesModel[],
      GetChildrenTmoDataByTmoIdRequestParams
    >({
      query: ({ tmoId, ...params }) => ({
        url: `/object_type/${tmoId}/all_children_tmos_with_data`,
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});
