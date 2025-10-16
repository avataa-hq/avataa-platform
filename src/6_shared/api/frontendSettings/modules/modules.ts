import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import { ModulesData } from './types';

export const modulesApi = frontendSettingsApi.injectEndpoints({
  endpoints: (build) => ({
    getAllModules: build.query<ModulesData, void>({
      query: () => ({
        url: `modules/all`,
      }),
      providesTags: () => [{ type: 'Modules', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    patchAllModules: build.mutation<void, any>({
      query: (body) => ({
        url: `modules/all`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Modules', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getModule: build.query<any, string>({
      query: (defaultName) => ({
        url: `modules/${defaultName}`,
      }),
      providesTags: () => [{ type: 'Modules', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    patchModule: build.mutation<void, any>({
      query: ({ defaultName, customName }) => ({
        url: `modules/${defaultName}`,
        method: 'PATCH',
        customName,
      }),
      invalidatesTags: [{ type: 'Modules', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteModule: build.mutation<void, string>({
      query: (defaultName) => ({
        url: `modules/${defaultName}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Modules', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
