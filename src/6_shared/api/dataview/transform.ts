import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import {
  FilterTransformation,
  AggregateTransformation,
  JoinTransformation,
  SplitTransformation,
  VariableTransformation,
  NewTransformationResponse,
  NewSplitTransformationResponse,
} from './types';

export const transformApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    createFilterTransformation: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: FilterTransformation }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `transformations/${sourceId}/filter`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    createJoinTransformation: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: JoinTransformation }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `transformations/${sourceId}/join`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    createVariableTransformation: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: VariableTransformation }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `transformations/${sourceId}/variable`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    createSplitTransformation: build.mutation<
      NewSplitTransformationResponse,
      { sourceId: number; pipelineId: number; body: SplitTransformation }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `transformations/${sourceId}/split`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    createAggregateTransformation: build.mutation<
      NewTransformationResponse,
      { sourceId: number; pipelineId: number; body: AggregateTransformation }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `transformations/${sourceId}/aggregate`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
