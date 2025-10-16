import { frontendSettingsApiOptions, frontendSettingsApi } from '../../api';
import { ITableFilterSettingsBody, ITableFilterSettingsModel } from './types';

export const tableFilterSettingsApi = frontendSettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFilterSettingsForAllTmo: builder.query<ITableFilterSettingsModel[], void>({
      query: () => `table/filters/tmo/all`,
      providesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getDefaultFilterSettingsByTmo: builder.query<ITableFilterSettingsModel, number>({
      query: (tmoId) => ({
        url: `table/filters/default/tmo/${tmoId}`,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getAllFilterSettingsByTmo: builder.query<ITableFilterSettingsModel[], number>({
      query: (tmoId) => `table/filters/tmo/${tmoId}`,
      providesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    createNewFilterSettingForTmo: builder.mutation<number, ITableFilterSettingsBody>({
      query: ({ id: tmoId, body, forced_default }) => ({
        url: `table/filters/tmo/${tmoId}`,
        method: 'POST',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getFilterSettingsById: builder.query<ITableFilterSettingsModel, number>({
      query: (setting_id) => `table/filters/setting/${setting_id}`,
      providesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateFilterSettingById: builder.mutation<string, ITableFilterSettingsBody>({
      query: ({ id: setting_id, body, forced_default }) => ({
        url: `table/filters/setting/${setting_id}`,
        method: 'PUT',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteFilterSettingById: builder.mutation<string, Omit<ITableFilterSettingsBody, 'body'>>({
      query: ({ id: setting_id, forced_default }) => ({
        url: `table/filters/setting/${setting_id}`,
        method: 'DELETE',
        params: { forced_default },
      }),
      invalidatesTags: [{ type: 'tableFilters', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
