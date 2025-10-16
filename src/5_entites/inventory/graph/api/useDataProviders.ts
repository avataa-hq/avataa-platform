import { useCallback } from 'react';
import {
  graphApi,
  CustomEdgeConfig,
  MAX_NODES_TO_SHOW,
  Graph3000DataProviders,
  TABLE_NODE_EDGE_TYPE,
  CustomNodeConfig,
  TABLE_NODE_TYPE,
} from '6_shared';
import { INode } from '@antv/g6';
import { getNodeNeighboursKeys } from '../builder';

const {
  useExpandGraphMutation,
  useExpandEdgeMutation,
  useGetNeighborsMutation,
  useCollapseGraphMutation,
  useGetEdgesBetweenNodesMutation,
} = graphApi.analysis;

const getSelectedRowId = (node: INode) => {
  let rowId: string | undefined;
  const model = node.getModel() as CustomNodeConfig;
  if (model.type === TABLE_NODE_TYPE && model.tableRows) {
    rowId = model.tableRows.find((child) => child.selected)?.key;
  }
  return rowId as string | undefined;
};

export const useDataProviders = (graphKey: string): Graph3000DataProviders => {
  const [expandNodeMutation] = useExpandGraphMutation();
  const [expandEdgeMutation] = useExpandEdgeMutation();
  const [collapseNodeMutation] = useCollapseGraphMutation();
  const [getNeighborsMutation] = useGetNeighborsMutation();
  const [getEdgesBetweenNodesMutation] = useGetEdgesBetweenNodesMutation();

  const expandNode = useCallback<NonNullable<Graph3000DataProviders['node:expand']>>(
    async (item, maxNodes = MAX_NODES_TO_SHOW) => {
      let nodeNeighboursKeys: string[] = [];
      let rowId: string | undefined;

      if ('getEdges' in item) {
        nodeNeighboursKeys = getNodeNeighboursKeys(item);
        rowId = getSelectedRowId(item as INode);
      } else if ('getSource' in item && 'getTarget' in item) {
        const sourceKey = item.getSource()?.getModel()?.id;
        const targetKey = item.getTarget()?.getModel()?.id;

        if (sourceKey && targetKey) nodeNeighboursKeys = [sourceKey, targetKey];
      }

      return expandNodeMutation({
        key: graphKey,
        body: {
          node_key: rowId ?? item.getID(),
          neighboring_node_keys: nodeNeighboursKeys,
          maxSize: maxNodes,
          expand_edges: true,
        },
      }).unwrap();
    },
    [graphKey, expandNodeMutation],
  );

  const expandEdge = useCallback<NonNullable<Graph3000DataProviders['edge:expand']>>(
    async (edge) => {
      const edgeModel = edge.getModel() as CustomEdgeConfig;
      const sourceKey =
        edgeModel.type === TABLE_NODE_EDGE_TYPE
          ? edgeModel.sourceKey ?? edgeModel.source
          : edgeModel.source;
      const targetKey =
        edgeModel.type === TABLE_NODE_EDGE_TYPE
          ? edgeModel.targetKey ?? edgeModel.target
          : edgeModel.target;

      return expandEdgeMutation({
        graphKey,
        body: { node_key_a: sourceKey, node_key_b: targetKey },
      }).unwrap();
    },
    [graphKey, expandEdgeMutation],
  );

  const collapseNode = useCallback<NonNullable<Graph3000DataProviders['node:collapse']>>(
    async (node) => {
      const rowId = getSelectedRowId(node);

      return collapseNodeMutation({
        key: graphKey,
        body: { node_key: rowId ?? node.getID() },
      }).unwrap();
    },
    [collapseNodeMutation, graphKey],
  );

  const getNeighbors = useCallback<NonNullable<Graph3000DataProviders['node:getNeighbors']>>(
    async (node, neighbors = 1) => {
      const rowId = getSelectedRowId(node);

      return getNeighborsMutation({
        graphKey,
        body: {
          node_key: rowId ?? node.getID(),
          n: neighbors,
        },
      }).unwrap();
    },
    [getNeighborsMutation, graphKey],
  );

  const getEdgesBetweenNodes = useCallback(
    async (nodeKeys: string[]) => {
      return getEdgesBetweenNodesMutation({ graphKey, nodeKeys }).unwrap();
    },
    [getEdgesBetweenNodesMutation, graphKey],
  );

  return {
    'edge:expand': expandEdge,
    'edge:getBetweenAllNode': getEdgesBetweenNodes,
    'node:getNeighbors': getNeighbors,
    'node:collapse': collapseNode,
    'node:expand': expandNode,
  };
};
