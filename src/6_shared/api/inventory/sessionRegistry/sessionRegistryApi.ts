import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import { ISessionRegistryBody, ISessionRegistryResponse } from './types';

export const sessionRegistryApi = inventoryNewApi.injectEndpoints({
  endpoints: (build) => ({
    getSessionRegistry: build.query<ISessionRegistryResponse, ISessionRegistryBody>({
      query: (body) => ({
        url: `/session_registry/`,
        method: 'POST',
        body,
      }),
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});
