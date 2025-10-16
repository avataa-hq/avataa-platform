import { zeebeApi, zeebeApiOptions } from '../zeebeApi';
import {
  GetSeverityByFiltersBody,
  GetSeverityByRangesBody,
  GetSeverityExportProcessBody,
  GetSeverityProcessBody,
  SeverityCount,
  SeverityProcessModel,
} from './types';
import { transformExport } from '../../utils/transformExport';

export const severityApi = zeebeApi.injectEndpoints({
  endpoints: (build) => ({
    convertTprmIdToColumnNames: build.query<Record<string, string>, string[] | number[]>({
      query: (body) => ({
        url: 'severity/tprm_id_to_column_name',
        method: 'POST',
        body,
      }),
      extraOptions: zeebeApiOptions,
    }),
    getSeverityByFilters: build.query<SeverityCount[], GetSeverityByFiltersBody[]>({
      query: (body) => ({
        url: 'severity/by_filters',
        method: 'POST',
        body,
      }),
      extraOptions: zeebeApiOptions,
    }),
    getSeverityByRanges: build.query<SeverityCount[], GetSeverityByRangesBody>({
      query: (body) => ({
        url: 'severity/by_ranges',
        method: 'POST',
        body,
      }),
      // providesTags: () => [{ type: 'Severity', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),
    getSeverityProcesses: build.query<SeverityProcessModel, GetSeverityProcessBody>({
      query: (body) => ({
        url: 'severity/processes',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Processes', id: 'LIST' }],
      keepUnusedDataFor: 5,
      extraOptions: zeebeApiOptions,
    }),
    getObjectsOfGroup: build.query<Record<string, number[]>, string[]>({
      query: (group_names) => ({
        url: `severity/objects_of_group`,
        method: 'POST',
        body: { group_names },
      }),
      extraOptions: zeebeApiOptions,
    }),
    exportSeverityProcesses: build.mutation<any, GetSeverityExportProcessBody>({
      query: (body) => ({
        url: `severity/export`,
        method: 'POST',
        body,
        cache: 'no-cache',
        responseHandler: (response) => transformExport(response, 'pm_report', body.file_type),
      }),
      extraOptions: zeebeApiOptions,
    }),
    closeAlarm: build.mutation<void, number[]>({
      query: (body) => ({
        url: `severity/close_alarm`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Processes', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),
  }),
});
