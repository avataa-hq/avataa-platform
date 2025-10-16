import { graphApi, graphApiOptions } from './graphApi';
import {
  AnalysisGraphData,
  CollapseGraphData,
  EdgeExpandResponse,
  ExpandGraphBody,
  GetNeighborsRequestBody,
} from './types';

export const analysisApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    getGraphTopLevel: build.query<AnalysisGraphData, { graphKey: string; maxSize?: number }>({
      query: ({ graphKey, maxSize = 0 }) => ({
        url: `analysis/top_level/${graphKey}`,
        providesTags: ['GraphAnalysData'],
        method: 'POST',
        body: { max_size: maxSize },
      }),
      extraOptions: graphApiOptions,
    }),
    expandGraph: build.mutation<AnalysisGraphData, { key: string; body: ExpandGraphBody }>({
      query: ({ key, body: { maxSize = 0, ...body } }) => ({
        url: `analysis/expand/${key}`,
        method: 'POST',
        body: { ...body, max_size: maxSize },
      }),
    }),
    collapseGraph: build.mutation<CollapseGraphData, { key: string; body: { node_key: string } }>({
      query: ({ key, body }) => ({
        url: `analysis/collapse/${key}`,
        method: 'POST',
        body,
      }),
    }),
    expandEdge: build.mutation<
      EdgeExpandResponse,
      { graphKey: string; body: { node_key_a: string; node_key_b: string } }
    >({
      query: ({ graphKey, body }) => ({
        url: `analysis/expand_edge/${graphKey}`,
        method: 'POST',
        body,
      }),
    }),
    getNeighbors: build.mutation<
      AnalysisGraphData,
      { graphKey: string; body: GetNeighborsRequestBody }
    >({
      query: ({ graphKey, body }) => ({
        url: `analysis/neighbors/${graphKey}`,
        method: 'POST',
        body,
      }),
    }),
    getEdgesBetweenNodes: build.mutation<
      EdgeExpandResponse,
      { graphKey: string; nodeKeys: string[] }
    >({
      query: ({ graphKey, nodeKeys }) => ({
        url: `analysis/edges_between_nodes/${graphKey}`,
        method: 'POST',
        body: nodeKeys,
      }),
    }),
  }),
});
