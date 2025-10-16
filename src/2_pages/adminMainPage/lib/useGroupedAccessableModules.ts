import { IModule } from '6_shared';
import { useAdminModules } from 'config/adminModulesConfig';
import { useMemo } from 'react';

// import { IContentList, useContentList } from 'shared/lib';

export const useGroupedAccessableModules = () => {
  // const { adminContentList } = useContentList();
  const { adminModulesList } = useAdminModules();

  return useMemo(
    () =>
      adminModulesList
        ?.filter((appModule) => appModule.isAccessible && !appModule.isHidden && !appModule.isGroup)
        // ?.filter((appModule) =>
        // appModule.isAccessable &&
        // ['adminUsers', 'modules', 'environment'].includes(appModule.id),
        // )
        .reduce((accumulator, appModule, index) => {
          if (index % 6 === 0) return [...accumulator, [appModule]];

          return [
            ...accumulator.slice(0, accumulator.length - 1),
            [...accumulator[accumulator.length - 1], appModule],
          ];
        }, [] as IModule[][]),
    [adminModulesList],
  );
};
