import { AggregationType, GranularityType } from '6_shared/api/clickhouse/constants';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { IInventoryObjectModel, ISpeedometerData } from '6_shared/types';

export interface MapColumnsSelectData {
  label: string;
  value: string;
  aggregation: string;
}

export type DBHLeftAreaType = 'root' | 'virtual' | 'real';

export interface DBHHierarchyModel {
  hierarchy_id: number;
  key: string;
  parent_id?: string;
}

export interface KpiSettings {
  [key: string]: LevelSettings[];
}

export interface LevelSettings {
  name: string;
  tmo_id: string;
  level_id: string;
  clickhouse_settings: ClickhouseSettings;
  external_level?: number;
  main_kpis: Kpis;
  additional_kpis: Kpis;
  bottom_kpis: Kpis;
  clickhouse_object_settings: any;
}

export interface ClickhouseSettings {
  table_name: string;
  datetime_column: string;
  object_key: string;
  events: Events;
  stress_formula: any;
  defaultKpi?: EventType;
  sizeKpi?: EventType;
  level_id?: number;
  calculate_stress?: boolean;
  granularity?: GranularityType;
}

export interface ClickhouseObjectSettings {
  table_name: string;
  object_key: string;
  parent_key: string;
}

export interface Events {
  [key: string]: EventType;
}

export interface EventType {
  name: string;
  weight: number;
  relaxation_period: string;
  relaxation_function: string;
  aggregation?: AggregationType;
  description?: string;
  group?: string;
  nestedKpi?: { columnName: string; data: EventType }[];
  unit?: string;
  decimals?: string;
  direction?: 'up' | 'down';
  granularity?: string;
  max?: string;
  min?: string;
  goal?: string;
}

export interface ILocalEvent {
  eventName: string;
  aggregationType: AggregationType;
}

export interface Kpis {
  [key: string]: KpiData;
}

export interface KpiData {
  ID: string;
  min: string;
  max: string;
  'Granularity ID': string;
  decimals: string;
  direction: 'up' | 'down';
  Direction: 'up' | 'down';
  goal?: string;
  additional?: KpiData;
  aggregation?: string;
  unit?: string;
}
export interface DBHClusteresDataModel {
  speedometersData: { [p: string]: { [p: number]: ISpeedometerData } };
  tableDataWeek: { [p: string]: { [p: number]: ISpeedometerData } };
  tableDataMonth: { [p: string]: { [p: number]: ISpeedometerData } };
  tableDataYear: { [p: string]: { [p: number]: ISpeedometerData } };
  clusterData?: InventoryAndHierarchyObjectTogether[];
}

export interface IHierarchyLevelLegendData {
  name: string;
  id: string | number;
  hierarchyId: number;
  children?: { color: string; description: string }[];
}

export type InventoryAndHierarchyObjectTogether = IInventoryObjectModel &
  HierarchyObject & { eventValues?: Record<string, any> };

export type SortValueType = { label: string; value: string; id: string; direction: 'up' | 'down' };

type Stat = {
  min: number;
  avg: number;
  max: number;
};

export type StatKey = keyof Stat;

type Delta = {
  diff: number;
  percent: number;
};

export interface CompareResult {
  previousLabel: string;
  currentLabel: string;
  previous: Stat;
  current: Stat;
  delta: {
    min: Delta;
    avg: Delta;
    max: Delta;
  };
}
export interface IMultipleObjectsCompareResult {
  label: string;
  states: Stat;
}
