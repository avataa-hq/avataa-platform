import { graphApi, graphApiOptions } from './graphApi';
import { AnalysisNode, GetNodesByMoIdModel, GraphNodeObjectType } from './types';

export const graphSearchApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    getNodeHierarchy: build.query<AnalysisNode[], { graphKey: string; nodeKey: string }>({
      query: ({ graphKey, nodeKey }) => ({
        url: `search/hierarchy/${graphKey}`,
        providesTags: ['GraphNodeHierarchy'],
        params: { node_key: nodeKey },
      }),
      extraOptions: graphApiOptions,
    }),
    searchNode: build.query<
      { nodes: AnalysisNode[]; tmo: GraphNodeObjectType[] },
      { graphKey: string; query: string }
    >({
      query: ({ graphKey, query }) => ({
        url: `search/${graphKey}`,
        providesTags: ['GraphSearchResponse'],
        params: { query },
      }),
      extraOptions: graphApiOptions,
    }),
    getObjectDiagrams: build.query<GetNodesByMoIdModel[], number>({
      query: (objectId) => ({
        url: `search/nodes_by_mo_id/${objectId}`,
      }),
      extraOptions: graphApiOptions,
    }),
  }),
});
