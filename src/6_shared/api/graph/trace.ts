import { graphApi, graphApiOptions } from './graphApi';
import {
  FindCommonPathModel,
  FindCommonPathRequestParams,
  GetAllPathsForNodesRequestParams,
  GetNodesByMoIdModel,
  GetPathBetweenNodesModel,
  GetPathBetweenNodesRequestParams,
  GetPathModel,
  GetPathRequestParams,
  NodeByMoIdModel,
} from './types';

export const traceApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    getNodesByMoId: build.query<GetNodesByMoIdModel[], number>({
      query: (mo_id) => ({
        url: `trace/nodes_by_mo_id/${mo_id}`,
        method: 'POST',
      }),
      providesTags: ['GraphTrace'],
      extraOptions: graphApiOptions,
    }),
    getAllPathsForNodes: build.query<NodeByMoIdModel[], GetAllPathsForNodesRequestParams>({
      query: ({ database_key, body }) => ({
        url: `trace/path/all/${database_key}`,
        method: 'POST',
        body,
        cache: 'no-cache',
      }),
      providesTags: ['GraphTrace'],
      extraOptions: graphApiOptions,
      keepUnusedDataFor: 0,
    }),
    getPath: build.query<GetPathModel, GetPathRequestParams>({
      query: ({ database_key, body }) => ({
        url: `trace/path/${database_key}`,
        method: 'POST',
        body,
        cache: 'no-cache',
      }),
      providesTags: ['GraphTrace'],
      extraOptions: graphApiOptions,
      keepUnusedDataFor: 0,
    }),
    getPathBetweenNodes: build.query<GetPathBetweenNodesModel[], GetPathBetweenNodesRequestParams>({
      query: ({ database_key, node_key_a, node_key_b, body }) => ({
        url: `trace/path_between_nodes/${database_key}?node_key_a=${node_key_a}&node_key_b=${node_key_b}`,
        method: 'POST',
        body,
      }),
    }),
    findCommonPath: build.query<FindCommonPathModel, FindCommonPathRequestParams>({
      query: ({ database_key, body }) => ({
        url: `trace/find_common_path/${database_key}`,
        body,
        method: 'POST',
      }),
      providesTags: ['GraphTrace'],
    }),
  }),
});
