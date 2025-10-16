import { graphApi } from '6_shared';

const { useGetNodesByMoIdQuery } = graphApi.trace;

interface IProps {
  objectId: number;
}

export const useGetNodesByMoId = ({ objectId }: IProps) => {
  const {
    data: nodesByMoIdData,
    isFetching: isNodesByMoIdDataFetching,
    isError: isNodesByMoIdDataError,
    refetch: nodesByMoIdDataRefetchFn,
  } = useGetNodesByMoIdQuery(objectId, { skip: objectId === 0 });
  return {
    nodesByMoIdData,
    isNodesByMoIdDataFetching,
    isNodesByMoIdDataError,
    nodesByMoIdDataRefetchFn,
  };
};
