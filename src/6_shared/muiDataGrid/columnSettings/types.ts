import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/query';

export interface ITableColumnSettingsState {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
}

export type LazyGetSettingsTriggerType = LazyQueryTrigger<
  QueryDefinition<
    number, // Request parameters type
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta>,
    never,
    any // Response type
  >
>;
