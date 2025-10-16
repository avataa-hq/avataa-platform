import { SquashLevel, graphApi } from '6_shared';

const { useGetPathBetweenNodesQuery } = graphApi.trace;

interface IProps {
  database_key: string;
  node_key_a: string;
  node_key_b: string;
  squash_level: SquashLevel;
  skip: boolean;
}

export const useGetPathBetweenNodes = ({
  database_key,
  node_key_a,
  node_key_b,
  squash_level,
  skip,
}: IProps) => {
  const {
    data: pathBetweenNodesData,
    isFetching: isPathBetweenNodesDataFetching,
    isError: isPathBetweenNodesDataError,
  } = useGetPathBetweenNodesQuery(
    {
      database_key,
      node_key_a,
      node_key_b,
      body: {
        squash_level,
      },
    },
    { skip },
  );
  return { pathBetweenNodesData, isPathBetweenNodesDataFetching, isPathBetweenNodesDataError };
};
