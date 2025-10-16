import { useCallback, useEffect, useRef, useState } from 'react';
import { tableColumnSettingsApi, useTabs } from '6_shared';

interface IProps {
  objectTypeId?: number;
  drawerWidth: number;
  handleDrawerWidth?(width: number): void;
}

export const usePanelWidthFromSettings = ({
  objectTypeId,
  drawerWidth,
  handleDrawerWidth,
}: IProps) => {
  const { useUpdateSettingByIdMutation, useGetDefaultSettingsByTmoQuery } = tableColumnSettingsApi;

  const drawerWidthFromSettings = useRef(0);

  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const { selectedTab } = useTabs();

  const [updateColumnsSetting] = useUpdateSettingByIdMutation();

  const { data: defaultColumnsSettings } = useGetDefaultSettingsByTmoQuery(objectTypeId ?? 0, {
    skip: !objectTypeId,
  });

  useEffect(() => {
    if (
      !defaultColumnsSettings ||
      Object.keys(defaultColumnsSettings).length === 0 ||
      selectedTab === 'diagrams' ||
      selectedTab === 'map'
    )
      return;

    if (
      defaultColumnsSettings.value?.rightPanelWidth &&
      drawerWidthFromSettings.current !== defaultColumnsSettings.value.rightPanelWidth
    ) {
      handleDrawerWidth?.(defaultColumnsSettings.value.rightPanelWidth);
      drawerWidthFromSettings.current = defaultColumnsSettings.value.rightPanelWidth;
    }
  }, [defaultColumnsSettings]);

  const externalMouseup = useCallback(async () => {
    if (
      isRequestInProgress ||
      !defaultColumnsSettings ||
      Object.keys(defaultColumnsSettings).length === 0 ||
      selectedTab === 'diagrams' ||
      selectedTab === 'map'
    ) {
      return;
    }

    if (drawerWidthFromSettings.current !== drawerWidth) {
      setIsRequestInProgress(true);

      try {
        const body = {
          ...defaultColumnsSettings,
          value: {
            ...defaultColumnsSettings.value,
            rightPanelWidth: drawerWidth,
          },
        };

        drawerWidthFromSettings.current = drawerWidth;
        await updateColumnsSetting({ id: defaultColumnsSettings.id, body }).unwrap();
      } catch (error) {
        console.error('Error updating column settings:', error);
      } finally {
        setIsRequestInProgress(false);
      }
    }
  }, [defaultColumnsSettings, isRequestInProgress, drawerWidth, selectedTab, updateColumnsSetting]);

  return { externalMouseup };
};
