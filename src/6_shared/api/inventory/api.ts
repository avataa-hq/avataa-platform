import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';

const dynamicBaseQuery = generateDynamicBaseQuery('_apiBase8000');

export const inventoryNewApiOptions = { apiName: 'inventoryNewApi' };

export const inventoryNewApi = createApi({
  ...setDefaultApiSettings('inventoryNew', dynamicBaseQuery, [
    'Params',
    'Objects',
    'Items',
    'Security',
    'ObjectsV2',
    'LinkedObjects',
  ]),
  refetchOnMountOrArgChange: 1,
  endpoints: () => ({}),
});
