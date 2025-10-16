import { SquashLevel, graphApi } from '6_shared';

const { useGetPathQuery } = graphApi.trace;

interface IProps {
  database_key: string;
  trace_node_key: string;
  squash_level: SquashLevel;
  skip: boolean;
}

export const useGetPath = ({
  database_key,
  trace_node_key,
  squash_level = 'Local',
  skip,
}: IProps) => {
  const {
    data: pathData,
    isFetching: isPathDataFetching,
    isError: isPathDataError,
    refetch: pathDataRefetchFn,
  } = useGetPathQuery(
    {
      database_key,
      body: {
        trace_node_key,
        squash_level,
      },
    },
    { skip },
  );
  return { pathData, isPathDataFetching, isPathDataError, pathDataRefetchFn };
};
