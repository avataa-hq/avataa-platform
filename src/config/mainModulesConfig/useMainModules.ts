import { useMemo } from 'react';
import { useConfig, useGetAllModules } from '6_shared';
import { mainModulesConfig } from './mainModulesConfig';

export const useMainModules = () => {
  const { userRoles } = useConfig();

  const { data: modulesData } = useGetAllModules();

  const groupedUserRoles = useMemo(() => {
    return (userRoles ?? []).reduce((acc, item) => {
      if (item.startsWith('Pages_')) {
        const moduleId = item.split('_')[1]?.toLowerCase();
        acc[moduleId] = item;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [userRoles]);

  const mainModulesList = useMemo(() => {
    if (!modulesData) return mainModulesConfig;
    return mainModulesConfig.map((module) => {
      let isAccessible = false;

      if (module.isGroup) {
        isAccessible = mainModulesConfig.some(
          (m) => m.parentId === module.id && !!groupedUserRoles[m.role.toLowerCase()],
        );
      } else {
        isAccessible = !!groupedUserRoles[module.role.toLowerCase()];
      }

      return {
        ...module,
        label: modulesData[module.label] ?? module.label,
        isAccessible,
      };
    });
  }, [groupedUserRoles, modulesData]);

  return { mainModulesList };
};
