import { PipelineSourceStatus } from '6_shared/api/dataview/types';

export type DataflowDiagramNodeType =
  | 'source'
  | 'filter'
  | 'group'
  | 'variable'
  | 'join'
  | 'dmn'
  | 'dead-end'
  | 'split'
  | 'branch'
  | 'consume'
  | 'load'
  | 'create'
  | 'publish'
  | 'trigger'
  | 'aggregate'
  | 'extract'
  | 'map';

export interface DataflowDiagramNode {
  id: number;
  x: number;
  y: number;
  transform_type: DataflowDiagramNodeType;
  name: string;
  status: PipelineSourceStatus | 'draft';
  rows_count?: string | number;
  connections: {
    from: number[];
    to: number[];
  };
}
