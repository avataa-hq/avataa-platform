import { sessionRegistryApi } from '6_shared';

interface IProps {
  limit?: number;
  offset?: number;
  datetime_from?: string | Date;
  datetime_to?: string | Date;
  skip?: boolean;
}

export const useGetSessionRegistryData = ({
  limit,
  offset,
  datetime_from,
  datetime_to,
  skip,
}: IProps) => {
  const { useGetSessionRegistryQuery } = sessionRegistryApi;

  const { data: sessionAuditData, isFetching: isSessionAuditFetching } = useGetSessionRegistryQuery(
    { limit, offset, datetime_from, datetime_to },
    { skip },
  );

  return { sessionAuditData, isSessionAuditFetching };
};
