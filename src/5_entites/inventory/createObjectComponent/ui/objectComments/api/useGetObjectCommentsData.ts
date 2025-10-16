import { useMemo } from 'react';
import { commentsApi } from '6_shared';

interface IProps {
  objectId: number | null;
  page?: number;
  searchQuery: string | undefined;
}

export const useGetObjectCommentsData = ({ objectId, searchQuery }: IProps) => {
  const { data: cachedData } = commentsApi.endpoints.getAllComments.useQueryState({
    id: objectId!,
    contains: searchQuery,
  });

  const {
    data: commentsData,
    isFetching: isCommentsDataFetching,
    refetch: commentsRefetchFn,
    isError: isCommentsDataError,
    error: commentsError,
  } = commentsApi.useGetAllCommentsQuery(
    { id: objectId!, contains: searchQuery },
    {
      skip: !objectId || (objectId === cachedData?.comments?.[0]?.object_id && searchQuery === ' '),
    },
  );

  const data = useMemo(() => {
    return commentsData || cachedData;
  }, [cachedData, commentsData]);

  return {
    commentsData: data,
    isCommentsDataFetching,
    commentsRefetchFn,
    isCommentsDataError,
    commentsError,
  };
};
