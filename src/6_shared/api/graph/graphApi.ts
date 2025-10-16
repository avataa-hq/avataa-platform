import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_graphApiBase');

export const graphApiOptions = { apiName: 'graphApi' };

export const graphApi = createApi({
  ...setDefaultApiSettings('graphApi', dynamicBaseQuery, [
    'GraphGeneralData',
    'GraphTmo',
    'GraphAnalysData',
    'GraphTrace',
  ]),
  endpoints: () => ({}),
});
