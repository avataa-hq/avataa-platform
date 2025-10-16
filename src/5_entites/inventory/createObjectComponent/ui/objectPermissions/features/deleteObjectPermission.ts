import { InventoryPermissionsModel } from '6_shared';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface IProps {
  deleteMultiplePermissionsFn: MutationTrigger<
    MutationDefinition<
      number[],
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
      'Objects' | 'Security',
      void,
      string
    >
  >;
  permissionsToDelete: InventoryPermissionsModel[];
}

export const deleteObjectPermission = ({
  deleteMultiplePermissionsFn,
  permissionsToDelete,
}: IProps) => {
  if (permissionsToDelete.length) {
    deleteMultiplePermissionsFn(permissionsToDelete.map((role) => role.id));
  }
};
