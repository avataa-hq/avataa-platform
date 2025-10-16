import { RJSFSchema } from '@rjsf/utils';

export interface DbConData {
  db_type: DbDriver;
  host: string;
  port: number;
  user: string;
  password: string;
  db_name: string;
  source_data_columns: string[];
  db_table: string;
  date_column?: string;
  offset?: number;
  only_datetime?: boolean;
}

export interface ApiConData {
  auth_type: keyof ApiAuthTypes;
  end_point: string;
  method: 'get' | 'post' | string;
  query_params: {};
  body_params: {};
  auth_data: any;
  source_data_columns: string[];
}

export type IFileConDataPattern = 'DDMMYYYY' | 'MMDDYYYY' | 'YYYYMMDD' | null;

export interface IFileConData {
  file_path: string;
  file_name?: string;
  date_pattern?: IFileConDataPattern;
  offset?: number;
}

export interface FileConData {
  import_type: 'SFTP' | string;
  host: string;
  port: number;
  login: string;
  password: string;
  source_data_columns: string[];
  file: IFileConData;
}

export interface FileManualConData {
  import_type: 'Manual' | string;
  file_name: string;
  source_data_columns: string[];
}

export interface Group {
  id: number;
  name: string;
  source_type: GroupSourceType;
}

export type ApiAuthTypes = Record<string, RJSFSchema>;

export const groupSourceTypes = ['Object data', 'Pm data', 'Geo data', 'Other data'] as const;

export type GroupSourceType = (typeof groupSourceTypes)[number] | string;

type ConData = DbConData | ApiConData | FileConData | FileManualConData;

export type ConType = 'RestAPI' | 'DB' | 'File' | string;

export type DbDriver = 'postgresql' | 'mysql' | 'oracle' | string;

export type FileImportType = string | 'SFTP' | 'Manual';

export type FileExtension = 'csv' | 'xlsx' | 'xls' | string;

export interface Source<T = ConData> {
  id: number;
  name: string;
  group_id: number;
  con_type: ConType;
  con_data: T;
}

export interface Message {
  msg: string;
}

// Remote Destinations
export interface SftpDestinationConData {
  host: string;
  port: string;
  login: string;
  password: string;
  path: string;
}

export interface CreateDestinationsRequest {
  con_type: string;
  con_data: SftpDestinationConData;
  name: string;
}
