import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import { GetFilteredModuleSettingsLogsRequest, ModuleSettingsLogsResponse } from './types';

export const moduleSettingsLogsApi = frontendSettingsApi.injectEndpoints({
  endpoints: (build) => ({
    getFilteredModuleSettingsLogs: build.mutation<
      ModuleSettingsLogsResponse,
      GetFilteredModuleSettingsLogsRequest
    >({
      query: (body) => ({
        url: `module_settings_logs/get_msl_by_filters`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ModuleSettingsLogs', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
