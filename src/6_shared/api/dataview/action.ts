import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import { GroupAction, LoadAction, MapActionBody, NewTransformationResponse } from './types';

export const dataviewActionApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    loadAction: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: LoadAction }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `actions/${sourceId}/load`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    groupAction: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: GroupAction }
    >({
      query: ({ sourceId, pipelineId, body }) => ({
        url: `actions/${sourceId}/group`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    mapAction: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: MapActionBody }
    >({
      query: ({ sourceId, pipelineId, body }) => ({
        url: `actions/${sourceId}/map`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
