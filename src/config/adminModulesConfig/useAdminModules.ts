import { useMemo } from 'react';
// import { useConfig } from '6_shared';
import { adminModulesConfig } from './adminModulesConfig';

export const useAdminModules = () => {
  // const { userRoles } = useConfig();

  // const groupedUserRoles = useMemo(() => {
  //   return (userRoles ?? []).reduce((acc, item) => {
  //     if (item.startsWith('Pages_')) {
  //       const moduleId = item.split('_')[1];
  //       acc[moduleId] = item;
  //     }
  //     return acc;
  //   }, {} as Record<string, string>);
  // }, [userRoles]);

  const adminModulesList = useMemo(() => {
    return adminModulesConfig.map((module) => {
      return { ...module, isAccessible: true };
      // return { ...module, isAccessible: module.isGroup ? true : !!groupedUserRoles[module.role] };
    });
  }, []);

  return { adminModulesList };
};
