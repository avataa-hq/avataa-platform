import { createApi } from '@reduxjs/toolkit/query/react';
import { generateDynamicBaseQuery, setDefaultApiSettings } from '../config';

const dynamicBaseQuery = generateDynamicBaseQuery('_layersApiBase');

export const layersApiOptions = { apiName: 'layersApi' };

export const layersApiV1 = createApi({
  ...setDefaultApiSettings('layersApi', dynamicBaseQuery, ['Folders', 'Layers']),
  endpoints: () => ({}),
});
