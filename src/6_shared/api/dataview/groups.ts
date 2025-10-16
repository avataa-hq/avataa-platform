import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import { Group, Source } from './types';

export const dataviewGroupsApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGroups: build.query<Group[], void>({
      query: () => ({
        url: 'groups',
      }),
      extraOptions: dataviewApiOptions,
    }),
    getGroupSources: build.query<Source[], number>({
      query: (groupId) => ({
        url: `groups/${groupId}`,
      }),
      providesTags: ['Source'],
      extraOptions: dataviewApiOptions,
    }),
  }),
});
