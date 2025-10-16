import { objectTypesApi } from '6_shared';

interface IProps {
  tmoId: number;
  skip?: boolean;
}

export const useGetAllChildrenTmoIdByTmo = ({ tmoId, skip }: IProps) => {
  const { useGetAllChildrenTmoIdByTmoQuery } = objectTypesApi;

  const { data, isFetching } = useGetAllChildrenTmoIdByTmoQuery(tmoId, {
    skip,
  });

  return { data, isFetching };
};
