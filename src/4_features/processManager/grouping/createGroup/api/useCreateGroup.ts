import { getErrorMessage, ICreateGroupBody, groupApi } from '6_shared';
import { enqueueSnackbar } from 'notistack';

export const useCreateGroup = () => {
  const { useCreateGroupMutation } = groupApi;
  const [createGroup, { data, isSuccess, isLoading, isError }] = useCreateGroupMutation();

  const createNewGroup = async (body: ICreateGroupBody) => {
    try {
      const response = await createGroup(body).unwrap();
      enqueueSnackbar('The group has been successfully created', { variant: 'success' });
      return response;
    } catch (error) {
      const errorMessageFromResponse = getErrorMessage(error);
      const myErrorMessage = error?.data?.detail ?? 'Something went wrong when creating the group';
      const message =
        errorMessageFromResponse && errorMessageFromResponse.trim().length < 30
          ? errorMessageFromResponse.trim()
          : myErrorMessage;
      enqueueSnackbar(message, { variant: 'warning' });
      return null;
    }
  };

  return {
    createNewGroup,
    createNewGroupResponse: data,
    isSuccessCreateGroup: isSuccess,
    isLoadingCreateGroup: isLoading,
    isErrorCreateGroup: isError,
  };
};
