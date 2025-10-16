import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import {
  IColorRangeCreateBody,
  IColorRangeFindByFilterBody,
  IColorRangeModel,
  IColorRangeUpdateBody,
  IGetDefaultColorRangesQueryParams,
} from './types';

export const colorRangesApi = frontendSettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    createColorRanges: builder.mutation<any, IColorRangeCreateBody>({
      query: ({ forced_default, ...body }) => ({
        url: `color_range/`,
        method: 'POST',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'Color', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateColorRanges: builder.mutation<any, IColorRangeUpdateBody>({
      query: ({ forced_default, id, ...body }) => ({
        url: `color_range/${id}`,
        method: 'PATCH',
        params: { forced_default },
        body,
      }),
      invalidatesTags: [{ type: 'Color', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteColorRanges: builder.mutation<any, number>({
      query: (id) => ({
        url: `color_range/${id}?forced_default=true`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Color', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    findRangesByFilter: builder.query<IColorRangeModel[], IColorRangeFindByFilterBody>({
      query: (body) => ({
        url: `color_range/filter`,
        method: 'POST',
        body,
      }),
      providesTags: () => [{ type: 'Color', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getDefaultColorRange: builder.query<IColorRangeModel[], IGetDefaultColorRangesQueryParams>({
      query: (params) => ({
        url: `color_range/defaults`,
        params,
      }),
      providesTags: () => [{ type: 'Color', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
