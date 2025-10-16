import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import {
  GetAggregatedValues,
  KpiValueResponse,
  GranularityResponse,
  KpiValues,
  kpiResponse,
} from './types';

const dynamicBaseQuery = generateDynamicBaseQuery('_objectStateApiBase');

const objectStateApiOptions = { apiName: 'objectStateApi' };

export const objectStateApi = createApi({
  ...setDefaultApiSettings('objectState', dynamicBaseQuery),
  tagTypes: ['ObjectState'],
  endpoints: (builder) => ({
    // KPI
    getAllKpis: builder.query<kpiResponse[], void>({
      query: () => ({ url: `kpi` }),
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getKpiById: builder.query<kpiResponse, number>({
      query: (id) => `kpi/${id}`,
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getKpisByIds: builder.query<kpiResponse[], number[]>({
      query: (body) => ({
        url: `kpi/get_kpi_by_ids`,
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    createKpi: builder.mutation<void, any>({
      query: ({ id, body }) => ({
        url: `kpi/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    updateKpi: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `kpi/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    deleteKpi: builder.mutation<any, any>({
      query: (id) => ({
        url: `comment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getAllGranularities: builder.query<GranularityResponse[], void>({
      query: () => ({ url: `granularity/` }),
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getKpiGranularity: builder.query<GranularityResponse[], number>({
      query: (id) => `kpi/${id}/granularity`,
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getKpisForObjectType: builder.query<kpiResponse[], number>({
      query: (objectTypeId) => `kpi/for_special_object_type/${objectTypeId}`,
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),

    // KPI Values: Common
    getKpiValues: builder.query<KpiValueResponse[], { id: string; [key: string]: string }>({
      query: ({ id, ...params }) => ({ url: `kpi_values/common/${id}`, params }),
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
    getKpiValueById: builder.query<any, any>({
      query: (kpiValueId) => `kpi_values/common/kpi_value/${kpiValueId}`,
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),

    // KPI Values: Aggregation
    getAggregatedValues: builder.query<KpiValues, GetAggregatedValues>({
      query: (body) => ({
        url: `kpi_values/aggregation_data`,
        method: 'POST',
        body,
      }),
    }),

    // Object State
    getCurrentObjectState: builder.query<any, any>({
      query: (id) => `object_state/current/${id}`,
      providesTags: [{ type: 'ObjectState', id: 'LIST' }],
      extraOptions: objectStateApiOptions,
    }),
  }),
});
