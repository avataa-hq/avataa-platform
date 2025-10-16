import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';
import { IUserSettingsBody, IUserSettingsModel, UserSettingsUniqueKeys } from './types';

// Tag = UserSettings
export const userSettingsApi = frontendSettingsApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUserSettings: build.query<string[], void>({
      query: () => `user_settings/`,
      providesTags: () => ['UserSettings'],
      extraOptions: frontendSettingsApiOptions,
    }),
    getUserSettingByKey: build.query<
      IUserSettingsModel['settings'][UserSettingsUniqueKeys],
      UserSettingsUniqueKeys
    >({
      query: (key) => `user_settings/${key}`,
      providesTags: () => ['UserSettings'],
      extraOptions: frontendSettingsApiOptions,
    }),
    createUserSetting: build.mutation<void, IUserSettingsBody>({
      query: ({ key, ...body }) => ({
        url: `user_settings/${key}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: () => ['UserSettings'],
      extraOptions: frontendSettingsApiOptions,
    }),
    updateUserSetting: build.mutation<void, IUserSettingsBody>({
      query: ({ key, body }) => ({
        url: `user_settings/${key}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => ['UserSettings'],
      extraOptions: frontendSettingsApiOptions,
    }),
    deleteUserSetting: build.mutation<void, UserSettingsUniqueKeys>({
      query: (key) => ({
        url: `user_settings/${key}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => ['UserSettings'],
      extraOptions: frontendSettingsApiOptions,
    }),
  }),
});
