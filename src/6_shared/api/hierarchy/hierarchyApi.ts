import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_apiBase8100');

export const hierarchyApiOptions = { apiName: 'hierarchyApi' };

export const hierarchyBaseApi = createApi({
  ...setDefaultApiSettings('hierarchyOfApi', dynamicBaseQuery, [
    'Hierarchy',
    'HierarchyLevel',
    'HierarchyCount',
    'HierarchyPermissions',
  ]),
  refetchOnMountOrArgChange: 1,
  endpoints: () => ({}),
});
