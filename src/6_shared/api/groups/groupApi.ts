import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import { IGroupTemplateModel, IGroupTemplatesBody } from '6_shared';

import {
  IGetGroupsByTypeRequestParams,
  ICreateGroupBody,
  IElementsMutationRequestParams,
  IGetGroupStatisticRequestParams,
  IGroupStatisticModel,
  IProcessElementGroupModel,
  IProcessGroupModel,
  IGetGroupByTypeModel,
} from './types';

const dynamicBaseQuery = generateDynamicBaseQuery('_processGroupApiBase');

const groupApiOptions = { apiName: 'groupApi' };

export const groupApi = createApi({
  ...setDefaultApiSettings('processGroup', dynamicBaseQuery, ['ProcessGroup']),
  endpoints: (builder) => ({
    // GROUP ELEMENTS
    addElementToGroup: builder.mutation<
      IProcessElementGroupModel[],
      IElementsMutationRequestParams
    >({
      query: ({ body, group_name }) => ({
        url: 'elements/',
        method: 'POST',
        params: { group_name },
        body,
      }),
      invalidatesTags: [
        { type: 'ProcessGroup', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: groupApiOptions,
    }),

    deleteElementsFromGroup: builder.mutation<
      IProcessElementGroupModel[],
      IElementsMutationRequestParams
    >({
      query: ({ body, group_name }) => ({
        url: 'elements/',
        method: 'DELETE',
        params: { group_name },
        body,
      }),
      invalidatesTags: [
        { type: 'ProcessGroup', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: groupApiOptions,
    }),

    getGroupElementById: builder.query<IProcessElementGroupModel[], number>({
      query: (entity_id) => ({ url: `elements/${entity_id}` }),
      providesTags: [{ type: 'ProcessGroup', id: 'LIST' }],
      extraOptions: groupApiOptions,
    }),

    getAllElementsInGroup: builder.query<IProcessElementGroupModel[], string>({
      query: (group_name) => ({ url: `elements/group/${group_name}` }),
      providesTags: [{ type: 'ProcessGroup', id: 'LIST' }],
      extraOptions: groupApiOptions,
    }),

    // GROUPS
    getAllGroups: builder.query<IProcessGroupModel[], any>({
      query: () => ({ url: 'groups/all' }),
      providesTags: [{ type: 'ProcessGroup', id: 'LIST' }],
      extraOptions: groupApiOptions,
    }),

    getGroupsByType: builder.query<IGetGroupByTypeModel, IGetGroupsByTypeRequestParams>({
      query: ({ group_type, ...params }) => ({ url: `groups/by_type/${group_type}`, params }),
      providesTags: [{ type: 'ProcessGroup', id: 'LIST' }],
      extraOptions: groupApiOptions,
    }),

    createGroup: builder.mutation<IProcessGroupModel, ICreateGroupBody>({
      query: (body) => ({ url: 'groups/', method: 'POST', body }),
      invalidatesTags: [
        { type: 'ProcessGroup', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: groupApiOptions,
    }),

    deleteGroup: builder.mutation<IProcessGroupModel, string[]>({
      query: (body) => ({ url: 'groups/', method: 'DELETE', body }),
      invalidatesTags: [
        { type: 'ProcessGroup', id: 'LIST' },
        { type: 'Processes', id: 'LIST' },
      ],
      extraOptions: groupApiOptions,
    }),

    getGroupStatistic: builder.mutation<IGroupStatisticModel, IGetGroupStatisticRequestParams>({
      query: (params) => ({ url: 'groups/statistic', method: 'POST', params }),
      extraOptions: groupApiOptions,
    }),

    // ====== GROUP TEMPLATES ====
    getAllGroupTemplates: builder.query<
      IGroupTemplateModel[],
      { offset?: number; limit?: number } | undefined
    >({
      query: (params) => ({
        url: 'templates/all',
        params,
      }),
      providesTags: ['Templates'],
    }),
    createGroupTemplate: builder.mutation<void, IGroupTemplatesBody>({
      query: (body) => ({ url: '/templates', method: 'POST', body }),
      invalidatesTags: ['Templates'],
    }),
    deleteGroupTemplate: builder.mutation<void, number[]>({
      query: (body) => ({ url: '/templates', method: 'DELETE', body }),
      invalidatesTags: ['Templates'],
    }),
  }),
});
