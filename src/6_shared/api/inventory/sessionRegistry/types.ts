export interface ISessionRegistryModel {
  activation_datetime: string | null;
  id: number;
  status: 'ACTIVE' | 'INACTIVE';
  deactivation_datetime: string;
  user_id: string;
  session_id: string;
}

export interface ISessionRegistryResponse {
  response_data: ISessionRegistryModel[];
  total: number;
}

export interface ISessionRegistryBody {
  limit?: number;
  offset?: number;
  datetime_from?: string | Date; // by activation_datetime field
  datetime_to?: string | Date; // by activation_datetime field
}
