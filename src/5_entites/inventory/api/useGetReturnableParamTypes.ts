import { useMemo } from 'react';

import { parameterTypesApi } from '6_shared';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

interface IProps {
  pmTmoId: number | undefined;
}
export const useGetReturnableParamTypes = ({ pmTmoId }: IProps) => {
  const {
    data: paramTypes,
    isSuccess: isParamTypesSuccess,
    isFetching: isParamTypesFetching,
  } = useGetObjectTypeParamTypesQuery({ id: pmTmoId! }, { skip: !pmTmoId });

  const returnableParamTypes = useMemo(() => {
    return paramTypes ? paramTypes.filter((paramType) => paramType.returnable) : [];
  }, [paramTypes]);

  return { returnableParamTypes, isParamTypesSuccess, isParamTypesFetching };
};
