import { MutableRefObject, useEffect } from 'react';
import ViewWeekOutlined from '@mui/icons-material/ViewWeekOutlined';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { Search, ActionTypes, ITableColumnSettingsModel } from '6_shared';
import * as SC from './HistoryTableToolbar.styled';

interface IInfoSearchDownloadProps {
  tableApiRef: MutableRefObject<GridApiPremium>;
  setHistorySearchValue: (value: string) => void;
  defaultColumnsSettings: ITableColumnSettingsModel | undefined;
  permissions?: Record<ActionTypes, boolean>;
}

export const HistoryTableToolbar = ({
  tableApiRef,
  setHistorySearchValue,
  defaultColumnsSettings,
  permissions,
}: IInfoSearchDownloadProps) => {
  useEffect(() => {
    const applyColumnSettings = () => {
      if (tableApiRef.current && defaultColumnsSettings?.value?.tableInitialState) {
        const { tableInitialState } = defaultColumnsSettings.value;
        const { columns } = tableInitialState;
        if (!columns) return;
        const { columnVisibilityModel } = columns;
        if (!columnVisibilityModel) return;
        tableApiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      }
    };

    applyColumnSettings();
  }, [tableApiRef, defaultColumnsSettings]);

  const onSearchClick = (value: string) => {
    setHistorySearchValue(value.trim().toLowerCase());
  };

  const onCancelClick = () => {
    setHistorySearchValue('');
  };

  const openColumnSettings = () => {
    const settingsPmButton = document.getElementById('processManager-custom-columns-btn');
    const settingsInventoryButton = document.getElementById('inventory-custom-columns-btn');

    if (settingsInventoryButton) settingsInventoryButton.click();
    if (settingsPmButton) settingsPmButton.click();
  };

  return (
    <SC.Container>
      <SC.CustomButton variant="outlined" onClick={openColumnSettings}>
        <ViewWeekOutlined fontSize="small" />
      </SC.CustomButton>

      <Search
        searchValue=""
        onSearchClick={(value) => onSearchClick(value)}
        onCancelClick={onCancelClick}
      />
    </SC.Container>
  );
};
