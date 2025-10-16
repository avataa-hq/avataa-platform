import { EndpointNames, IFilterSetPatchBody } from '6_shared';
import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import { IFilterSetBody, IFilterSetModel } from './types';

export const filterSetApi = frontendSettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFilterSets: builder.query<IFilterSetModel[], void>({
      query: () => `process/filterSet`,
      providesTags: ['FilterSetList'],
      extraOptions: frontendSettingsApiOptions,
    }),
    getFilterSetById: builder.query<IFilterSetBody, number>({
      query: (filter_id) => ({
        url: `process/filterSet/${filter_id}`,
      }),
      providesTags: ['FilterSet'],
      extraOptions: frontendSettingsApiOptions,
    }),
    createFilterSet: builder.mutation<IFilterSetModel, IFilterSetBody>({
      query: (body) => ({
        url: `process/filterSet`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FilterSetList'],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateFilterSetById: builder.mutation<void, IFilterSetBody & { filter_id: number }>({
      query: ({ filter_id, ...body }) => ({
        url: `process/filterSet/${filter_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FilterSet', 'FilterSetList'],
      extraOptions: frontendSettingsApiOptions,
    }),
    patchFilterSet: builder.mutation<void, IFilterSetPatchBody[]>({
      query: (body) => ({
        url: `process/filterSet`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['FilterSet', 'FilterSetList'],
    }),
    deleteFilterSetById: builder.mutation<void, number>({
      query: (filter_id) => ({
        url: `process/filterSet/${filter_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FilterSet', 'FilterSetList'],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
