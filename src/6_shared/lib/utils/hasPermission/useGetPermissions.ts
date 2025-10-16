import { useConfig } from '6_shared/models';

export type ModuleNames =
  | 'processManager'
  | 'details'
  | 'map'
  | 'diagrams'
  | 'connectivityDiagram'
  | 'inventory'
  | 'dataFlow'
  | 'settings-graphs'
  | 'settings-objects'
  | 'settings-hierarchies'
  | 'templates';

export type ActionTypes = 'view' | 'update' | 'administrate';

export const useGetPermissions = (
  moduleName: ModuleNames | string,
  isFromAdmin?: boolean,
): Record<ActionTypes, boolean> => {
  const { userRoles } = useConfig();
  const module = () => {
    if (moduleName === 'objects') return 'settings-objects';
    if (moduleName === 'hierarchy') return 'settings-hierarchies';
    if (moduleName === 'graphs') return 'settings-graphs';
    return moduleName;
  };

  const actionTypes: ActionTypes[] = ['view', 'update', 'administrate'];

  if (isFromAdmin) {
    return {
      view: true,
      update: true,
      administrate: true,
    };
  }

  const permissions: Record<ActionTypes, boolean> = actionTypes.reduce((acc, actionType) => {
    const roleName = `Pages_${module()}_${actionType}`;
    const baseRoleName = `Pages_${module()}`;
    const roles = userRoles || [];

    if (actionType === 'view') {
      acc[actionType] =
        roles.includes(roleName) ||
        roles.includes(`Pages_${module()}_update`) ||
        roles.includes(`Pages_${module()}_administrate`) ||
        roles.includes(baseRoleName);
    } else if (actionType === 'update') {
      acc[actionType] =
        roles.includes(roleName) || roles.includes(`Pages_${module()}_administrate`);
    } else if (actionType === 'administrate') {
      acc[actionType] = roles.includes(roleName);
    }

    return acc;
  }, {} as Record<ActionTypes, boolean>);

  return permissions;
};
