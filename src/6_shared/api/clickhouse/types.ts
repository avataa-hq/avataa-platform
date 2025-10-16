import { ClickhouseSettings } from '6_shared/models';
import { AggregationType, GranularityType } from './constants';

export type TablesResponseType = { name: string }[];

export type EventsResponseType = {
  [key: string]: string | number;
}[];

export type StressDataModel = { date: string; stress: number };
export type StressPerDataModel = { key: string | number; stressData: StressDataModel[] };

export type ColumnsResponseType = {
  name: string;
  type: string;
  default_type: string;
  default_expression: string;
  comment: string;
  codec_expression: string;
  ttl_expression: string;
}[];

export type ClickhouseCreds = {
  _clickhouseUrl: string;
  _clickhouseName: string;
  _clickhousePass: string;
  _clickhouseCorsDisable: string;
};

export type GetEventValuesType = {
  table: string;
  objectColumn: string;
  objectKeys: string[];
  events: { eventName: string; aggregationType: AggregationType }[];
  dateColumn: string;
  granularity?: GranularityType;
  dateFrom?: string;
  dateTo?: string;
};

export type GetObjectsByParent = {
  table: string;
  objectColumn: string;
  parentColumn: string;
  parentKeys: string[];
  skip?: boolean;
};

export type GetEventMaxValuesType = Omit<
  GetEventValuesType,
  'dateColumn' | 'granularity' | 'dateFrom' | 'dateTo'
>;

export type ClickhouseLevelsSettings = {
  [key: string]: ClickhouseSettings;
} | null;

export type GetEventValuesForAll = Omit<GetEventValuesType, 'objectColumn' | 'objectKeys'> & {
  aggregationType: AggregationType;
};

export type EventDataType = {
  [key: string]: { weight: number; relaxationPeriod: number; alpha: number; beta: number };
};

export type ChildCountType = {
  parentKey: string;
  count: string;
};
