import { keycloakApi } from '../keycloakApi';
import {
  GetUsersCount,
  GetUsersParams,
  NewUserRole,
  UserCredentials,
  UserGroup,
  UserPasswordUpdate,
  UserRepresentation,
  UserRole,
  UserRoleMapping,
} from './types';

export const keycloakUsersApi = keycloakApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserRepresentation[], GetUsersParams | void>({
      query: (params) => ({
        url: '/users',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [
              { type: 'Users', id: 'LIST' },
              { type: 'Roles', id: 'LIST' },
              { type: 'Groups', id: 'LIST' },
            ],
    }),

    getUsersCount: builder.query<number, GetUsersCount | void>({
      query: (params) => ({
        url: '/users/count',
        params: params ?? {},
      }),
      providesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),

    getUser: builder.query<UserRepresentation, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: () => [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    getUserCredentials: builder.query<UserCredentials, string>({
      query: (id) => ({
        url: `/users/${id}/credentials`,
      }),
      providesTags: () => [{ type: 'Users', id: 'LIST' }],
    }),

    addUser: builder.mutation<void, UserRepresentation>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    editUser: builder.mutation<void, [id: string, body: UserRepresentation]>({
      query: ([id, body]) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    getUserGroups: builder.query<UserGroup[], string>({
      query: (id) => ({
        url: `/users/${id}/groups`,
      }),
      providesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    getUserGroupsCount: builder.query<{ count: number }, string>({
      query: (id) => ({
        url: `/users/${id}/groups/count`,
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    addUserToGroup: builder.mutation<void, [userId: string, groupId: string]>({
      query: ([userId, groupId]) => ({
        url: `/users/${userId}/groups/${groupId}`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    deleteUserFromGroup: builder.mutation<void, [userId: string, groupId: string]>({
      query: ([userId, groupId]) => ({
        url: `/users/${userId}/groups/${groupId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    createPassword: builder.mutation<void, [id: string, body: UserPasswordUpdate]>({
      query: ([id, body]) => ({
        url: `/users/${id}/reset-password`,
        method: 'PUT',
        body,
      }),
    }),

    getUserRoles: builder.query<UserRoleMapping, string>({
      query: (id) => ({
        url: `/users/${id}/role-mappings`,
      }),
      providesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    getUserRealmRoles: builder.query<UserRole[], string>({
      query: (id) => ({
        url: `/users/${id}/role-mappings/realm`,
      }),
      providesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    addUserRoles: builder.mutation<void, [id: string, body: NewUserRole[]]>({
      query: ([id, body]) => ({
        url: `/users/${id}/role-mappings/realm`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    deleteUserRoles: builder.mutation<void, [id: string, body: NewUserRole[]]>({
      query: ([id, body]) => ({
        url: `/users/${id}/role-mappings/realm`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    getUserAvailableRoles: builder.query<UserRole[], string>({
      query: (id) => `/users/${id}/role-mappings/realm/available`,
      providesTags: [
        { type: 'Users', id: `LIST` },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    getUserCompositeRoles: builder.query<UserRole[], [id: string, params?: boolean]>({
      query: ([id, params]) => ({
        url: `/users/${id}/role-mappings/realm/composite`,
        params: params ?? {},
      }),
      providesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Roles', id: 'LIST' },
      ],
    }),

    // TODO: gotta understand how to implement the mail sending
    // 415 (Unsupported Media Type)
    sendUpdateAccountEmail: builder.mutation<void, [id: string, body: string]>({
      query: ([id, body]) => ({
        url: `/users/${id}/execute-actions-email`,
        method: 'PUT',
        body,
      }),
    }),

    // TODO: gotta understand how to implement the mail sending
    // 500 (Internal Server Error)
    sendVerificationEmail: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/send-verify-email`,
        method: 'PUT',
      }),
    }),
  }),
});
