import { MutableRefObject } from 'react';
import { Typography } from '@mui/material';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { ActionTypes, ITableColumnSettingsModel, useTranslate } from '6_shared';
import { HistoryTableToolbar } from '../historyTableToolbar/HistoryTableToolbar';
import * as SC from './HistoryTableHeader.styled';

interface IProps {
  tableApiRef: MutableRefObject<GridApiPremium>;
  setHistorySearchValue: (value: string) => void;
  defaultColumnsSettings: ITableColumnSettingsModel | undefined;
  permissions?: Record<ActionTypes, boolean>;
}

export const HistoryTableHeader = ({
  tableApiRef,
  setHistorySearchValue,
  defaultColumnsSettings,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  return (
    <SC.HistoryTableHeaderStyled>
      <Typography variant="h3">{translate('Objects history')}</Typography>

      <HistoryTableToolbar
        tableApiRef={tableApiRef}
        setHistorySearchValue={setHistorySearchValue}
        defaultColumnsSettings={defaultColumnsSettings}
        permissions={permissions}
      />
    </SC.HistoryTableHeaderStyled>
  );
};
