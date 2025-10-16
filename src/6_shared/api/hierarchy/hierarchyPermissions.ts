import { hierarchyBaseApi, hierarchyApiOptions } from './hierarchyApi';
import {
  CreateMultiplePermissionsBody,
  HierarchyPermissionsModel,
  UpdatePermissionsBody,
} from './types';

export const hierarchyPermissions = hierarchyBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllHierarchiesPermissions: build.query<HierarchyPermissionsModel[], void>({
      query: () => 'security/hierarchy',
      providesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    addHierarchyPermissions: build.mutation<void, CreateMultiplePermissionsBody>({
      query: (body) => ({
        url: 'security/hierarchy',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    getHierarchyPermissions: build.query<HierarchyPermissionsModel[], number>({
      query: (hierarchy_id) => ({
        url: `security/hierarchy/${hierarchy_id}`,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
      keepUnusedDataFor: 0,
    }),
    addHierarchiesPermissions: build.mutation<void, CreateMultiplePermissionsBody>({
      query: (body) => ({
        url: 'security/hierarchy/multiple',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    deleteHierarchiesPermissions: build.mutation<void, number[]>({
      query: (body) => ({
        url: 'security/hierarchy/multiple',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    deleteHierarchyPermissions: build.mutation<void, number>({
      query: (id) => ({
        url: `security/hierarchy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    updateHierarchyPermissions: build.mutation<void, UpdatePermissionsBody>({
      query: ({ body, id }) => ({
        url: `security/hierarchy/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyPermissions', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
  }),
});
