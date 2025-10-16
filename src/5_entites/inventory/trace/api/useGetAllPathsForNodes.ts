import { graphApi } from '6_shared';

const { useGetAllPathsForNodesQuery } = graphApi.trace;

interface IProps {
  database_key: string;
  node_key: string;
  skip: boolean;
}

export const useGetAllPathsForNodes = ({ database_key, node_key, skip }: IProps) => {
  const {
    data: allPathsForNodesData,
    isFetching: isAllPathsForNodesDataFetching,
    isError: isAllPathsForNodesDataError,
    refetch: allPathsForNodesDataRefetchFn,
  } = useGetAllPathsForNodesQuery(
    {
      database_key,
      body: {
        node_key,
      },
    },
    { skip },
  );
  return {
    allPathsForNodesData,
    isAllPathsForNodesDataFetching,
    isAllPathsForNodesDataError,
    allPathsForNodesDataRefetchFn,
  };
};
