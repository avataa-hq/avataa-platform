import { createApi } from '@reduxjs/toolkit/dist/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_apiBase8004FrontendSettings');

export const frontendSettingsApiOptions = { apiName: 'frontendSettingsApi' };

export const frontendSettingsApi = createApi({
  ...setDefaultApiSettings('frontendSettings', dynamicBaseQuery, [
    'FrontendSettings',
    'Modules',
    'ProcessFilters',
    'Color',
    'tableColumns',
    'tableFilters',
    'VisibleColumns',
    'SelectedFilters',
    'ModuleSettings',
    'UserSettings',
    'ModuleSettingsLogs',
  ]),
  endpoints: (builder) => ({}),
});
