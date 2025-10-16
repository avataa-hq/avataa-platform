import { graphApi, graphApiOptions } from './graphApi';
import { GraphTmo, GraphTmoNode, PatchGraphTmoBody } from './types';

export const tmoApi = graphApi.injectEndpoints({
  endpoints: (build) => ({
    getTmoGraph: build.query<GraphTmo, string>({
      query: (graphKey) => ({
        url: `tmo/${graphKey}`,
      }),
      providesTags: (result, error, graphKey) => [{ type: 'GraphTmo', id: graphKey }],
      extraOptions: graphApiOptions,
    }),
    updateTmoGraph: build.mutation<GraphTmo, { graphKey: string; body: PatchGraphTmoBody }>({
      query: ({ graphKey, body }) => ({
        url: `tmo/${graphKey}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { graphKey }) => [{ type: 'GraphTmo', id: graphKey }],
      extraOptions: graphApiOptions,
    }),
    setCommutationTprms: build.mutation<
      GraphTmoNode,
      { graphKey: string; nodeKey: string; commutationTprms: number[] }
    >({
      query: ({ graphKey, nodeKey, commutationTprms }) => ({
        url: `tmo/${graphKey}/tprms`,
        method: 'PATCH',
        body: { node_key: nodeKey, tprm_ids: commutationTprms },
      }),
      invalidatesTags: (result, error, { graphKey }) => [{ type: 'GraphTmo', id: graphKey }],
      extraOptions: graphApiOptions,
    }),
    setCommutationBusyParameters: build.mutation<
      GraphTmoNode,
      { graphKey: string; nodeKey: string; busy_parameters: number[][] }
    >({
      query: ({ graphKey, nodeKey, busy_parameters }) => ({
        url: `tmo/${graphKey}/busy_parameters`,
        method: 'PATCH',
        body: { node_key: nodeKey, busy_parameters },
      }),
      invalidatesTags: (result, error, { graphKey }) => [{ type: 'GraphTmo', id: graphKey }],
      extraOptions: graphApiOptions,
    }),
    setNodeShowAsTable: build.mutation<
      GraphTmoNode,
      { graphKey: string; nodeKey: string; showAsTable: boolean }
    >({
      query: ({ graphKey, nodeKey, showAsTable }) => ({
        url: `tmo/${graphKey}/show_as_a_table`,
        method: 'PATCH',
        body: { node_key: nodeKey, show_as_a_table: showAsTable },
      }),
      invalidatesTags: (result, error, { graphKey }) => [{ type: 'GraphTmo', id: graphKey }],
      extraOptions: graphApiOptions,
    }),
  }),
});
