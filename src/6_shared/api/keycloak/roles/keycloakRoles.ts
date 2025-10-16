import { keycloakApi } from '../keycloakApi';
import {
  Composite,
  GetRoleGroupsParams,
  GetRolesParams,
  GetRoleUsersParams,
  NewRole,
  Role,
  RolePartial,
  RoleGroup,
} from './types';

export const keycloakRolesApi = keycloakApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], GetRolesParams | void>({
      query: (params) => ({
        url: '/roles',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Roles' as const, id })),
              { type: 'Roles', id: 'LIST' },
            ]
          : [
              { type: 'Roles', id: 'LIST' },
              { type: 'Users', id: 'LIST' },
              { type: 'Groups', id: 'LIST' },
            ],
    }),

    getRole: builder.query<Role, string>({
      query: (roleName) => ({
        url: `/roles/${roleName}`,
      }),
      providesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    createRole: builder.mutation<void, NewRole>({
      query: (body) => ({
        url: '/roles/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    editRole: builder.mutation<void, [roleName: string, body: NewRole]>({
      query: ([roleName, body]) => ({
        url: `/roles/${roleName}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    editRoleById: builder.mutation<void, [roleId: string, body: NewRole]>({
      query: ([roleId, body]) => ({
        url: `/roles-by-id/${roleId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (roleName) => ({
        url: `/roles/${roleName}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    getRoleComposites: builder.query<Composite[], string>({
      query: (roleName) => ({
        url: `/roles/${roleName}/composites`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Roles' as const, id })),
              { type: 'Roles', id: 'LIST' },
            ]
          : [{ type: 'Roles', id: 'LIST' }],
    }),

    addRoleComposites: builder.mutation<void, [roleName: string, body: RolePartial[]]>({
      query: ([roleName, body]) => ({
        url: `/roles/${roleName}/composites`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    deleteRoleComposites: builder.mutation<void, [roleName: string, body: RolePartial[]]>({
      query: ([roleName, body]) => ({
        url: `/roles/${roleName}/composites`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),

    getRoleUsers: builder.query<any, [roleName: string, params: GetRoleUsersParams | void]>({
      query: ([roleName, params]) => ({
        url: `/roles/${roleName}/users`,
        params: params ?? {},
      }),
      providesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),

    getRoleGroups: builder.query<
      RoleGroup[],
      [roleName: string, params: GetRoleGroupsParams | void]
    >({
      query: ([roleName, params]) => ({
        url: `/roles/${roleName}/groups`,
        params: params ?? {},
      }),
      providesTags: [
        { type: 'Roles', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
        { type: 'Groups', id: 'LIST' },
      ],
    }),
  }),
});
