import { TabPanel } from '@mui/lab';
import { Outlet } from 'react-router';
import { IModule } from '../../../types';
import { TABS_PANEL_HEIGHT } from '../../../constants';

interface ITabsContentProps<ModuleId extends string> {
  modules?: IModule<ModuleId>[];
}

export const TabsContent = <ModuleId extends string>({ modules }: ITabsContentProps<ModuleId>) => {
  return modules?.map((tab) => (
    <TabPanel
      // keepMounted={tab.keepMounted}
      style={{
        position: 'relative',
        height: `calc(98% - ${TABS_PANEL_HEIGHT}px)`,
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
      key={tab.id}
      value={tab.id}
    >
      <Outlet />
    </TabPanel>
  ));
};
