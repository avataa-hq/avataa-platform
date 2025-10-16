import { hierarchyPermissions } from '6_shared';

interface IProps {
  hierarchyId?: number | null;
}

export const useGetHierarchyPermissions = ({ hierarchyId }: IProps) => {
  const {
    data: hierarchyPermissionsData,
    isFetching: isHierarchyPermissionsFetching,
    isError: isHierarchyPermissionsError,
    refetch: hierarchyPermissionsRefetchFn,
    error: hierarchyPermissionsError,
  } = hierarchyPermissions.useGetHierarchyPermissionsQuery(hierarchyId!, { skip: !hierarchyId });

  return {
    hierarchyPermissionsData,
    isHierarchyPermissionsFetching,
    isHierarchyPermissionsError,
    hierarchyPermissionsRefetchFn,
    hierarchyPermissionsError,
  };
};
