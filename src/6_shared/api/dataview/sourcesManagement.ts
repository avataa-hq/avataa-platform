import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import { Pipeline, SourceConfig, SourceLocation, ValType } from './types';

export const sourcesManagementApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    getValTypes: build.query<ValType[], void>({
      query: () => ({
        url: 'sources/val_types',
      }),
      extraOptions: dataviewApiOptions,
    }),
    getSourceConfig: build.query<SourceConfig[], number>({
      query: (sourceId) => ({
        url: `sources/${sourceId}/config`,
      }),
      extraOptions: dataviewApiOptions,
    }),
    updateSourceConfig: build.mutation<void, SourceConfig[]>({
      query: (sourceId) => ({
        url: `sources/${sourceId}`,
        method: 'PATCH',
      }),
      extraOptions: dataviewApiOptions,
    }),
    deleteSource: build.mutation<void, { sourceId: number; pipelineId: number }>({
      query: ({ sourceId, pipelineId }) => ({
        url: `sources/${sourceId}`,
        method: 'DELETE',
        params: { pipeline_id: pipelineId },
      }),
      extraOptions: dataviewApiOptions,
    }),
    getSourceData: build.query<Record<string, any>[], number>({
      query: (sourceId) => ({
        url: `sources/${sourceId}/data`,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getSourceSettings: build.query<unknown, number>({
      query: (sourceId) => ({
        url: `sources/${sourceId}/transform_settings`,
      }),
      extraOptions: dataviewApiOptions,
    }),
    searchSourceInPipelines: build.query<Pipeline[], number>({
      query: (sourceId) => ({
        url: `sources/${sourceId}/search`,
      }),
      extraOptions: dataviewApiOptions,
    }),
    updateSourceLocation: build.mutation<
      SourceLocation,
      { sourceId: number; pipelineId: number; body: SourceLocation }
    >({
      query: ({ sourceId, pipelineId, body }) => ({
        url: `sources/${sourceId}/location`,
        method: 'PATCH',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    exportSourcePreview: build.query<Blob, { sourceId: number; fileType: 'xlsx' | 'csv' }>({
      query: ({ sourceId, fileType }) => ({
        url: `sources/${sourceId}/export`,
        method: 'GET',
        params: { file_type: fileType },
        responseHandler: (response) => response.blob(),
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
