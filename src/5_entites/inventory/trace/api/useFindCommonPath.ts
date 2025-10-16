import { SquashLevel, graphApi } from '6_shared';

const { useFindCommonPathQuery } = graphApi.trace;

interface IProps {
  database_key: string;
  trace_node_a_key: string;
  trace_node_b_key: string;
  squash_level: SquashLevel;
  skip?: boolean;
}

export const useFindCommonPath = ({
  database_key,
  trace_node_a_key,
  trace_node_b_key,
  squash_level = 'Full',
  skip,
}: IProps) => {
  const {
    data: findCommonPathData,
    isFetching: isFindCommonPathFetching,
    isError: isFindCommonPathError,
  } = useFindCommonPathQuery(
    {
      database_key,
      body: {
        trace_node_a_key,
        trace_node_b_key,
        squash_level,
      },
    },
    { skip: skip || database_key === '' },
  );
  return { findCommonPathData, isFindCommonPathFetching, isFindCommonPathError };
};
