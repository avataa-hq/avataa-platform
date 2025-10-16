import { dataflowApiOptions, dataflowApiV3 } from './dataflowApi';
import { Source, ApiAuthTypes, ApiConData, Message } from './types';

export const apiSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getApiAuthTypes: build.query<ApiAuthTypes, void>({
      query: () => ({
        url: 'api_sources/auth_types',
      }),
    }),
    createApiSource: build.mutation<Source<ApiConData>, Omit<Source<ApiConData>, 'id'>>({
      query: (body) => ({
        url: 'api_sources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Source'],
      extraOptions: dataflowApiOptions,
    }),
    updateApiSource: build.mutation<
      void,
      { sourceId: number; body: Omit<Source<ApiConData>, 'id'> }
    >({
      query: ({ sourceId, body }) => ({
        url: `api_sources/${sourceId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { sourceId }) => [{ type: 'Source', id: sourceId }],
      extraOptions: dataflowApiOptions,
    }),
    getApiSourceColumns: build.query<unknown, number>({
      query: (sourceId) => ({
        url: `api_sources/${sourceId}/object_attrs_names`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    // Helpers
    checkApiSourceConnectionWithoutId: build.mutation<Message, ApiConData>({
      query: (body) => ({
        url: 'api_sources/helpers/check_connection',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getApiSourceColumnsWithoutId: build.mutation<string[], ApiConData>({
      query: (body) => ({
        url: 'api_sources/helpers/get_source_columns',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
