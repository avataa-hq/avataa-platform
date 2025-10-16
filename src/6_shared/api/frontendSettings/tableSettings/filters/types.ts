import { GridFilterModel } from '@mui/x-data-grid-premium';

export interface ITableFilterSettingsModel {
  id: number;
  tmo_id: number;
  name: string;
  value?: GridFilterModel | null;
  public: boolean;
  default: boolean;
  created_by: string;
}

export interface ITableFilterSettingsBody {
  body: Omit<ITableFilterSettingsModel, 'created_by' | 'id' | 'tmo_id'>;
  id: number;
  forced_default?: boolean;
}
