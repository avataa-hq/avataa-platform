type ColorRangeDirection = 'asc' | 'desc';

export interface IColorRange {
  [key: string]: any;
}

interface IColorModel {
  name: string;
  id: number | string;
  hex: string;
  warningSignal?: boolean;
}
export interface IRangeModel {
  colors: IColorModel[];
  values: number[];
  comparisonZeroPoint?: { active: boolean; index: number; value: number | string };
}

export interface IColorRangeModel {
  id: number;
  tmoId: string;
  tprmId: string;
  created_by: string;
  created_by_sub: string;
  name: string;
  value_type: string;
  ranges: IColorRange;
  direction?: ColorRangeDirection; // default = asc
  public?: boolean;
  default?: boolean;
  withIndeterminate?: boolean;
  withCleared?: boolean;
  valType: string;
  correctValType?: string;
}

export interface IColorRangeCreateBody
  extends Omit<IColorRangeModel, 'created_by' | 'created_by_sub' | 'id'> {
  forced_default?: boolean; // default false
}
export interface IColorRangeUpdateBody
  extends Omit<IColorRangeModel, 'tprmId' | 'tmoId' | 'created_by' | 'created_by_sub'> {
  forced_default?: boolean; // default false
}

export interface IColorRangeFindByFilterBody {
  ids?: number[];
  tmo_ids?: string[];
  tprm_ids?: string[];
  is_default?: boolean;
  limit?: number;
  offset?: number;
  only_description?: boolean;
  val_types?: string[];
}

export interface IGetDefaultColorRangesQueryParams {
  tmo_id?: number | string;
  tprm_id?: number | string;
}
