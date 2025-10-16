import { useEffect, useState } from 'react';
import { useLeftSidebar, useSidebar, useTabs } from '6_shared';
import { handleMaxDrawerWidth } from './handleMaxDrawerWidth';

export const useRightPanelMaxWidth = () => {
  const [drawerMaxWidth, setDrawerMaxWidth] = useState<number>(0);

  const { isOpen: isSideBarOpen } = useSidebar();
  const { selectedTab } = useTabs();
  const { isLeftSidebarOpen } = useLeftSidebar();

  useEffect(() => {
    setDrawerMaxWidth(
      handleMaxDrawerWidth({
        selectedTab,
        isSideBarOpen,
        isLeftSidebarOpen,
      }) / 2,
    );
  }, [isLeftSidebarOpen, isSideBarOpen, selectedTab]);

  return { drawerMaxWidth };
};
