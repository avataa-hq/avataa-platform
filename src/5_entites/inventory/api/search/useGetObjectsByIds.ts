import { searchApiV2 } from '6_shared';

interface IProps {
  objectIds: number[];
  skip?: boolean;
}

export const useGetObjectsByIds = ({ objectIds, skip }: IProps) => {
  const { useGetObjectsByIdsQuery } = searchApiV2;

  const {
    data: objectsByIdsData,
    isFetching: isObjectsByIdsFetching,
    isError: isObjectsByIdsError,
  } = useGetObjectsByIdsQuery(objectIds, { skip });

  return { objectsByIdsData, isObjectsByIdsFetching, isObjectsByIdsError };
};
