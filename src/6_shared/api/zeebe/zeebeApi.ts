import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_camundaZeebeClient');

export const zeebeApiOptions = { apiName: 'zeebeApi' };

export const zeebeApi = createApi({
  ...setDefaultApiSettings('zeebe', dynamicBaseQuery, ['Processes']),
  endpoints: () => ({}),
});
