import {
  GetSeverityAllSubscriptionVariables,
  GetSeverityAllSubscription,
} from './useGetSeverityAll';

export type SeverityByFiltersBody = GetSeverityAllSubscriptionVariables['filters']['byFilters'];
export type SeverityByRangesBody = GetSeverityAllSubscriptionVariables['filters']['byRanges'];
export type SeverityProcessLiveDataBody =
  GetSeverityAllSubscriptionVariables['filters']['processes'];

export type SeverityByFiltersModel = GetSeverityAllSubscription['severity']['byFilters'];
export type SeverityByRangesModel = GetSeverityAllSubscription['severity']['byRanges'];
