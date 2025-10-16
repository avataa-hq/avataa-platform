import type { ISavedState } from '6_shared';
import { frontendSettingsApiOptions, frontendSettingsApi } from '../api';

interface IPostStateBody {
  expires_in_minutes: number;
  state: ISavedState;
}

export const stateApi = frontendSettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getState: builder.query<ISavedState, string>({
      query: (stateId) => `state/${stateId}`,
      extraOptions: frontendSettingsApiOptions,
    }),
    postState: builder.mutation<string, IPostStateBody>({
      query: ({ state, expires_in_minutes }) => ({
        url: 'state/',
        method: 'POST',
        body: { state, expires_in_minutes },
        extraOptions: frontendSettingsApiOptions,
      }),
    }),
  }),
});
