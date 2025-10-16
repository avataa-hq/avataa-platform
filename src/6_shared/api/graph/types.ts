import { LineType, ObjectTypeGeometryType } from '../inventory';
import { IInventoryObjectModel } from '../../types';

export interface GraphData {
  name: string;
  tmo_id: number;
  status: GraphStatus;
  error_description: string | null;
  key: string;
}

export interface GraphResponse {
  name: string;
  tmo_id: number;
  status: GraphStatus;
  error_description: string | null;
  _key: string;
}

export interface EdgeExpandResponse {
  nodes: AnalysisNode[];
  edges: AnalysisEdge[];
  tmo: GraphNodeObjectType[];
  tprm: GraphEdgeTprm[];
}

export interface GraphTmo {
  start_node_key: string;
  nodes: GraphTmoNode[];
  edges: GraphTmoEdge[];
  group_by_tprms: number[];
  start_from_tmo_id: number;
  start_from_tprm_id: number;
  trace_tmo_id: number;
  delete_orphan_branches: boolean;
  trace_tprm_id?: number;
}

export interface GraphTmoNode {
  key: string;
  name: string;
  virtual: boolean;
  global_uniqueness: boolean;
  id: number;
  materialize: boolean;
  enabled: boolean;
  params: GraphTmoNodeParam[];
  is_grouped: boolean;
  icon: string | null;
  geometry_type: ObjectTypeGeometryType;
  line_type: LineType | null;
  commutation_tprms: number[] | null;
  busy_parameter_groups: number[][];
  show_as_a_table: boolean; // default false;
}

export interface GraphTmoNodeParam {
  name: string;
  val_type: string;
  id: number;
}

export interface GraphTmoEdge {
  key: string;
  source: string;
  target: string;
  link_type: string;
  enabled: boolean;
  tprm_id: number | null;
}

export interface GraphNodeObjectType {
  geometry_type: ObjectTypeGeometryType;
  icon: string | null;
  name: string;
  tmo_id: number;
  line_type: LineType | null;
}

interface GraphEdgeTprm {
  name: string;
  val_type: string;
  tmo_id: number;
  id: number;
}

export interface PatchGraphTmoBody {
  nodes?: {
    key: string;
    enabled: boolean;
  }[];
  edges?: {
    key: string;
    enabled: boolean;
  }[];
  group_by_tprms?: number[];
  start_from_tmo_id?: number;
  start_from_tprm_id?: number;
  trace_tmo_id?: number;
  trace_tprm_id?: number;
  delete_orphan_branches?: boolean;
}

export interface ExpandGraphBody {
  node_key: string;
  neighboring_node_keys: string[];
  return_commutation_label?: boolean; // default false
  expand_edges?: boolean; // default false
  maxSize?: number;
}

export interface AnalysisGraphData {
  nodes: AnalysisNode[];
  edges: AnalysisEdge[];
  commutation: AnalysisCommutation[] | null;
  tmo: GraphNodeObjectType[];
  size: number;
}

export interface AnalysisNode {
  key: string;
  grouped_by_tprm: number | null;
  name: string;
  tmo: number;
  mo_ids: number[];
  data: GraphObjectData | null;
  connected_with: string[][];
  label?: string | null;
}

type EdgeConnectionType = 'mo_link' | 'point_a' | 'point_b' | 'p_id' | 'geometry_line';

export interface AnalysisEdge {
  key: string;
  source: string;
  target: string;
  prm: number | null;
  tprm: number | null;
  connection_type: EdgeConnectionType;
  virtual: boolean;
}

export interface AnalysisCommutation {
  tmo_id: number;
  tmo_name: string;
  parent_name: string;
  nodes: AnalysisNode[];
}

export interface CollapseGraphData {
  collapse_from: AnalysisNode[];
  collapse_to: AnalysisNode;
  tmo: GraphNodeObjectType[];
}

type GraphStatus = 'New' | 'In Process' | 'Complete' | 'Error';

// Trace

export interface GraphObjectData extends IInventoryObjectModel {}

export interface NodeByMoIdModel {
  key: string;
  grouped_by_tprm: any;
  name: string;
  tmo: number;
  mo_ids: number[];
  data: GraphObjectData | null;
  breadcrumbs?: string | null;
  connected_with?: any | null;
}

export interface GetNodesByMoIdModel {
  key: string;
  name: string;
  nodes: AnalysisNode[];
}

export interface GetAllPathsForNodesRequestParams {
  database_key: string;
  body: {
    node_key: string;
  };
}

export type SquashLevel = 'Full' | 'Local' | 'None' | 'Graph' | 'Straight';

export interface GetPathRequestParams {
  database_key: string;
  body: {
    trace_node_key: string;
    squash_level: SquashLevel;
  };
}

interface GetPathEdges {
  key: string;
  source: string;
  target: string;
  prm: number | null;
  tprm: number | null;
  connection_type: EdgeConnectionType;
  virtual: boolean;
}

export interface GetPathModel {
  nodes: AnalysisNode[];
  edges: GetPathEdges[];
  tmo: GraphNodeObjectType[];
}

export interface GetNeighborsRequestBody {
  node_key: string;
  n: number;
}

export interface GetPathBetweenNodesModel {
  nodes: AnalysisNode[];
  edges: GetPathEdges[];
  tmo: GraphNodeObjectType[];
  length: number;
}

export interface GetPathBetweenNodesRequestParams {
  database_key: string;
  node_key_a: string;
  node_key_b: string;
  body: {
    squash_level: SquashLevel;
  };
}

export interface FindCommonPathModel extends Omit<GetPathBetweenNodesModel, 'length'> {}

export interface FindCommonPathRequestParams {
  database_key: string;
  body: {
    trace_node_a_key: string;
    trace_node_b_key: string;
    squash_level: SquashLevel;
  };
}
