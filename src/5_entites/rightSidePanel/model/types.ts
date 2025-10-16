import { IRoute } from '5_entites/inventory/trace/model';
import {
  DefaultComment,
  GetPathModel,
  IGetParameterEventsByObjectId,
  InventoryObjectWithGroupedParametersModel,
  InventoryObjectWithGroupedParametersParamsModel,
} from '6_shared';

export interface IObjectHistoryData {
  date: string;
  event: string;
  expanded?: boolean;
  params: IGetParameterEventsByObjectId[];
  [key: string]: any;
}

export interface IParams extends InventoryObjectWithGroupedParametersParamsModel {
  expanded: boolean;
  showExpandButton: boolean;
  constraint: string | null;
}

export interface INewObjectParams extends InventoryObjectWithGroupedParametersModel {
  expanded: boolean;
  params: IParams[];
}

export interface ICustomInputs {
  [key: string]: any;
}

export interface IGroupedDefaultComments {
  groupName: string;
  comments: DefaultComment[];
}

export interface IDefaultOptions {
  id: number;
  text: string;
  group: string;
}

export interface ICreateTooltipTextProps {
  paramValType: string;
  paramConstraint: string | null;
}

export type ExportGraphFormat = 'jpeg' | 'png';

export interface IFindPathData {
  trace_node_key: string;
  route: string;
  routeLength: number;
  routes: IRoute[];
  pathData: GetPathModel;
  [key: string]: any;
}

export interface ParentIDOption {
  id: number;
  name: string;
  optionName?: string;
}

export interface ISystemDataAttributesUpdateBody {
  id: number;
  version: number;
  p_id?: number | null;
  point_a_id?: number | null;
  point_b_id?: number | null;
  pov?: any;
  geometry?: any;
  model?: string;
  active?: boolean;
}
