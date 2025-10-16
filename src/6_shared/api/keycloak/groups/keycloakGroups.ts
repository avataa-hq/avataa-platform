import { keycloakApi } from '../keycloakApi';
import {
  GetGroupCountParams,
  GetGroupsParams,
  GetGroupUsers,
  Group,
  GroupRole,
  NewGroupRole,
  GroupRoleMapping,
  GroupUser,
  NewGroup,
} from './types';

export const keycloakGroupsApi = keycloakApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], GetGroupsParams | void>({
      query: (params) => ({
        url: '/groups',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Groups', id })), { type: 'Groups', id: 'LIST' }]
          : [
              { type: 'Groups', id: 'LIST' },
              { type: 'Users', id: 'LIST' },
              { type: 'Roles', id: 'LIST' },
            ],
    }),

    getGroupsCount: builder.query<{ count: number }, GetGroupCountParams | void>({
      query: (params) => ({
        url: '/groups/count',
        params: params ?? {},
      }),
      providesTags: () => [{ type: 'Groups', id: 'LIST' }],
    }),

    getGroup: builder.query<Group, string>({
      query: (id) => ({
        url: `/groups/${id}`,
      }),
      providesTags: () => [
        { type: 'Groups', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    addGroup: builder.mutation<void, NewGroup>({
      query: (body) => ({
        url: '/groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    editGroup: builder.mutation<void, [id: string, body: NewGroup]>({
      query: ([id, body]) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [
        { type: 'Groups', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Groups', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    addGroupChildren: builder.mutation<void, [id: string, body: NewGroup]>({
      query: ([id, body]) => ({
        url: `/groups/${id}/children`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    getUsersInGroup: builder.query<GroupUser[], [id: string, params?: GetGroupUsers]>({
      query: ([id, params]) => ({
        url: `/groups/${id}/members`,
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Groups', id })), { type: 'Groups', id: 'LIST' }]
          : [
              { type: 'Groups', id: 'LIST' },
              { type: 'Users', id: 'LIST' },
              { type: 'Roles', id: 'LIST' },
            ],
    }),

    getGroupRoles: builder.query<GroupRoleMapping, string>({
      query: (id) => ({
        url: `/groups/${id}/role-mappings`,
      }),
      providesTags: [
        { type: 'Groups', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    // TODO - try these hands-on, then add the role-mappers for users
    addGroupRoles: builder.mutation<void, [id: string, body: NewGroupRole[]]>({
      query: ([id, body]) => ({
        url: `/groups/${id}/role-mappings/realm`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Groups', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    deleteGroupRoles: builder.mutation<void, [id: string, body: NewGroupRole[]]>({
      query: ([id, body]) => ({
        url: `/groups/${id}/role-mappings/realm`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [
        { type: 'Groups', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    getGroupAvailableRoles: builder.query<any, string>({
      query: (id) => ({
        url: `/groups/${id}/role-mappings/realm/available`,
      }),
      providesTags: () => [
        { type: 'Groups', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    getGroupCompositeRoles: builder.query<GroupRole[], [id: string, params?: boolean]>({
      query: ([id, params]) => ({
        url: `/groups/${id}/role-mappings/realm/composite`,
        params: params ?? {},
      }),
      providesTags: [{ type: 'Groups', id: 'LIST' }],
    }),
  }),
});
