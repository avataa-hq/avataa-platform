import { useHierarchy, useInventory, useLeftPanelWidget, useTabs } from '6_shared';
import { useEffect } from 'react';

export const useGetTmoId = () => {
  const { setTmoId } = useInventory();
  const { selectedObjectTypeItem, hierarchyTmoId } = useHierarchy();

  const { selectedTabs } = useLeftPanelWidget();
  const { selectedTab: activePage } = useTabs();

  useEffect(() => {
    if (
      selectedTabs[activePage] === 'objectTypes' &&
      selectedObjectTypeItem &&
      selectedObjectTypeItem.id
    ) {
      setTmoId(selectedObjectTypeItem.id);
    }

    if (selectedTabs[activePage] === 'topology' && hierarchyTmoId) {
      setTmoId(hierarchyTmoId);
    }
  }, [selectedTabs, selectedObjectTypeItem, activePage, hierarchyTmoId]);
};
