import { graphApi, graphApiOptions } from './graphApi';
import { GraphData, GraphResponse } from './types';

export const initialisationApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    getGraphs: build.query<GraphData[], void>({
      query: () => ({
        url: 'initialisation',
      }),
      providesTags: [{ type: 'GraphGeneralData', id: 'LIST' }],
      extraOptions: graphApiOptions,
    }),
    createGraph: build.mutation<GraphData, { name: string; tmo_id: number }>({
      query: (body) => ({
        url: 'initialisation',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'GraphGeneralData', id: 'LIST' }],
      extraOptions: graphApiOptions,
    }),
    updateGraphData: build.mutation<GraphResponse, { graphKey: string; body: { name?: string } }>({
      query: ({ graphKey, body }) => ({
        url: `initialisation/${graphKey}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'GraphGeneralData', id: 'LIST' }],
      extraOptions: graphApiOptions,
    }),
    deleteGraph: build.mutation<void, string>({
      query: (graphKey) => ({
        url: `initialisation/${graphKey}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, graphKey) => [
        { type: 'GraphGeneralData', id: 'LIST' },
        // { type: 'GraphGeneralData', id: graphKey },
        'GraphTmo',
      ],
      extraOptions: graphApiOptions,
    }),
  }),
});
