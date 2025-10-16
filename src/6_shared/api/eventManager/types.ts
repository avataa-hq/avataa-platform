export interface IGetEventsByFilterFilterColumn {
  field: string;
  value: string;
  condition: string;
}

export interface IGetEventsByFilterBody {
  filter_column?: IGetEventsByFilterFilterColumn[];
  sort_by?: {
    field: string;
    descending: 'ASC' | 'DESC';
  };
  date_to?: string | Date;
  date_from?: string | Date;
  limit?: number;
  offset?: number;
}

export interface IGetEventsByFilter {
  event_type: 'CREATED' | 'UPDATED' | 'DELETED';
  instance: string;
  old_value: string | null;
  new_value: string | null;
  instance_id: number;
  attribute: string;
  version: number;
  valid_from: string | Date;
  valid_to: string | Date | null;
  is_active: boolean;
}

export interface IGetEventsByFilterModel {
  data: IGetEventsByFilter[];
  total: number;
}

export interface IGetParameterEventsByObjectIdBody {
  object_ids: number[];
  date_from?: string | Date;
  date_to?: string | Date;
  limit?: number;
  offset?: number;
  sort_by_datetime?: 'ASC' | 'DESC';
}

export interface IGetParameterEventsByObjectId
  extends Omit<IGetEventsByFilter, 'instance' | 'version' | 'is_active'> {
  user_id: string;
  parameter_type_id: number;
}

export interface IGetParameterEventsByObjectIdModel {
  [key: string]: {
    data: IGetParameterEventsByObjectId[];
    total: number;
  };
  // data: {
  //   [key: string]: IGetParameterEventsByObjectId[];
  // };
  // total: number;
}
