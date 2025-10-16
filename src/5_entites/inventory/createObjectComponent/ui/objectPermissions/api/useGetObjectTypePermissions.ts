import { securityApi } from '6_shared';

interface IProps {
  objectTypeId?: number | null;
}

export const useGetObjectTypePermissions = ({ objectTypeId }: IProps) => {
  const {
    data: objectTypePermissions,
    isFetching: isObjectTypePermissionsFetching,
    isError: isObjectTypePermissionsError,
    refetch: objectTypePermissionsRefetchFn,
    error: objectTypePermissionsError,
  } = securityApi.useGetObjectTypePermissionsQuery(objectTypeId!, { skip: !objectTypeId });

  return {
    objectTypePermissions,
    isObjectTypePermissionsFetching,
    isObjectTypePermissionsError,
    objectTypePermissionsRefetchFn,
    objectTypePermissionsError,
  };
};
