import { useEffect, useState } from 'react';
import { ClickhouseSettings, Modal, useColorsConfigure, useTabs, useTranslate } from '6_shared';
import { TablesResponseType } from '6_shared/api/clickhouse/types';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import { SelectChangeEvent } from '@mui/material/Select';
import { GRANULARITY_OPTIONS } from '6_shared/api/clickhouse/constants';
import { EvenstHeaderStyled } from './Events.styled';
import { StressFormulaBuilder } from '../stressFormulaBuilder';

interface Iprops {
  clickHouseTableData: TablesResponseType | null;
  clickHouseTable: { name: string };
  setClickHouseTable: React.Dispatch<React.SetStateAction<{ name: string }>>;
  сlickhouseTableColumnsData: TablesResponseType | null;
  clickhouseSettings: any;
  setClickhouseConfig: React.Dispatch<React.SetStateAction<ClickhouseSettings | undefined>>;
}

export const EventsHeader = ({
  clickHouseTableData,
  clickHouseTable,
  setClickHouseTable,
  сlickhouseTableColumnsData,
  clickhouseSettings,
  setClickhouseConfig,
}: Iprops) => {
  const translate = useTranslate();

  const [clickHouseTableName, setClickHouseTableName] = useState('');
  const [dateTimeColumn, setDateTimeColumn] = useState('');
  const [objectKeyColumn, setObjectKeyColumn] = useState('');
  const [granularity, setGranularity] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toggleIsOpenColorSelecting } = useColorsConfigure();
  const { selectedAdminTab } = useTabs();

  useEffect(() => {
    if (!сlickhouseTableColumnsData || !сlickhouseTableColumnsData.length) return;

    if (!dateTimeColumn) setDateTimeColumn(clickhouseSettings.datetime_column);
    if (!objectKeyColumn) setObjectKeyColumn(clickhouseSettings.object_key);
    if (!granularity) setGranularity(clickhouseSettings.granularity);
  }, [сlickhouseTableColumnsData, clickhouseSettings]);

  useEffect(() => {
    setClickHouseTableName(clickhouseSettings.table_name);
  }, []);

  const onClickHouseChange = (event: SelectChangeEvent<string>) => {
    setClickHouseTable({ name: event.target.value });
    setClickHouseTableName(event.target.value);
  };

  const onDateTimeColumnChange = (event: SelectChangeEvent<string>) => {
    setDateTimeColumn(event.target.value);
  };

  const onObjectKeyColumnChange = (event: SelectChangeEvent<string>) => {
    setObjectKeyColumn(event.target.value);
  };

  const onGranularityChange = (newGranularity: string) => {
    setGranularity(newGranularity);
  };

  useEffect(() => {
    // @ts-ignore
    setClickhouseConfig((prevConfig) => {
      return {
        ...prevConfig,
        table_name: clickHouseTableName,
        datetime_column: dateTimeColumn,
        object_key: objectKeyColumn,
        granularity,
      };
    });
  }, [clickHouseTableName, dateTimeColumn, objectKeyColumn, granularity]);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <EvenstHeaderStyled>
      <FormControl variant="outlined" fullWidth>
        <Typography sx={{ marginBottom: '10px' }}>{translate('ClickHouse table')}</Typography>
        <Select value={clickHouseTable.name} onChange={onClickHouseChange} displayEmpty>
          {clickHouseTableData ? (
            clickHouseTableData.map((table, index) => (
              <MenuItem key={index} value={table.name}>
                {table.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No tables available</MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <Typography sx={{ marginBottom: '10px' }}>{translate('DateTime column')}</Typography>
        <Select value={dateTimeColumn} onChange={onDateTimeColumnChange} displayEmpty>
          {сlickhouseTableColumnsData ? (
            сlickhouseTableColumnsData.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No tables available</MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <Typography sx={{ marginBottom: '10px' }}>{translate('Object key column')}</Typography>
        <Select value={objectKeyColumn} onChange={onObjectKeyColumnChange} displayEmpty>
          {сlickhouseTableColumnsData ? (
            сlickhouseTableColumnsData.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No tables available</MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <Typography sx={{ marginBottom: '10px' }}>{translate('Granularity')}</Typography>
        <Select
          value={granularity}
          onChange={(e) => onGranularityChange(e.target.value)}
          displayEmpty
        >
          {GRANULARITY_OPTIONS.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title={translate('SQL Query for stress level calculation')}>
        <IconButton sx={{ width: '40px', height: '40px' }} onClick={handleDialogOpen}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={translate('Palette settings for current TMO stress')}>
        <IconButton
          sx={{ width: '40px', height: '40px' }}
          onClick={() => toggleIsOpenColorSelecting({ module: selectedAdminTab })}
        >
          <TableChartIcon />
        </IconButton>
      </Tooltip>

      <Modal open={isDialogOpen} onClose={handleDialogClose} width="80%">
        <StressFormulaBuilder />
        <DialogActions>
          <Button disabled color="primary">
            {translate('Save')}
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            {translate('Close')}
          </Button>
        </DialogActions>
      </Modal>
    </EvenstHeaderStyled>
  );
};
