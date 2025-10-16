import { EdgeConfig, NodeConfig } from '@antv/g6';

import { GraphTmoEdge, GraphTmoNode } from '6_shared';

export type ConfigGraphNodeConfig = Omit<GraphTmoNode, 'icon' | 'id'> & NodeConfig;

export type ConfigGraphEdgeConfig = GraphTmoEdge & EdgeConfig;

export interface GraphConfigData {
  nodes: ConfigGraphNodeConfig[];
  edges: ConfigGraphEdgeConfig[];
}
