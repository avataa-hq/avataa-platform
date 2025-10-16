import { securityApi } from '6_shared';
import { useMemo } from 'react';

interface IProps {
  objectId?: number | null;
}

export const useGetObjectPermissions = ({ objectId }: IProps) => {
  const { data: cachedData } = securityApi.endpoints.getObjectPermissions.useQueryState(objectId!);

  const {
    data: objectPermissions,
    isFetching: isObjectPermissionsFetching,
    isError: isObjectPermissionsError,
    refetch: objectPermissionsRefetchFn,
    error: objectPermissionsError,
  } = securityApi.useGetObjectPermissionsQuery(objectId!, { skip: !objectId || !!cachedData });

  const data = useMemo(() => {
    return objectPermissions || cachedData;
  }, [cachedData, objectPermissions]);

  return {
    objectPermissions: data,
    isObjectPermissionsFetching,
    isObjectPermissionsError,
    objectPermissionsRefetchFn,
    objectPermissionsError,
  };
};
