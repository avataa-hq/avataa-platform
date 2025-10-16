import { parameterTypesApi } from '6_shared';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

interface IProps {
  objectTmoId: number | undefined;
  skip?: boolean;
}

export const useGetObjectTypeParamTypes = ({ objectTmoId = 0, skip }: IProps) => {
  const { data: objectTypeParamTypes, isFetching: isObjectTypesParamTypesFetching } =
    useGetObjectTypeParamTypesQuery({ id: objectTmoId }, { skip: objectTmoId === 0 || skip });

  return { objectTypeParamTypes, isObjectTypesParamTypesFetching };
};
