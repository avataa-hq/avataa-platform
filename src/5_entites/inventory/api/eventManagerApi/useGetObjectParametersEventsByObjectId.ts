import { eventManagerApi } from '6_shared';

interface IProps {
  objectIds: number[];
  startDate?: string | undefined;
  endDate?: string | undefined;
  limit?: number;
  offset?: number;
  sort?: 'ASC' | 'DESC';
  skip?: boolean;
}

export const useGetObjectParametersEventsByObjectId = ({
  objectIds,
  startDate,
  endDate,
  limit,
  offset,
  sort = 'DESC',
  skip,
}: IProps) => {
  const {
    data: objectParameterEventsData,
    isFetching: isObjectParameterEventsDataFetching,
    isError: isObjectParameterEventsDataError,
    refetch: objectParameterEventsDataRefetchFn,
  } = eventManagerApi.useGetParameterByObjectIdsQuery(
    {
      object_ids: objectIds,
      date_from: startDate,
      date_to: endDate,
      limit,
      offset,
      sort_by_datetime: sort,
    },
    {
      skip,
    },
  );
  return {
    objectParameterEventsData,
    isObjectParameterEventsDataFetching,
    isObjectParameterEventsDataError,
    objectParameterEventsDataRefetchFn,
  };
};
