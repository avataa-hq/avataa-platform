import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import {
  Pipeline,
  PipelineRootSource,
  PipelineStructure,
  PipelineConfirmBody,
  PipelinesModel,
  CreatePipelineBody,
  GetAllPipelinesByFiltersBody,
} from './types';

export const pipelinesManagementApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    createPipeline: build.mutation<Pipeline, CreatePipelineBody | void>({
      query: (body) => ({
        url: 'pipelines/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    getPipelineStructure: build.query<PipelineStructure, number>({
      query: (pipelineId) => ({
        url: `pipelines/${pipelineId}`,
      }),
      extraOptions: dataviewApiOptions,
    }),
    deletePipeline: build.mutation<void, { pipelineId: string; drop_metadata: boolean }>({
      query: ({ pipelineId, drop_metadata }) => ({
        url: `pipelines/${pipelineId}`,
        method: 'DELETE',
        params: { drop_metadata },
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    updatePipelineName: build.mutation<Pipeline, { pipelineId: number; name: string }>({
      query: ({ pipelineId, name }) => ({
        url: `pipelines/${pipelineId}`,
        method: 'PATCH',
        params: { name },
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    confirmPipelineChanges: build.mutation<void, { pipelineId: number; body: PipelineConfirmBody }>(
      {
        query: ({ pipelineId, body }) => ({
          url: `pipelines/${pipelineId}/confirm`,
          method: 'POST',
          body,
        }),
        invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
        extraOptions: dataviewApiOptions,
      },
    ),
    cancelPipelineChanges: build.mutation<unknown, number>({
      query: (pipelineId) => ({
        url: `pipelines/${pipelineId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    addRootSourceToPipeline: build.mutation<void, { pipelineId: number; body: PipelineRootSource }>(
      {
        query: ({ pipelineId, body }) => ({
          url: `pipelines/${pipelineId}/add_root`,
          method: 'POST',
          body,
        }),
        extraOptions: dataviewApiOptions,
      },
    ),
    triggerPipeline: build.mutation<void, string>({
      query: (pipelineId) => ({
        url: `pipelines/${pipelineId}/trigger`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    setPipelineActivity: build.mutation<void, { pipelineId: string; is_paused: boolean }>({
      query: ({ pipelineId, is_paused }) => ({
        url: `pipelines/${pipelineId}/activity`,
        method: 'PATCH',
        params: { is_paused },
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    createPipelineCopy: build.mutation<PipelineStructure, number>({
      query: (pipelineId) => ({
        url: `pipelines/${pipelineId}/copy`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
    getAllPipelinesByFilters: build.query<PipelinesModel, GetAllPipelinesByFiltersBody>({
      query: (body) => ({
        url: 'pipelines/search',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Pipeline', id: 'LIST' }],
      extraOptions: dataviewApiOptions,
    }),
  }),
});
