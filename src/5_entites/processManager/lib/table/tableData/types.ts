import { GridColDef } from '@mui/x-data-grid-premium';
import { IColorRangeModel } from '6_shared';

export type GridColDefWithGroups = GridColDef & { group: string };

export type ColorDataByTprms = Record<string, Omit<IColorRangeModel, 'tprmId'>>;

export interface ICommonColumnModel {
  id: string;
  val_type: string;
  name: string;
  group: string | null;
  selectValueOptions?: string[];
}
