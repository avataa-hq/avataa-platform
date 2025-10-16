import { IElementsMutationRequestParams, groupApi } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

const { useAddElementToGroupMutation } = groupApi;
export const useAddElementsToGroup = () => {
  const [addToGroup, { isError, isLoading, isSuccess, error, data }] =
    useAddElementToGroupMutation();

  const addElements = async (body: IElementsMutationRequestParams) => {
    await addToGroup(body);
  };

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Elements were successfully added to the group', { variant: 'success' });
    }

    if (error) {
      // @ts-ignore
      const errorMessageFromResponse = error.data.detail;
      const myErrorMessage = 'Something went wrong when adding elements to the group';
      const message =
        errorMessageFromResponse && errorMessageFromResponse.trim().length < 30
          ? errorMessageFromResponse.trim()
          : myErrorMessage;
      enqueueSnackbar(message, { variant: 'warning' });
    }
  }, [isSuccess, error]);

  return {
    addElements,
    addElementsToGroupResponseData: data,
    isLoadingAddElementsToGroup: isLoading,
    isSuccessAddElementsToGroup: isSuccess,
    isErrorAddElementsToGroup: isError,
  };
};
