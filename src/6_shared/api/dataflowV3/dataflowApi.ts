import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_dataflowV3ApiBase');

export const dataflowApiOptions = { apiName: 'dataflowApi' };

export const dataflowApiV3 = createApi({
  ...setDefaultApiSettings('dataflowApiV3', dynamicBaseQuery, ['Group', 'Source', 'Destination']),
  endpoints: () => ({}),
});
