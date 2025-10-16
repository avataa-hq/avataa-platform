import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import {
  CreateMultiplePermissionsBody,
  CreatePermissionsBody,
  InventoryPermissionsModel,
  UpdatePermissionsBody,
} from './types';

export const securityApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectTypePermissions: builder.query<InventoryPermissionsModel[], number>({
      query: (tmo_id) => ({
        url: `security/object_type/${tmo_id}`,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
      keepUnusedDataFor: 0,
    }),
    createObjectTypePermission: builder.mutation<void, CreatePermissionsBody>({
      query: (body) => ({
        url: `security/object_type/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createMultipleObjectTypePermission: builder.mutation<void, CreateMultiplePermissionsBody>({
      query: (body) => ({
        url: `security/object_type/multiple`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteObjectTypePermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `security/object_type/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteMultipleObjectTypePermission: builder.mutation<void, number[]>({
      query: (body) => ({
        url: 'security/object_type/multiple',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    updateObjectTypePermission: builder.mutation<void, UpdatePermissionsBody>({
      query: ({ id, body }) => ({
        url: `security/object_type/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectPermissions: builder.query<InventoryPermissionsModel[], number>({
      query: (mo_id) => ({
        url: `security/objects/${mo_id}`,
      }),
      providesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createObjectPermission: builder.mutation<void, CreatePermissionsBody>({
      query: (body) => ({
        url: `security/objects/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createMultipleObjectPermission: builder.mutation<void, CreateMultiplePermissionsBody>({
      query: (body) => ({
        url: `security/objects/multiple`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteObjectPermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `security/objects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteMultipleObjectPermission: builder.mutation<void, number[]>({
      query: (body) => ({
        url: 'security/objects/multiple',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    updateObjectPermission: builder.mutation<void, UpdatePermissionsBody>({
      query: ({ id, body }) => ({
        url: `security/object/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getParamTypePermissions: builder.query<InventoryPermissionsModel[], number>({
      query: (id) => ({
        url: `security/param_type/${id}`,
      }),
      providesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    createParamTypePermission: builder.mutation<void, CreatePermissionsBody>({
      query: (body) => ({
        url: `security/param_type/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteParamTypePermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `security/param_type/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    updateParamTypePermission: builder.mutation<void, UpdatePermissionsBody>({
      query: ({ id, body }) => ({
        url: `security/param_type/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Security', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});
