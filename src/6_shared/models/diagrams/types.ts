import { EdgeConfig, IEdge, INode, NodeConfig } from '@antv/g6';
import {
  AnalysisCommutation,
  AnalysisEdge,
  AnalysisGraphData,
  CollapseGraphData,
  EdgeExpandResponse,
  GraphNodeObjectType,
  GraphObjectData,
  GraphTmoNode,
  IColorRangeModel,
  LineType,
  ObjectTypeGeometryType,
} from '6_shared';
import { SVGAttributes } from 'react';
import { DEFAULT_EDGE_TYPE, LINE_NODE_EDGE_TYPE, TABLE_NODE_EDGE_TYPE } from './constants';

// GRAPH TYPES

interface ReasonDataMap {
  'node:expand': INode | IEdge;
  'node:collapse': INode;
  'node:getNeighbors': INode;
  'edge:expand': IEdge;
  default: null;
}

interface Graph3000ErrorData<Reason extends keyof ReasonDataMap> {
  reason: Reason;
  data: ReasonDataMap[Reason];
}

export interface Graph3000EventHandlers {
  error?: (error: any, data?: Graph3000ErrorData<keyof ReasonDataMap>) => void;
}

export interface Graph3000DataProviders {
  'node:expand'?: (
    node: INode | IEdge,
    maxNodes?: number,
  ) => Promise<AnalysisGraphData> | AnalysisGraphData;
  'node:collapse'?: (node: INode) => Promise<CollapseGraphData> | CollapseGraphData;
  'node:getNeighbors'?: (
    node: INode,
    neighbors?: number,
  ) => Promise<AnalysisGraphData> | AnalysisGraphData;
  'edge:expand'?: (edge: IEdge) => Promise<EdgeExpandResponse> | EdgeExpandResponse;
  'edge:getBetweenAllNode'?: (
    nodeKey: string[],
  ) => Promise<EdgeExpandResponse> | EdgeExpandResponse;
}

export interface Graph3000Config {
  graphTmosWithColorRanges?: GraphTmosWithColorRanges;
  link: {
    style: {
      [key in EdgeConnectionType | 'default']?: Omit<
        SVGAttributes<SVGPathElement>,
        'strokeDasharray' | 'strokeWidth'
      > & {
        strokeDasharray?: number[];
        strokeWidth?: number;
      };
    };
  };
}

export interface Graph3000DataNode {
  key: string;
  tmo: number;
  name: string;
  breadcrumbs?: string | null;
  label?: string | null;
  data?: GraphObjectData | null;
}

export interface Graph3000DataEdge {
  key: string;
  source: string;
  target: string;
  source_object?: number | null;
  connection_type: AnalysisEdge['connection_type'];
  virtual?: boolean;
  visible?: boolean;
}

export interface Graph3000Data<
  N extends Graph3000DataNode = Graph3000DataNode,
  E extends Graph3000DataEdge = Graph3000DataEdge,
> {
  nodes: N[];
  edges?: E[];
  tmo?: GraphNodeObjectType[] | null;
  commutation?: AnalysisCommutation[] | null;
}

export type GraphTmosWithColorRanges = Record<
  string,
  GraphTmoNode & { colorRanges?: IColorRangeModelWithRanges; visible?: boolean }
>;

export type ColorRange = {
  colors: {
    name: string;
    id: number;
    hex: string;
    visible?: boolean;
    lineWidth?: number;
  }[];
  values: number[];
};

export type IColorRangeModelWithRanges = IColorRangeModel & {
  ranges: ColorRange;
};

// export interface PositionState {
//   nodes: Record<string, { x: number; y: number }>;
// }

// NODE TYPES
export interface ICustomTableRow {
  key: string;
  label: string;
  connectedWith: string[][];
  objectId: number;
  selected?: boolean;
}

export interface CustomNodeConfigParams {
  name: string;
  val_type: string;
  id: number;
}

export interface CustomNodeConfig extends NodeConfig {
  key: string;
  name?: string;
  tmo?: number;
  virtualComboId?: string;
  muiIcon?: string | null;
  lineType?: LineType | null;
  isExpanded?: boolean;
  geometryType?: ObjectTypeGeometryType | null;
  color?: string;
  objectData?: GraphObjectData | null;
  startIndex?: number;
  activeRowKey?: string | null;
  isTransparent?: boolean;
  tableRows?: ICustomTableRow[];
  params?: CustomNodeConfigParams[];
  breadcrumbs?: string | null;
}

// EDGE TYPES

export type CustomEdgeConfig =
  | CollapsedEdgeConfig
  | DefaultEdgeConfig
  | TableEdgeConfig
  | LineNodeEdgeConfig
  | TableLineNodeEdgeConfig;

export interface CollapsedEdgeConfig extends EdgeConfig {
  key: string;
  connectionType: 'collapsed';
  isExpandable: true;
  type?: typeof DEFAULT_EDGE_TYPE;
  cachedType?: typeof DEFAULT_EDGE_TYPE;
  isVirtual?: boolean;
  source: string;
  target: string;
  source_object?: number | null;
  childEdges: DefaultEdgeConfig[];
}

export interface DefaultEdgeConfig extends EdgeConfig {
  key: string;
  connectionType: AnalysisEdge['connection_type'];
  isExpandable?: boolean;
  type: typeof DEFAULT_EDGE_TYPE;
  cachedType?: typeof DEFAULT_EDGE_TYPE;
  source: string;
  target: string;
  source_object?: number | null;
  isVirtual?: boolean;
  parentEdgeId?: string;
}

interface TableEdgeConfig extends EdgeConfig {
  key: string;
  connectionType: AnalysisEdge['connection_type'];
  isExpandable?: boolean;
  type: typeof TABLE_NODE_EDGE_TYPE;
  cachedType?: typeof TABLE_NODE_EDGE_TYPE;
  isVirtual?: boolean;
  sourceKey?: string;
  targetKey?: string;
  source: string;
  target: string;
  source_object?: number | null;
  childEdges?: Graph3000DataEdge[];
}

interface LineNodeEdgeConfig extends EdgeConfig {
  key: string;
  connectionType: 'line-node';
  type: typeof LINE_NODE_EDGE_TYPE;
  isExpandable?: false;
  cachedType?: typeof LINE_NODE_EDGE_TYPE;
  label: string | undefined;
  objectData: GraphObjectData | null | undefined;
  color?: string;
  lineDash?: string;
  source: string;
  target: string;
  comboId: string | undefined;
  source_object?: number | null;
  virtualComboId: string | undefined;
}

export interface TableLineNodeEdgeConfig extends EdgeConfig {
  key: string;
  connectionType: 'line-node';
  isExpandable?: boolean;
  type: typeof TABLE_NODE_EDGE_TYPE;
  cachedType?: typeof TABLE_NODE_EDGE_TYPE;
  label: string | undefined;
  objectData: GraphObjectData | null | undefined;
  color?: string;
  lineDash?: string;
  comboId: string | undefined;
  virtualComboId: string | undefined;
  isVirtual?: boolean;
  sourceKey?: string;
  targetKey?: string;
  source: string;
  target: string;
  source_object?: number | null;
  childEdges?: Graph3000DataEdge[];
}

// export interface IConnectivityInputData {
//   tableNode: INode;
//   graphKey: string;
// }

type EdgeConnectionType = AnalysisEdge['connection_type'] | 'line-node' | 'collapsed';
