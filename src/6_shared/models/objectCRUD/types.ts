import { InventoryParameterTypesModel } from '6_shared';

export interface IObjectComponentParams extends InventoryParameterTypesModel {
  prm_id?: number | null;
  value?: any;
}

export interface IParentIDOption {
  id: number;
  tmoId?: number;
  objectName: string;
  name: string;
}

export interface TransformDataToCreateParam {
  value: any;
  tprm_id: number;
  version?: number;
}

type Coordinates = [number, number];

export interface ILineGeometry {
  path: Coordinates[];
  pathLength: number;
}

export type ObjectCRUDModeType = 'creating' | 'editing';
