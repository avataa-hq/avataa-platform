export type Inputs = {
  cqq: number;
  cqq_overload_thr_days: number;
  cqq_quantile: number;
  ltc: number;
  ltc_overload_thr_days: number;
  ltc_quantile: number;
  util_chnn: number;
  uchnn_quantile: number;

  capex: number;
  kinvest: number;
  topology_depth: number;
  kvols: number;
  kltc: number;
  kcqq: number;
};

export type InputField = {
  name: keyof Inputs;
  label: string;
  placeholder: string;
  pattern: RegExp;
  errorMessage: string;
  haserror: boolean;
};
export interface CapacityRegionsModel {
  id: number;
  region_name: string;
}
export type GlobalSearchResult = {
  description: string;
  id: number;
  name: string;
  tmo_id: number;
  _id: string;
};
export type EndpointNames<T> = {
  [K in keyof T]: string;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
type AllApiEndpoints<T extends { endpoints: any }[]> = UnionToIntersection<
  EndpointNames<T[number]['endpoints']>
>;

export interface ClusterModel {
  initialGrowth: number;
  initialQuality: number;
  name: string;
  nodesQty: number;
  nodesQtyBadSignal: number;
  penetration: number;
  population: number;
  potentialProfit: number;
  quality: number;
  roiPercent: number;
  solutionCost: number;
  trafficGrowth: number;
  vip: number;
  trends: Record<ClusterTrendKey | string, ClusterTrend>;
}

type ClusterTrendKey = 'noAction' | 'own' | 'csp1' | 'csp2';

type ClusterTrend = Record<
  string,
  {
    value: number;
    color: string;
    trend: string;
  }
>;
interface GeoJson<T> {
  type: string;
  kpis?: { [key: string]: string };
  features: {
    type: string;
    properties: T;
    geometry: {
      type: string;
      coordinates: number[][][][] | number[][][] | number[][];
    };
  }[];
}

export interface LineChartDatasets {
  label: string;
  data: number[];
}

export interface LineChartData {
  labels: string[];
  decimals?: number;
  datasets: LineChartDatasets[];
}
export interface IInventoryBoundsModel {
  longitude_min: number;
  longitude_max: number;
  latitude_min: number;
  latitude_max: number;
}

export interface ISpeedometerData {
  value?: number | string;
  valueUnit?: string;
  initialValue?: number | string;
  initialValueUnit?: string;
  minValue?: number;
  maxValue?: number;
  name?: string;
  objId?: number;
  isCurrentLessInitial?: boolean;
  icon?: 'up' | 'down' | 'stable';
  iconColor?: string;
  directionValue?: 'up' | 'down';
  key?: number | string;
  withoutCorrection?: boolean;
  numberOfDecimals?: number;
  ticks?: any[];
  additionalValue?: any;
  unit?: string;
  description?: string;
}
export interface ITmoInfo {
  name: string;
  id: number | null;
}
