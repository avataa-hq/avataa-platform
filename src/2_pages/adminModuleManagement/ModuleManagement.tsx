import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { MyModal } from 'components/_reused components';
import { SimplePage, handleApiAction, modulesApi, keycloakRolesApi, useTranslate } from '6_shared';

// import { usePropertyLabels } from 'components/moduleAccessibilityComponent/propertyLabels';
import { ModuleManagementTable } from './ModuleManagementTable';
import { ModalStyled } from './ModuleManagement.styled';

type ButtonVariant = 'contained' | 'text' | 'outlined';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';

export interface ModuleSettings {
  [key: string]: { defaultName: string; customName: string; accessibility: boolean };
}

export const ModuleManagement = () => {
  const { useGetAllModulesQuery, usePatchAllModulesMutation } = modulesApi;
  const { useCreateRoleMutation, useDeleteRoleMutation, useGetRolesQuery } = keycloakRolesApi;

  const translate = useTranslate();
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({});
  const [moduleSettingsUnchanged, setModuleSettingsUnchanged] = useState<ModuleSettings>({});
  const [editRow, setEditRow] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const { data: moduleNames } = useGetAllModulesQuery();

  const { data: roles } = useGetRolesQuery({
    briefRepresentation: false,
    search: 'Pages_',
  });

  const [patchModules] = usePatchAllModulesMutation();
  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  // const propertyLabelsRef = useRef(usePropertyLabels());

  useEffect(() => {
    if (!roles || !moduleNames) return;

    const newSettings: ModuleSettings = {};

    Object.keys(moduleNames).forEach((moduleName) => {
      const accessRole = roles.find(
        (role) =>
          role.name?.split('_')?.[1]?.toLocaleLowerCase() === moduleName.toLocaleLowerCase(),
      );

      newSettings[moduleName] = {
        accessibility: !!accessRole,
        defaultName: moduleName,
        customName: moduleNames[moduleName],
        // defaultName: moduleNames[moduleName],
        // customName: (moduleNames as Record<string, string>)[moduleNames[moduleName]],
      };
    });

    setModuleSettings(newSettings);
    setModuleSettingsUnchanged(newSettings);
  }, [roles, moduleNames]);

  // useEffect(() => {
  //   const propertyLabels = propertyLabelsRef.current;

  //   if (!propertyLabels || !roles || !moduleNames) return;
  //   const filteredPropertyLabels = Object.fromEntries(
  //     Object.entries(propertyLabels).filter(
  //       ([, value]) => value && value.defaultName in moduleNames,
  //     ),
  //   );

  //   const newSettings: ModuleSettings = {};

  //   Object.keys(filteredPropertyLabels).forEach((key) => {
  //     const accessRole = roles.find(
  //       (role) =>
  //         role.name === key &&
  //         Object.keys(moduleNames).includes(filteredPropertyLabels[key].defaultName),
  //     );

  //     newSettings[key] = {
  //       accessibility: !!accessRole,
  //       defaultName: filteredPropertyLabels[key].defaultName,
  //       customName: (moduleNames as Record<string, string>)[
  //         filteredPropertyLabels[key].defaultName
  //       ],
  //     };
  //   });

  //   setModuleSettings(newSettings);
  //   setModuleSettingsUnchanged(newSettings);
  // }, [roles, moduleNames]);

  const processRoles = async (toAdd: string[], toDelete: string[]) => {
    await Promise.all(
      toAdd.map(async (key) => {
        const name = key;
        await handleApiAction(
          () => createRole({ name }).unwrap(),
          `Role ${name} added successfully`,
        );
      }),
    );

    await Promise.all(
      toDelete.map(async (key) => {
        const roleName = key;
        await handleApiAction(
          () => deleteRole(roleName).unwrap(),
          `Role ${roleName} deleted successfully`,
        );
      }),
    );
  };

  const areObjectsEqual = (obj1: { [key: string]: string }, obj2: { [key: string]: string }) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    let areEqual = true;

    keys1.forEach((key) => {
      if (obj1[key] !== obj2[key]) {
        areEqual = false;
      }
    });

    return areEqual;
  };

  const handleManageRoleAccessibility = async () => {
    const toDelete: string[] = [];
    const toAdd: string[] = [];

    Object.keys(moduleSettings).forEach((key) => {
      const { accessibility } = moduleSettings[key];
      const unchangedAccessibility = moduleSettingsUnchanged[key]?.accessibility;

      if (accessibility && !unchangedAccessibility) {
        toAdd.push(key);
      } else if (!accessibility && unchangedAccessibility) {
        toDelete.push(key);
      }
    });

    processRoles(toAdd, toDelete);
  };

  const handleManageRoleNames = async () => {
    const roleNamesObject: { [key: string]: string } = {};
    const roleNamesObjectUnchanged: { [key: string]: string } = {};

    Object.keys(moduleSettings).forEach((key) => {
      const { defaultName, customName } = moduleSettings[key];
      roleNamesObject[defaultName] = customName;
    });

    Object.keys(moduleSettingsUnchanged).forEach((key) => {
      const { defaultName, customName } = moduleSettingsUnchanged[key];
      roleNamesObjectUnchanged[defaultName] = customName;
    });

    if (!areObjectsEqual(roleNamesObject, roleNamesObjectUnchanged)) {
      await handleApiAction(
        () => patchModules(roleNamesObject).unwrap(),
        'Modules renamed successfully',
      );
    }
  };

  const handleApplyChanges = () => {
    setEditRow(null);

    handleManageRoleNames();
    handleManageRoleAccessibility();
  };

  const handleRevertChanges = () => {
    setEditRow(null);
    setModuleSettings(moduleSettingsUnchanged);
  };

  const buttons = [
    {
      label: 'Revert all changes',
      variant: 'contained' as ButtonVariant,
      size: 'medium' as ButtonSize,
      color: 'warning' as ButtonColor,
      onClick: handleRevertChanges,
    },
    {
      label: 'Apply changes',
      variant: 'contained' as ButtonVariant,
      size: 'small' as ButtonSize,
      color: 'primary' as ButtonColor,
      onClick: handleApplyChanges,
    },
  ];

  return (
    <SimplePage
      title={translate('Module Management for the current installation')}
      actions={buttons?.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.variant}
          color={button.color}
          size="small"
        >
          {translate(button.label as any)}
        </Button>
      ))}
    >
      <ModuleManagementTable
        moduleSettings={moduleSettings}
        setModuleSettings={setModuleSettings}
        editRow={editRow}
        setEditRow={setEditRow}
      />

      <MyModal
        size="small"
        open={showCompletionModal}
        handleClose={() => setShowCompletionModal(false)}
      >
        <ModalStyled>Module names successfully updated</ModalStyled>
      </MyModal>

      <MyModal size="small" open={showErrorModal} handleClose={() => setShowErrorModal(false)}>
        <ModalStyled>Something went wrong, please try again!</ModalStyled>
      </MyModal>
    </SimplePage>
  );
};
