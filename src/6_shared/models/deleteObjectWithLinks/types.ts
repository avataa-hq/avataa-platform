import { type Edge, MarkerType, Node } from '@xyflow/react';

export interface DeleteObjectWithLinksData {
  addedConnectorNodesList: number[];
  addedObjectId: number | null;
  currentObjectId: number | null;
  currentTmoId: number | null;
}

export interface ConnectorObjParamTypeNode {
  id: string;
  position: { x: number; y: number };
  type: 'connectorObjectParamTypeNode';
  data: Record<string, any>;
}

// export interface StableEdge {
//   source: string;
//   target: string;
//   id: string;
//   reconnectable: false;
//   markerEnd: { type: MarkerType };
//   type?: string;
// }

export type InitialSourceObjectValues = Record<string, Record<string, number | number[]>>;

export interface AutocompleteValue {
  id: number | null;
  label: string;
}

export interface CustomEdgeProps {
  type: string;
  markerEnd: { type: MarkerType };
  animated: boolean;
  data: { edgeColor: string };
}

interface NodeLogicalData {
  initialValues: number | number[];
  objectId: number;
  multiple: boolean;
  tprmId: number;
}

interface NewValues {
  tprm_id: number;
  new_value: number | number[];
}

export interface EdgeLogicalData {
  initialValues?: number | number[];
  objectId: number;
  multiple: boolean;
  new_values: NewValues[];
}

type CustomEdgeData = { edgeColor: string; logical: EdgeLogicalData };
export type CustomEdgeType = Edge<CustomEdgeData, 'customEdge'>;

type ObjectParamTypeNodeType = {
  paramTypeName: 'string';
  connectionValidationId?: string;
  isConnectionBlocked?: boolean;
  logical: NodeLogicalData;
};

export type ParamNodeType = Node<ObjectParamTypeNodeType>;

type ObjectNodeData = {
  objectName: string;
  moId: number;
  connectionValidationId?: string;
  tmoId?: number;
};

export type ObjectNodeType = Node<ObjectNodeData>;

export interface TreeViewNode {
  id: string;
  label: string;
  children: TreeViewNode[];
  tmoId: number;
}
