export interface IFillSegment {
  from: number;
  to: number;
  color?: string;
  strokeWidth?: number;
}

export interface ITickMark {
  value?: number;
  color?: string;
  width?: number;
  length?: number;
  offset?: number;
  label?: string;
  description?: string;
}

export interface IArcProgressValue {
  value: number;
  min: number;
  max: number;

  valueUnit?: string;
  valueDecimals?: number;
  color?: string;
  label?: string;
  prevValue?: number;
  tickMarks?: ITickMark[];
  description?: string;
}
export interface IArcProgressIcon {
  type?: 'up' | 'down' | 'stable';
  color?: string;
  direction?: 'up' | 'down';
}
export interface IArcProgressData {
  value?: IArcProgressValue;
  additionalValue?: IArcProgressValue;

  icon?: IArcProgressIcon;

  numberOfDecimals?: number;
}

interface IArcTooltipContent {
  value: number;
  valueDecimals?: number;
  prev?: number;
  unit?: string;
  color?: string;
  label?: string;
  marks: ITickMark[];
  description?: string;
}
export interface IArcTooltip {
  mainValue: IArcTooltipContent;
  additionalValue?: IArcTooltipContent;
}
