import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
  securityApi,
  InventoryPermissionsModel,
  securityMiddlewareApi,
  LoadingAvataa,
  useTranslate,
  hierarchyPermissions,
} from '6_shared';
import { useGetLowLevelRoles } from '5_entites/inventory/api';
import * as SC from './ObjectPermissions.styled';
import { createObjectPermission } from '../features/createObjectPermission';
import { deleteObjectPermission } from '../features/deleteObjectPermission';
import { PermissionsList } from './permissionsList/PermissionsList';
import { SecurityLowLevelRoles } from '../types';
import {
  useGetHierarchyPermissions,
  useGetObjectPermissions,
  useGetObjectTypePermissions,
} from '../api';

interface IProps {
  objectId?: number | null;
  objectTypeId?: number | null;
  hierarchyId?: number | null;
  onModalClose: () => void;
}

export const ObjectPermissions = ({
  objectId,
  objectTypeId,
  hierarchyId,
  onModalClose,
}: IProps) => {
  const translate = useTranslate();
  const [checked, setChecked] = useState<SecurityLowLevelRoles[]>([]);
  const [allSecurityLowLevelRoles, setAllSecurityLowLevelRoles] = useState<SecurityLowLevelRoles[]>(
    [],
  );
  const [lowLevelRoles, setLowLevelRoles] = useState<SecurityLowLevelRoles[]>([]);
  const [addedLowLevelPermissions, setAddedLowLevelPermissions] = useState<SecurityLowLevelRoles[]>(
    [],
  );
  const [permissionsToDelete, setPermissionsToDelete] = useState<InventoryPermissionsModel[]>([]);

  const { objectPermissions, isObjectPermissionsFetching } = useGetObjectPermissions({ objectId });

  const { objectTypePermissions, isObjectTypePermissionsFetching } = useGetObjectTypePermissions({
    objectTypeId,
  });

  const { hierarchyPermissionsData, isHierarchyPermissionsFetching } = useGetHierarchyPermissions({
    hierarchyId,
  });

  const { securityLowLevelRoles } = useGetLowLevelRoles();

  const [createMultipleObjectPermissionsFn] =
    securityApi.useCreateMultipleObjectPermissionMutation();
  const [createMultipleObjectTypePermissionFn] =
    securityApi.useCreateMultipleObjectTypePermissionMutation();
  const [createMultipleHierarchiesPermissionsFn] =
    hierarchyPermissions.useAddHierarchiesPermissionsMutation();

  const [deleteMultipleObjectPermissionsFn] =
    securityApi.useDeleteMultipleObjectPermissionMutation();
  const [deleteMultipleObjectTypePermissionsFn] =
    securityApi.useDeleteMultipleObjectTypePermissionMutation();
  const [deleteMultipleHierarchiesPermissionsFn] =
    hierarchyPermissions.useDeleteHierarchiesPermissionsMutation();

  // Set all permissions to state
  useEffect(() => {
    if (securityLowLevelRoles) {
      setLowLevelRoles(securityLowLevelRoles);
      if (allSecurityLowLevelRoles.length === 0) {
        setAllSecurityLowLevelRoles(securityLowLevelRoles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securityLowLevelRoles]);

  // Check exist permission
  const checkPermissions = (
    permissions: InventoryPermissionsModel[],
    role: SecurityLowLevelRoles,
  ) => {
    const existPermission = permissions.some(
      ({ permission }) => permission === role.nameForMicroservices,
    );
    const disabled = permissions.some(
      ({ rootPermissionId, permission }) =>
        rootPermissionId !== null && permission === role.nameForMicroservices,
    );
    const rootItemId = disabled
      ? permissions.find(({ permission }) => permission === role.nameForMicroservices)
          ?.rootItemId || null
      : null;

    return { existPermission, disabled: { status: disabled, rootItemId } };
  };

  // Splitting permissions into 2 lists, available and added
  useEffect(() => {
    if (objectPermissions) {
      const { includedPermissions, excludedPermissions } = lowLevelRoles.reduce(
        (acc, role) => {
          const { existPermission, disabled } = checkPermissions(objectPermissions, role);
          if (existPermission) {
            acc.includedPermissions.push({ ...role, disabled });
          } else {
            acc.excludedPermissions.push({ ...role, disabled });
          }
          return acc;
        },
        {
          includedPermissions: [] as SecurityLowLevelRoles[],
          excludedPermissions: [] as SecurityLowLevelRoles[],
        },
      );
      setAddedLowLevelPermissions(includedPermissions);
      setAllSecurityLowLevelRoles(excludedPermissions);
    }

    if (objectTypePermissions) {
      const { includedPermissions, excludedPermissions } = lowLevelRoles.reduce(
        (acc, role) => {
          const { existPermission, disabled } = checkPermissions(objectTypePermissions, role);
          if (existPermission) {
            acc.includedPermissions.push({ ...role, disabled });
          } else {
            acc.excludedPermissions.push({ ...role, disabled });
          }
          return acc;
        },
        {
          includedPermissions: [] as SecurityLowLevelRoles[],
          excludedPermissions: [] as SecurityLowLevelRoles[],
        },
      );
      setAddedLowLevelPermissions(includedPermissions);
      setAllSecurityLowLevelRoles(excludedPermissions);
    }

    if (hierarchyPermissionsData) {
      const { includedPermissions, excludedPermissions } = lowLevelRoles.reduce(
        (acc, role) => {
          const { existPermission, disabled } = checkPermissions(hierarchyPermissionsData, role);
          if (existPermission) {
            acc.includedPermissions.push({ ...role, disabled });
          } else {
            acc.excludedPermissions.push({ ...role, disabled });
          }
          return acc;
        },
        {
          includedPermissions: [] as SecurityLowLevelRoles[],
          excludedPermissions: [] as SecurityLowLevelRoles[],
        },
      );
      setAddedLowLevelPermissions(includedPermissions);
      setAllSecurityLowLevelRoles(excludedPermissions);
    }
  }, [
    lowLevelRoles,
    objectPermissions,
    objectTypePermissions,
    hierarchyPermissionsData,
    securityLowLevelRoles,
  ]);

  const handleControlObjectPermission = async () => {
    const id = objectId || objectTypeId || hierarchyId;
    const permissions = objectPermissions || objectTypePermissions || hierarchyPermissionsData;
    let permissionCreateFn;
    let permissionDeleteFn;

    if (objectId) {
      permissionCreateFn = createMultipleObjectPermissionsFn;
      permissionDeleteFn = deleteMultipleObjectPermissionsFn;
    } else if (objectTypeId) {
      permissionCreateFn = createMultipleObjectTypePermissionFn;
      permissionDeleteFn = deleteMultipleObjectTypePermissionsFn;
    } else if (hierarchyId) {
      permissionCreateFn = createMultipleHierarchiesPermissionsFn;
      permissionDeleteFn = deleteMultipleHierarchiesPermissionsFn;
    }

    if (!id) return;

    if (permissionCreateFn) {
      createObjectPermission({
        createMultiplePermissionsFn: permissionCreateFn,
        objectId: id,
        objectPermissions: permissions,
        addedLowLevelPermissions,
      });
    }

    if (permissionDeleteFn) {
      deleteObjectPermission({
        deleteMultiplePermissionsFn: permissionDeleteFn,
        permissionsToDelete,
      });
    }
  };

  const handleClose = () => {
    onModalClose();
  };

  // Filter permissions to be removed
  useEffect(() => {
    if (objectPermissions) {
      const permissionToDelete = objectPermissions.filter(({ permission }) => {
        return !addedLowLevelPermissions.some((item) => item.nameForMicroservices === permission);
      });
      setPermissionsToDelete(permissionToDelete);
    }

    if (objectTypePermissions) {
      const permissionToDelete = objectTypePermissions.filter(({ permission }) => {
        return !addedLowLevelPermissions.some((item) => item.nameForMicroservices === permission);
      });
      setPermissionsToDelete(permissionToDelete);
    }

    if (hierarchyPermissionsData) {
      const permissionToDelete = hierarchyPermissionsData.filter(({ permission }) => {
        return !addedLowLevelPermissions.some((item) => item.nameForMicroservices === permission);
      });
      setPermissionsToDelete(permissionToDelete);
    }
  }, [
    addedLowLevelPermissions,
    objectPermissions,
    objectTypePermissions,
    hierarchyPermissionsData,
  ]);

  const not = (a: SecurityLowLevelRoles[], b: SecurityLowLevelRoles[]) => {
    return a.filter((value) => !b.some((item) => item.id === value.id));
  };

  const intersection = (a: SecurityLowLevelRoles[], b: SecurityLowLevelRoles[]) => {
    return a.filter((value) => b.some((item) => item.id === value.id));
  };

  const leftChecked = intersection(checked, allSecurityLowLevelRoles);
  const rightChecked = intersection(checked, addedLowLevelPermissions);

  const handleToggle = (value: SecurityLowLevelRoles) => () => {
    const currentIndex = checked.findIndex((item) => item.id === value.id);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setAddedLowLevelPermissions(addedLowLevelPermissions.concat(allSecurityLowLevelRoles));
    setAllSecurityLowLevelRoles([]);
  };

  const handleCheckedRight = () => {
    setAddedLowLevelPermissions(addedLowLevelPermissions.concat(leftChecked));
    setAllSecurityLowLevelRoles(not(allSecurityLowLevelRoles, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setAllSecurityLowLevelRoles(allSecurityLowLevelRoles.concat(rightChecked));
    setAddedLowLevelPermissions(not(addedLowLevelPermissions, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setAllSecurityLowLevelRoles(allSecurityLowLevelRoles.concat(addedLowLevelPermissions));
    setAddedLowLevelPermissions([]);
  };

  return (
    <SC.ObjectPermissionsStyled>
      {isObjectPermissionsFetching ||
        (isObjectTypePermissionsFetching && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        ))}
      {!isObjectPermissionsFetching && !isObjectTypePermissionsFetching && (
        <>
          <SC.TopGridStyled container spacing={2}>
            <SC.GridStyled item>
              <PermissionsList
                permissions={allSecurityLowLevelRoles}
                checked={checked}
                title={translate('All permissions')}
                handleToggle={handleToggle}
              />
            </SC.GridStyled>
            <SC.GridButtonsStyled item>
              <Grid container direction="column" alignItems="center">
                <SC.ButtonStyled
                  variant="outlined"
                  size="small"
                  onClick={handleAllRight}
                  disabled={allSecurityLowLevelRoles.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </SC.ButtonStyled>
                <SC.ButtonStyled
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </SC.ButtonStyled>
                <SC.ButtonStyled
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </SC.ButtonStyled>
                <SC.ButtonStyled
                  variant="outlined"
                  size="small"
                  onClick={handleAllLeft}
                  disabled={addedLowLevelPermissions.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </SC.ButtonStyled>
              </Grid>
            </SC.GridButtonsStyled>
            <SC.GridStyled item>
              <PermissionsList
                permissions={addedLowLevelPermissions}
                checked={checked}
                title={translate('Object permissions')}
                handleToggle={handleToggle}
              />
            </SC.GridStyled>
          </SC.TopGridStyled>
          <SC.ActionsButtonContent>
            <SC.ActionButton variant="contained" onClick={handleControlObjectPermission}>
              {translate('Save Permissions')}
            </SC.ActionButton>
            <SC.ActionButton variant="outlined" onClick={handleClose}>
              {translate('Close')}
            </SC.ActionButton>
          </SC.ActionsButtonContent>
        </>
      )}
    </SC.ObjectPermissionsStyled>
  );
};
