import { useMemo } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Collapse } from '@mui/material';
import { ModuleListItem } from './moduleListItem/ModuleListItem';
import { IModule } from '../../types';

interface IProps<ModuleId extends string> {
  isOpen?: boolean;
  modules: IModule<ModuleId>[];
  onItemClick?: (moduleID: string) => void;
  activeModule?: string;
  activeModuleGroupTab?: string;
}

export const ModulesList = <ModuleId extends string>({
  isOpen,
  modules,
  onItemClick,
  activeModule,
  activeModuleGroupTab,
}: IProps<ModuleId>) => {
  const correctModuleLists = useMemo(() => {
    const parentModules = modules?.filter((item) => !item.parentId);
    if (activeModuleGroupTab) {
      const childModulesId =
        modules?.flatMap((item) => (item.parentId === activeModuleGroupTab ? item : [])) ?? [];
      const parentPosition = parentModules?.findIndex((item) => item.id === activeModuleGroupTab);

      if (parentPosition && parentModules) {
        parentModules.splice(parentPosition + 1, 0, ...childModulesId);
      }
    }

    return parentModules ?? [];
  }, [activeModuleGroupTab, modules]);

  return (
    <div
      aria-label="modules-list"
      style={{ display: 'flex', flexDirection: 'column', gap: '1%', height: '100%' }}
    >
      <TransitionGroup style={{ width: '100%' }}>
        {correctModuleLists.map((module) => {
          if (module.isHidden || !module.isAccessible) return null;

          const isSelected = activeModule === module.id || activeModuleGroupTab === module.id;

          return (
            <Collapse key={module.id} data-testid={`module-list-collapse__${module.id}`}>
              <ModuleListItem
                isOpen={isOpen}
                icon={module.content?.icon}
                title={module.label}
                onClick={() => onItemClick?.(module.id)}
                selected={isSelected}
                isChild={!!module.parentId}
                isGroup={module.isGroup}
              />
            </Collapse>
          );
        })}
      </TransitionGroup>
    </div>
  );
};
