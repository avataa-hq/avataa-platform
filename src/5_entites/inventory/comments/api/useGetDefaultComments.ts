import { commentsApi } from '6_shared';

export const useGetDefaultComments = () => {
  const {
    data: defaultCommentsData,
    isFetching: isDefaultCommentsDataFetching,
    refetch: defaultCommentsRefetchFn,
    isError: isDefaultCommentsDataError,
  } = commentsApi.useGetAllDefaultCommentsQuery({});

  return {
    defaultCommentsData,
    isDefaultCommentsDataFetching,
    defaultCommentsRefetchFn,
    isDefaultCommentsDataError,
  };
};
