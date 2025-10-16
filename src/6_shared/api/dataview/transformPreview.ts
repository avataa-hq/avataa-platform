import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import {
  FilterTransformation,
  AggregateTransformation,
  JoinTransformation,
  SplitTransformation,
  VariableTransformation,
  TransformationPreview,
  SplitTransformationPreview,
  ExtractTransformationPreviewBody,
  ExtractTransformationsPreviewModel,
  MapTransformationPreviewModel,
  MapTransformationPreviewBody,
} from './types';

export const transformPreviewApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    getFilterTransformationPreview: build.mutation<
      TransformationPreview,
      { sourceId: number; body: FilterTransformation['filters'] }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/filter`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getJoinTransformationPreview: build.mutation<
      TransformationPreview,
      { sourceId: number; body: JoinTransformation['join'] }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/join`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getVariableTransformationPreview: build.mutation<
      TransformationPreview,
      { sourceId: number; body: VariableTransformation['variable'] }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/variable`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getSplitTransformationPreview: build.mutation<
      SplitTransformationPreview,
      { sourceId: number; body: SplitTransformation['branches'] }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/split`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getAggregateTransformationPreview: build.mutation<
      TransformationPreview,
      { sourceId: number; body: AggregateTransformation['group'] }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/aggregate`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getExtractTransformationPreview: build.mutation<
      ExtractTransformationsPreviewModel,
      { sourceId: number; body: ExtractTransformationPreviewBody }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/extract`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
    getMapTransformationPreview: build.mutation<
      MapTransformationPreviewModel,
      { sourceId: number; body: MapTransformationPreviewBody }
    >({
      query: ({ sourceId, body }) => ({
        url: `calculate/${sourceId}/map`,
        method: 'POST',
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
