import {
  CustomEdgeConfig,
  CustomNodeConfig,
  GraphObjectData,
  GraphTmosWithColorRanges,
  LineType,
} from '6_shared';

export interface IConnectivityDiagramData {
  tableNode: CustomNodeConfig;
  cableNodes: (CustomNodeConfig & { tmoPaletteData?: GraphTmosWithColorRanges[string] | null })[];
  fibers: (CustomEdgeConfig & { tmoPaletteData?: GraphTmosWithColorRanges[string] | null })[];
}

export type CablesSides = 'left' | 'right' | 'top' | 'bottom';

export interface IPort {
  id: string;
  group: string;
  order?: number;
  [key: string]: any;
}

interface IVertices {
  x: number;
  y: number;
}

export interface IEdgeData {
  color?: string;
  label?: string;
  objectData?: GraphObjectData | null;
  strokeWidth?: number | null;
  lineStyle?: LineType | null;
  visible?: boolean;

  sourceLabel?: string;
  targetLabel?: string;
  sourceColor?: string;
  targetColor?: string;

  sourceObjectData?: GraphObjectData | null;
  targetObjectData?: GraphObjectData | null;

  sourceStrokeWidth?: number | null;
  targetStrokeWidth?: number | null;

  sourceLineStyle?: LineType | null;
  targetLineStyle?: LineType | null;
}

export interface INodeData {
  label?: string;
  portSide?: string;
  slotId?: string;
  color?: string;
}

interface ISourceTarget {
  cell?: string;
  port?: string;
  side?: CablesSides;
  vertices?: IVertices[];
  label?: string;
  objectData?: GraphObjectData | null;
}

export interface ICustomDiagramEdge {
  id: string;
  source?: ISourceTarget;
  target?: ISourceTarget;
  data?: IEdgeData;
}

export interface ICustomDiagramNode {
  id: string;
  data: INodeData;
  side?: CablesSides;
  ports?: any;
  width?: number;
  height?: number;
}

export interface IConnectivityResult {
  [key: string]: {
    [key: string]: number;
    total: number;
  };
}

export interface IBalanceNodesConnections {
  [key: string]: ICustomDiagramNode[];
}
