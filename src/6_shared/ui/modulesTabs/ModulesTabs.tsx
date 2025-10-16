import { TabContext } from '@mui/lab';
import { ReactNode } from 'react';
import { TabsPanel } from './tabsPanel/TabsPanel';
import { IModule } from '../../types';
import { TabsContent } from './tabsContent/TabsContent';

interface IProps<ModuleId extends string> {
  modules: IModule<ModuleId>[];
  activeModuleTab: string;
  setActiveModuleTab: (moduleTab: IModule<ModuleId>) => void;

  tabsRightSlot?: ReactNode;

  onTabClose?: (moduleTab: IModule<ModuleId>) => void;
}

export const ModulesTabs = <ModuleId extends string>({
  modules,
  activeModuleTab,
  setActiveModuleTab,
  onTabClose,
  tabsRightSlot,
}: IProps<ModuleId>) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
      }}
    >
      <TabContext value={activeModuleTab}>
        <TabsPanel
          modules={modules}
          setActiveTab={setActiveModuleTab}
          onCloseTab={onTabClose}
          rightSlot={tabsRightSlot}
        />
        <TabsContent modules={modules} />
      </TabContext>
    </div>
  );
};
