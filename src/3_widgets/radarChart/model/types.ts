export type RadarChartKPIType = {
  [kpiName: string]: {
    value: number;
    min: number;
    max: number;
    color: string;
    percent: number;
    realVal?: number;
    realMax?: number;
  };
};
