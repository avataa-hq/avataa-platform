export interface IColoredLineData {
  value: string | number;
  color: string;
  date: string;
  label?: string;
  expectedValue?: number;
  prevPeriodDate?: string;
  comparisonZeroPoint?: number;
  valueDecimals?: number;
}
