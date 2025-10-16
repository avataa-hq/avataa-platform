import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';

export interface ITableColumnSettingsModel {
  id: number;
  tmo_id: number;
  name: string;
  value?: ITableColumnSettingsValueModel | null;
  public: boolean;
  default: boolean;
  created_by: string;
  order?: string[] | null;
  pinned?: Record<string, any> | null;
}
export interface ITableColumnSettingsValueModel {
  tableInitialState?: GridInitialStatePremium;
  rightPanelWidth?: number;
}
export interface ITableColumnsSettingsBody {
  body: Omit<ITableColumnSettingsModel, 'created_by' | 'id' | 'tmo_id'>;
  id: number;
  forced_default?: boolean; // default false
}
