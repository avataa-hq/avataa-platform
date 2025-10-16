import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { Message, Group, Source } from './types';

export const dataflowGroupsApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getAllGroups: build.query<Group[], void>({
      query: () => ({
        url: 'groups',
      }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Group' as const, id })), 'Group'] : ['Group'],
      extraOptions: dataflowApiOptions,
    }),
    getGroupById: build.query<Group, number>({
      query: (groupId) => ({
        url: `groups/${groupId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Group', id }],
      extraOptions: dataflowApiOptions,
    }),
    deleteGroup: build.mutation<void, number>({
      query: (groupId) => ({
        url: `groups/${groupId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Group', id }],
      extraOptions: dataflowApiOptions,
    }),
    patchGroup: build.mutation<Group, Partial<Omit<Group, 'id'>> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `groups/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
      extraOptions: dataflowApiOptions,
    }),
    createGroup: build.mutation<Group, Omit<Group, 'id'>>({
      query: (body) => ({
        url: 'groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Group' }],
      extraOptions: dataflowApiOptions,
    }),
    testLoad: build.query<Message, number>({
      query: (groupId) => ({
        url: `groups/${groupId}/load_data`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getGroupSources: build.query<Source[], number>({
      query: (groupId) => ({
        url: `groups/${groupId}/sources`,
      }),
      providesTags: () => [{ type: 'Source', id: 'LIST' }],
      extraOptions: dataflowApiOptions,
    }),
  }),
});
