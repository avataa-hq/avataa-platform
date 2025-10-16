import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import { SecurityMiddlewareLowLevelModel, UserInfo } from './types';

const dynamicBaseQuery = generateDynamicBaseQuery('_securityMiddlewareApi');

export const securityMiddlewareApi = createApi({
  ...setDefaultApiSettings('securityMiddlewareApi', dynamicBaseQuery),
  refetchOnMountOrArgChange: 1,
  tagTypes: ['Security', 'UserInfo'],
  endpoints: (builder) => ({
    getLowLevelRoles: builder.query<SecurityMiddlewareLowLevelModel[], void>({
      query: () => '/roles/level/low',
      providesTags: [{ type: 'Security', id: 'LIST' }],
    }),
    getUserInfo: builder.query<UserInfo, { realm: string }>({
      query: ({ realm }) => `/cached/realms/${realm}/protocol/openid-connect/userinfo`,
      providesTags: [{ type: 'UserInfo', id: 'LIST' }],
    }),
  }),
});
