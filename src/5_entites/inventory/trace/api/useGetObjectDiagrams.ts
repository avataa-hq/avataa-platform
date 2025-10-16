import { graphSearchApi } from '6_shared/api/graph/search';

const { useGetObjectDiagramsQuery } = graphSearchApi;

interface IProps {
  objectId: number;
}
export const useGetObjectDiagrams = ({ objectId }: IProps) => {
  const {
    data: objectDiagramsData,
    isFetching: isObjectDiagramsFetching,
    isError: isObjectDiagramsError,
  } = useGetObjectDiagramsQuery(objectId, {
    skip: objectId === 0,
  });

  return {
    objectDiagramsData,
    isObjectDiagramsFetching,
    isObjectDiagramsError,
  };
};
