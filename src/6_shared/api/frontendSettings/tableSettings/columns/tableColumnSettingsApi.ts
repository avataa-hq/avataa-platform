import { frontendSettingsApiOptions, frontendSettingsApi } from '../../api';
import { ITableColumnSettingsModel, ITableColumnsSettingsBody } from './types';

export const tableColumnSettingsApi = frontendSettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSettingsForAllTmo: builder.query<ITableColumnSettingsModel[], void>({
      query: () => `table/columns/tmo/all`,
      providesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getDefaultSettingsByTmo: builder.query<ITableColumnSettingsModel, number>({
      query: (tmoId) => ({
        url: `table/columns/default/tmo/${tmoId}`,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getAllSettingsByTmo: builder.query<ITableColumnSettingsModel[], number>({
      query: (tmoId) => `table/columns/tmo/${tmoId}`,
      providesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    createNewSettingToTmo: builder.mutation<number, ITableColumnsSettingsBody>({
      query: ({ id: tmoId, body, forced_default }) => ({
        url: `table/columns/tmo/${tmoId}`,
        method: 'POST',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),

    // =========

    getSettingsBySettingId: builder.query<ITableColumnSettingsModel, number>({
      query: (setting_id) => `table/columns/setting/${setting_id}`,
      providesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateSettingById: builder.mutation<string, ITableColumnsSettingsBody>({
      query: ({ id: setting_id, body, forced_default }) => ({
        url: `table/columns/setting/${setting_id}`,
        method: 'PUT',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteSettingById: builder.mutation<string, Omit<ITableColumnsSettingsBody, 'body'>>({
      query: ({ id: setting_id, forced_default }) => ({
        url: `table/columns/setting/${setting_id}`,
        method: 'DELETE',
        params: { forced_default },
      }),
      invalidatesTags: [{ type: 'tableColumns', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
