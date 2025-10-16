import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import { ModuleSettingsType } from './types';

export const moduleSettingsApi = frontendSettingsApi.injectEndpoints({
  endpoints: (build) => ({
    getAllModulesSettings: build.query<ModuleSettingsType[], void>({
      query: () => ({
        url: `module_settings`,
      }),
      providesTags: () => [{ type: 'ModuleSettings', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    getModuleSettings: build.query<ModuleSettingsType, string>({
      query: (moduleName) => ({
        url: `module_settings/${moduleName}`,
      }),
      providesTags: () => [{ type: 'ModuleSettings', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    createModuleSettings: build.mutation<void, ModuleSettingsType>({
      query: (body) => ({
        url: `module_settings`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ModuleSettings', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateModuleSettings: build.mutation<void, ModuleSettingsType>({
      query: (body) => ({
        url: `module_settings/${body.module_name}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'ModuleSettings', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteModuleSettings: build.mutation<void, string>({
      query: (moduleName) => ({
        url: `module_settings/${moduleName}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ModuleSettings', id: 'LIST' }],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
