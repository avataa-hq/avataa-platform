import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import keycloak from '../../../keycloak';

const setDefaultApiSettings = (sliceName: string, baseUrl: string, tags?: string[]) => ({
  reducerPath: sliceName,
  tagTypes: tags,
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const { token } = keycloak;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 600,
  refetchOnMountOrArgChange: 600,
  // refetchOnReconnect: true,
});

export default setDefaultApiSettings;
