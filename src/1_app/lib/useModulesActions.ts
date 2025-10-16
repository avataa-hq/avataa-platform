import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IModule, useAppNavigate, useTabs } from '6_shared';

interface IProps<ModuleId extends string> {
  defaultModule: string;
  modules: IModule<ModuleId>[];
}

export const useModulesActions = <ModuleId extends string = string>({
  defaultModule,
  modules,
}: IProps<ModuleId>) => {
  const { setActiveTabs, setSelectedTab } = useTabs();

  const [activeModuleTab, setActiveModuleTab] = useState<string>(defaultModule);
  const [activeModuleGroupTab, setActiveModuleGroupTab] = useState('');
  // const [tabsModulesConfig, setTabsModulesConfig] = useState<IModule<ModuleId>[]>([modules[0]]);
  const [tabsModulesConfig, setTabsModulesConfig] = useState<IModule<ModuleId>[]>([]);

  useEffect(() => {
    setTabsModulesConfig([modules[0]]);
  }, [modules]);

  useEffect(() => {
    setActiveTabs(tabsModulesConfig.map((m) => m.id));
  }, [tabsModulesConfig]);

  useEffect(() => {
    setSelectedTab(activeModuleTab);
  }, [activeModuleTab]);

  const locationModule = useLocation().pathname.split('/')[1];

  useEffect(() => {
    if (locationModule) {
      setActiveModuleTab(locationModule);
      const neededModule = modules.find((moduleItem) => moduleItem.id === locationModule);
      if (!neededModule) return;

      if (neededModule.parentId) setActiveModuleGroupTab(neededModule.parentId);

      setTabsModulesConfig((modulesTabs) => {
        const modulesId = modulesTabs.map((m) => m.id);

        if (modulesId.includes(neededModule.id)) return modulesTabs;
        if (neededModule.isGroup) return modulesTabs;

        return [...modulesTabs, neededModule];
      });
    }
  }, [locationModule, modules]);

  const navigate = useAppNavigate();

  const addModuleToActiveAndModuleList = (module: string) => {
    const neededModule = modules.find((moduleItem) => moduleItem.id === module);

    if (!neededModule) return;

    const { isGroup, parentId, id } = neededModule;

    if (isGroup) {
      if (activeModuleGroupTab === id) setActiveModuleGroupTab('');
      else setActiveModuleGroupTab(id);
    } else if (parentId) setActiveModuleGroupTab(parentId);
    else setActiveModuleGroupTab('');

    if (!isGroup) navigate(id);

    setTabsModulesConfig((modulesTabs) => {
      const modulesId = modulesTabs.map((m) => m.id);

      if (modulesId.includes(neededModule.id)) return modulesTabs;
      if (neededModule.isGroup) return modulesTabs;

      return [...modulesTabs, neededModule];
    });
  };
  const onSidebarModuleItemClick = (module: string) => {
    addModuleToActiveAndModuleList(module);
  };
  const onLogoClick = (module: string) => {
    addModuleToActiveAndModuleList(module);
  };

  const onModuleTabClose = (moduleTab: IModule) => {
    let prevModule = defaultModule;
    let prevParentId: string | undefined;

    setTabsModulesConfig((modulesTabs) =>
      modulesTabs.filter((module, idx) => {
        if (module.id === moduleTab.id) {
          if (modulesTabs[idx - 1]) {
            prevModule = tabsModulesConfig[idx - 1].id;
            prevParentId = tabsModulesConfig[idx - 1].parentId;
          } else if (modulesTabs[idx + 1]) {
            prevModule = tabsModulesConfig[idx + 1].id;
            prevParentId = tabsModulesConfig[idx + 1].parentId;
          }
        }
        return module.id !== moduleTab.id;
      }),
    );

    if (activeModuleTab === moduleTab.id) navigate(prevModule);

    if (!prevParentId) setActiveModuleGroupTab('');
    else setActiveModuleGroupTab(prevParentId);
  };

  const onModuleTabChange = (moduleTab: IModule) => {
    navigate(moduleTab.id);

    if (!moduleTab.parentId) setActiveModuleGroupTab('');
    else setActiveModuleGroupTab(moduleTab.parentId);
  };

  return {
    activeModuleTab,
    activeModuleGroupTab,
    tabsModulesConfig,
    onSidebarModuleItemClick,
    onLogoClick,
    onModuleTabClose,
    onModuleTabChange,
  };
};
