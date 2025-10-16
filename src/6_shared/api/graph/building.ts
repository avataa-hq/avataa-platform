import { graphApi, graphApiOptions } from './graphApi';

export const buildingApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    buildGraph: build.mutation<void, string>({
      query: (graphKey) => ({
        url: `building/`,
        method: 'POST',
        params: { key: graphKey },
      }),
      invalidatesTags: (result, error, graphKey) => [
        { type: 'GraphGeneralData', id: graphKey },
        { type: 'GraphTmo', id: graphKey },
      ],
      extraOptions: graphApiOptions,
    }),
  }),
});
