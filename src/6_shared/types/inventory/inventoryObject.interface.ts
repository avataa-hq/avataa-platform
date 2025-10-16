import { IInventoryGeometryModel } from './inventoryGeometry.interface';
import { IInventoryObjectParamsModel } from './inventoryParams.interface';

export interface IInventoryObjectModel extends Record<string, any> {
  parameters?: Record<string, string>;
  params?: IInventoryObjectParamsModel[];
  geometry: IInventoryGeometryModel | null;
  id: number;
  label?: string | null;
  p_id: number | null;
  latitude: number | null;
  longitude: number | null;
  active: boolean;
  model?: string | null;
  status: string | null;
  pov: any | null;
  version: number;
  name: string;
  tmo_id: number;
  parent_name: string | null;
  point_a_id: number | null;
  point_b_id: number | null;
  duration?: number;
  state?: string;
  processDefinitionKey?: string;
  processDefinitionId?: number;
  processInstanceId?: number;
  processDefinitionVersion?: number;
  creation_date?: Date | string;
  endDate?: Date | string;
  modification_date?: Date | string;
  startDate?: Date | string;
  point_a_name?: string | null;
  point_b_name?: string | null;
  document_count?: number;
  eventValues?: {
    value?: string | number | null;
    unit?: string;
  };
  description?: string | null;
}
