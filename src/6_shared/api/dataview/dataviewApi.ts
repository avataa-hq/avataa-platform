import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_dataviewApiBase');

export const dataviewApiOptions = { apiName: 'dataviewApi' };

export const dataviewApi = createApi({
  ...setDefaultApiSettings('dataviewApi', dynamicBaseQuery, ['Source', 'Pipeline']),
  endpoints: () => ({}),
});
