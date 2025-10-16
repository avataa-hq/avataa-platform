import { useMemo } from 'react';
import { objectsApi } from '6_shared';

interface IProps {
  objectId: number | null;
}

export const useGetObjectGroupedParams = ({ objectId }: IProps) => {
  const { data: cachedData } = objectsApi.endpoints.getObjectWithGroupedParameters.useQueryState({
    id: objectId,
    only_filled: false,
  });

  const {
    data: objectParams,
    isFetching: isObjectParamsFetching,
    isError: isObjectParamsError,
    refetch: objectParamsRefetchFn,
    error: objectParamsError,
  } = objectsApi.useGetObjectWithGroupedParametersQuery(
    {
      id: objectId,
      only_filled: false,
    },
    { skip: !objectId || objectId === cachedData?.[0]?.params?.[0]?.mo_id },
  );

  const data = useMemo(() => objectParams || cachedData, [cachedData, objectParams]);

  return {
    objectParams: data,
    isObjectParamsFetching,
    isObjectParamsError,
    objectParamsRefetchFn,
    objectParamsError,
  };
};
