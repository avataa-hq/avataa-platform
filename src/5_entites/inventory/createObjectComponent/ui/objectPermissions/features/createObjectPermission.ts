import {
  CreateMultiplePermissionsBody,
  InventoryPermissionsModel,
  SecurityMiddlewareLowLevelModel,
} from '6_shared';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface IProps {
  createMultiplePermissionsFn: MutationTrigger<
    MutationDefinition<
      CreateMultiplePermissionsBody,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
      'Objects' | 'Security',
      void,
      string
    >
  >;
  objectId: number;
  objectPermissions: InventoryPermissionsModel[] | undefined;
  addedLowLevelPermissions: SecurityMiddlewareLowLevelModel[];
}

export const createObjectPermission = ({
  createMultiplePermissionsFn,
  objectId,
  objectPermissions,
  addedLowLevelPermissions,
}: IProps) => {
  const rolesToCreate = addedLowLevelPermissions.filter(
    (role) =>
      !objectPermissions?.some(({ permission }) => permission === role.nameForMicroservices),
  );

  if (rolesToCreate.length) {
    const newPermission = {
      itemId: objectId,
      permission: rolesToCreate.map((role) => role.nameForMicroservices),
      create: true,
      read: true,
      update: true,
      delete: true,
      admin: true,
    };

    createMultiplePermissionsFn(newPermission).unwrap();
  }
};
