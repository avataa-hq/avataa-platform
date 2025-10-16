import { objectTypesApi } from '6_shared';

const { useGetObjectTypesQuery } = objectTypesApi;

interface IProps {
  objectTypesIds?: number[];
  skip?: boolean;
}

export const useGetObjectTypes = ({ objectTypesIds, skip }: IProps) => {
  const { data: objectTypesData, isFetching } = useGetObjectTypesQuery(
    { object_types_ids: objectTypesIds },
    { skip },
  );

  return { objectTypesData, isFetching };
};
