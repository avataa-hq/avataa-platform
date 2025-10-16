import { createApi } from '@reduxjs/toolkit/query/react';
import { generateDynamicBaseQuery, setDefaultApiSettings } from '../config';
import {
  IGetEventsByFilterBody,
  IGetEventsByFilterModel,
  IGetParameterEventsByObjectIdBody,
  IGetParameterEventsByObjectIdModel,
} from './types';

const dynamicBaseQuery = generateDynamicBaseQuery('_eventManagerApiBase');

export const eventManagerApi = createApi({
  ...setDefaultApiSettings('eventManagerApi', dynamicBaseQuery),
  endpoints: (builder) => ({
    getEventsByFilter: builder.query<IGetEventsByFilterModel, IGetEventsByFilterBody>({
      query: (body) => ({
        url: 'events/get_events_by_filter',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Events', id: 'LIST' }],
    }),
    getParameterByObjectIds: builder.query<
      IGetParameterEventsByObjectIdModel,
      IGetParameterEventsByObjectIdBody
    >({
      query: (body) => ({
        url: `events/get_parameter_by_object_ids`,
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Events', id: 'LIST' }],
    }),
  }),
});
