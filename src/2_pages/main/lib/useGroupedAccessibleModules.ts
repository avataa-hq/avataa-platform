import { useMemo } from 'react';

import { IModule } from '6_shared';
import { useMainModules } from '../../../config/mainModulesConfig';

export const useGroupedAccessibleModules = () => {
  const { mainModulesList } = useMainModules();

  return useMemo(
    () =>
      mainModulesList
        ?.filter((appModule) => appModule.isAccessible && !appModule.isHidden && !appModule.isGroup)
        .reduce((accumulator, appModule, index) => {
          if (index % 6 === 0) return [...accumulator, [appModule]];

          return [
            ...accumulator.slice(0, accumulator.length - 1),
            [...accumulator[accumulator.length - 1], appModule],
          ];
        }, [] as IModule[][]),
    [mainModulesList],
  );
};
