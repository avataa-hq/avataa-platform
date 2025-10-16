import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { Source, FileManualConData } from './types';

export const fileManualSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    createFileManualSource: build.mutation<Source<FileManualConData>, FormData>({
      query: (body) => ({
        url: 'file_sources/manual',
        formData: true,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Source'],
      extraOptions: dataflowApiOptions,
    }),
    updateFileManualSource: build.mutation<void, { sourceId: number; body: FormData }>({
      query: ({ sourceId, body }) => ({
        url: `file_sources/manual/${sourceId}`,
        formData: true,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { sourceId }) => [{ type: 'Source', id: sourceId }],
      extraOptions: dataflowApiOptions,
    }),
    getFileManualSourceColumns: build.query<string[], number>({
      query: (sourceId) => ({
        url: `file_sources/manual/${sourceId}/file_columns`,
      }),
      extraOptions: dataflowApiOptions,
    }),

    // Helpers
    getFileManualSourceColumnsWithoutId: build.mutation<string[], FormData>({
      query: (body) => ({
        url: 'file_sources/manual/helpers/get_columns',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
