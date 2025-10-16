// ----- Groups -----

export interface Group {
  id: number;
  name: string;
}

export interface Source {
  id: number;
  source_id: number;
  name: string;
  rows_count: number;
}

export interface PipelinesModel {
  pipelines: Pipeline[];
  total: number;
}

// ----- Pipelines -----

export interface CreatePipelineBody {
  name?: string;
  tags?: string[];
}

export interface Pipeline {
  id: number;
  dag_id: string | null;
  name: string;
  status: PipelineStatus;
  schedule: string | null;
  last_run: string | null;
  link: string;
  is_paused: boolean;
  external: boolean;
  tags: string[];
}

export interface PipelineStructure {
  id: number;
  name: string;
  status: PipelineStatus;
  schedule: string;
  link: string;
  is_paused: boolean;
  external: boolean;
  sources: PipelineSource[];
  relations: PipelineRelation[];
  tags: string[];
}

export interface PipelineRootSource {
  sourceId: number;
  location: SourceLocation;
}

type PipelineStatus =
  | 'draft'
  | 'active'
  | 'accepted'
  | 'new'
  | 'updated'
  | 'error'
  | 'off'
  | 'warning'
  | 'creation error'
  | 'running';

export type PipelineSourceStatus = 'accepted' | 'waiting' | 'deleted';

interface PipelineSource {
  id: number;
  name: string;
  transform_type: TransformType;
  rows_count: number;
  status: PipelineSourceStatus;
  x: number;
  y: number;
}

interface PipelineRelation {
  id: number;
  parent: number;
  child: number;
  root: boolean;
}

interface PipelineConfirmTriggerInfo {
  schedule_interval?: string;
}

interface PipelineConfirmPipelineInfo {
  name: string;
  tags: string[];
}

export interface PipelineConfirmBody {
  trigger_info: PipelineConfirmTriggerInfo;
  pipeline_info: PipelineConfirmPipelineInfo;
}

interface IGetAllPipelinesFilters {
  column: string;
  rule: string; // 'or'
  filters: [
    {
      operator: string; // 'eq'
      value: string;
    },
  ];
}

interface IGetAllPipelinesTagFilters {
  tags: string[];
  operator: string; // 'has_all'
}

type SortOrder = 'asc' | 'desc';

export interface GetAllPipelinesByFiltersBody {
  filters: IGetAllPipelinesFilters[] | [];
  tag_filters: IGetAllPipelinesTagFilters | null;
  sort: {
    columns: string[]; // ['name']
    order: SortOrder;
  };
  pagination: {
    limit: number;
    offset: number;
  };
}

// ----- Sources -----

export type ValType = 'int' | 'float' | 'str' | 'bool' | 'datetime';

export interface SourceConfig {
  id: number;
  name: string;
  val_type: ValType;
}

export interface SourceLocation {
  x: number;
  y: number;
}

// ----- Extract -----

export interface ExtractSource {
  name: string;
  location: SourceLocation;
  filters: Condition[];
  columns: string[];
}

// ----- Transformations Preview -----

export interface TransformationPreview {
  data: Record<string, any>[];
  rows_count: number;
}

export interface SplitTransformationPreview {
  branches: TransformationPreview[];
  rows_count: number;
}

export interface ExtractTransformationPreviewBody {
  // name: string;
  // location: SourceLocation;
  filters: Condition[];
  columns: string[];
}

export interface ExtractTransformationsPreviewModel {
  rows_count: number;
  data: Record<string, any>[];
}

export interface MapTransformationPreviewModel {
  rowsCount: number;
  data: Record<string, any>[];
}

export interface MapTransformationPreviewBody {
  tmo_id: number;
  inventory: {
    columns: string[];
    delimiter: string;
  };
  source: {
    columns: string[];
    delimiter: string;
  };
}

// ----- Transformations -----

// Filter
export interface FilterTransformation {
  name: string;
  location: SourceLocation;
  filters: Condition[];
}

interface Condition {
  column: string;
  rule: ConditionRule;
  filters: { operator: ConditionOperator; value: string | string[] }[];
}

type ConditionOperator = 'eq' | 'ne' | 'ge' | 'gt' | 'le' | 'lt';
type ConditionRule = 'or' | 'and';

// Join
export interface JoinTransformation {
  name: string;
  location: SourceLocation;
  join: Join;
}

interface Join {
  target: number;
  rule: JoinRule;
  rootColumns: string[];
  targetColumns: string[];
}

export const joinRules = ['inner', 'outer', 'left', 'right'];

export type JoinRule = (typeof joinRules)[number];

// Variable
export interface VariableTransformation {
  name: string;
  location: SourceLocation;
  variable: {
    name: string;
    formula: string;
  };
}

// Split
export interface SplitTransformation {
  name: string;
  location: SourceLocation;
  branches: Condition[][];
}

// Aggregate
export interface AggregateTransformation {
  name: string;
  location: SourceLocation;
  group: {
    aggregations: Record<string, string>;
    by: string[];
  };
}

// ----- Transformation Response -----

export interface NewTransformationResponse {
  id: number;
  name: string;
  transform_type: TransformType;
  rows_count: number;
  status?: PipelineSourceStatus;
  data: Record<string, any>[];
}

type TransformType = 'split' | 'variable' | 'source' | 'filter' | 'group' | 'branch' | 'extract';

export interface NewSplitTransformationResponse extends Omit<NewTransformationResponse, 'data'> {
  data: NewTransformationResponse[];
}

// ----- Actions -----

// Load
export interface LoadAction {
  name: string;
  location: SourceLocation;
  tmo_id: number;
  columns: Record<string, number>;
}

export interface MapActionBody extends MapTransformationPreviewBody {
  name: string;
  location: SourceLocation;
}

// Group
export interface GroupAction {
  name: string;
  location: SourceLocation;
}
