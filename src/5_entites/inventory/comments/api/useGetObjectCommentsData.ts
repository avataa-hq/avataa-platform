import { useEffect, useState } from 'react';
import { commentsApi } from '6_shared';

interface IProps {
  objectId: number | null;
  page?: number;
  startDate: string | undefined;
  endDate: string | undefined;
  searchQuery: string | undefined;
}

export const useGetObjectCommentsData = ({
  objectId,
  page = 0,
  startDate,
  endDate,
  searchQuery,
}: IProps) => {
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: commentsData,
    isFetching: isCommentsDataFetching,
    refetch: commentsRefetchFn,
    isError: isCommentsDataError,
    error: commentsError,
  } = commentsApi.useGetAllCommentsQuery(
    {
      id: objectId!,
      created_from: startDate,
      created_to: endDate,
      contains: searchQuery,
    },
    { skip: !objectId },
  );

  useEffect(() => {
    if (commentsData && commentsData.quantity) {
      setTotalPages(commentsData.quantity);
    }
  }, [commentsData, totalPages]);

  return {
    commentsData,
    isCommentsDataFetching,
    commentsRefetchFn,
    isCommentsDataError,
    commentsError,
    totalPages,
  };
};
