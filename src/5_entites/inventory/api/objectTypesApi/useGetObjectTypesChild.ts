import { objectTypesApi } from '6_shared';

interface IProps {
  parentId: number | null;
  skip?: boolean;
}

export const useGetObjectTypesChild = ({ parentId, skip }: IProps) => {
  const { useGetObjectTypesChildQuery } = objectTypesApi;

  const { data, isFetching, isError } = useGetObjectTypesChildQuery(parentId ?? 0, { skip });

  return { data, isFetching, isError };
};
