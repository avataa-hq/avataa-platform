import { IUserSettingsBody, userSettingsApi, UserSettingsUniqueKeys } from '6_shared';
import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';

const {
  useUpdateUserSettingMutation,
  useDeleteUserSettingMutation,
  useCreateUserSettingMutation,
  useGetAllUserSettingsQuery,
} = userSettingsApi;

export const useUserSettingsCud = () => {
  const [create, { isLoading: isLoadingCreate }] = useCreateUserSettingMutation();
  const [update, { isLoading: isLoadingUpdate }] = useUpdateUserSettingMutation();
  const [deleteSetting, { isLoading: isLoadingDelete }] = useDeleteUserSettingMutation();

  const { data: existingSettingsKeys } = useGetAllUserSettingsQuery();

  const createUserSettings = useCallback(
    async <T extends UserSettingsUniqueKeys>(body: IUserSettingsBody<T>) => {
      try {
        await create(body).unwrap();
        enqueueSnackbar<'success'>('Creation success', { variant: 'success' });
      } catch (e) {
        enqueueSnackbar<'error'>('Creation fail', { variant: 'error' });
      }
    },
    [create],
  );

  const updateUserSettings = useCallback(
    async <T extends UserSettingsUniqueKeys>(body: IUserSettingsBody<T>) => {
      try {
        if (!existingSettingsKeys?.includes(body.key)) {
          await createUserSettings(body);
        }
        await update(body).unwrap();

        // enqueueSnackbar('Updating success', { variant: 'success' });
      } catch (e) {
        enqueueSnackbar('Updating fail', { variant: 'error' });
      }
    },
    [createUserSettings, existingSettingsKeys, update],
  );

  const deleteUserSettings = useCallback(
    async (key: UserSettingsUniqueKeys) => {
      try {
        await deleteSetting(key).unwrap();
        enqueueSnackbar<'success'>('Deleting success', { variant: 'success' });
      } catch (e) {
        enqueueSnackbar<'error'>('Deleting fail', { variant: 'error' });
      }
    },
    [deleteSetting],
  );

  const isLoading = isLoadingUpdate || isLoadingCreate || isLoadingDelete;
  return { createUserSettings, updateUserSettings, deleteUserSettings, isLoading };
};
