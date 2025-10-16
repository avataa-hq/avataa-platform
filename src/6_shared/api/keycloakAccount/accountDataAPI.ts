import { createApi } from '@reduxjs/toolkit/query/react';
import config from 'config';
import { Account } from '6_shared/models/accountData/types';
import setDefaultApiSettings from '../config/defaultSettingApiOld';

export const accountDataApi = createApi({
  ...setDefaultApiSettings(
    'accountDataAPI',
    `${config._keycloakUrl}realms/${config._keycloakRealm}`,
    ['User'],
  ),
  endpoints: (builder) => ({
    getAccountData: builder.query<Account, void>({
      query: () => ({
        url: `/account/`,
        headers: {
          Accept: 'application/json',
        },
      }),
      providesTags: () => [{ type: 'User', id: 'LIST' }],
    }),

    postAccountData: builder.mutation<void, Account>({
      query: (body) => ({
        url: `/account/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});
