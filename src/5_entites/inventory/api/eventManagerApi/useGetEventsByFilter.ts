import { eventManagerApi, IGetEventsByFilterFilterColumn } from '6_shared';

interface IProps {
  filter_column?: IGetEventsByFilterFilterColumn[];
  date_from?: string | Date;
  date_to?: string | Date;
  sort_by?: {
    field: string;
    descending: 'ASC' | 'DESC';
  };
  limit?: number;
  offset?: number;
  skip?: boolean;
}

export const useGetEventsByFilter = ({
  filter_column,
  date_from,
  date_to,
  sort_by,
  limit,
  offset,
  skip,
}: IProps) => {
  const { useGetEventsByFilterQuery } = eventManagerApi;

  const {
    data: eventsData,
    isFetching: isEventsDataFetching,
    isError: isEventsDataError,
  } = useGetEventsByFilterQuery(
    { filter_column, date_from, date_to, sort_by, limit, offset },
    { skip },
  );
  return {
    eventsData,
    isEventsDataFetching,
    isEventsDataError,
  };
};
