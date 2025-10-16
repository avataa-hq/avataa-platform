import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import { ExtractSource, Source } from './types';

export const dataviewExtractApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    extractSource: build.mutation<
      Source,
      { sourceId: number; pipelineId: number; body: ExtractSource }
    >({
      query: ({ sourceId, body, pipelineId }) => ({
        url: `extract/${sourceId}`,
        method: 'POST',
        params: { pipeline_id: pipelineId },
        body,
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
