import { useEffect } from 'react';
import { Box, ClickhouseObjectSettings, useTranslate } from '6_shared';
import { TablesResponseType } from '6_shared/api/clickhouse/types';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { EvenstHeaderStyled } from './Events.styled';

interface Iprops {
  clickHouseTableData: TablesResponseType | null;
  clickObjectCfg?: ClickhouseObjectSettings;
  setClickObjectCfg: React.Dispatch<React.SetStateAction<ClickhouseObjectSettings | undefined>>;
  сlickhouseTableColumnsData: TablesResponseType | null;
  clickhouseSettings: any;
}

export const ExternalLevel = ({
  clickHouseTableData,
  сlickhouseTableColumnsData,
  clickhouseSettings,
  setClickObjectCfg,
  clickObjectCfg,
}: Iprops) => {
  const translate = useTranslate();

  useEffect(() => {
    if (!Object.entries(clickhouseSettings).length) return;
    setClickObjectCfg(clickhouseSettings);
  }, [clickhouseSettings, setClickObjectCfg]);

  const onValueChange = (event: SelectChangeEvent<string>, type: 'table' | 'object' | 'parent') => {
    const newValue = event.target.value;

    setClickObjectCfg((prev) => {
      const defaultConfig: ClickhouseObjectSettings = {
        table_name: '',
        object_key: '',
        parent_key: '',
      };

      const currentConfig = prev ?? defaultConfig;

      switch (type) {
        case 'table':
          return { ...currentConfig, table_name: newValue };
        case 'object':
          return { ...currentConfig, object_key: newValue };
        case 'parent':
          return { ...currentConfig, parent_key: newValue };
        default:
          return currentConfig;
      }
    });
  };

  return (
    <>
      <EvenstHeaderStyled>
        <FormControl variant="outlined" fullWidth>
          <Typography sx={{ marginBottom: '10px' }}>{translate('Object table')}</Typography>
          <Select
            value={clickObjectCfg?.table_name ?? ''}
            onChange={(e) => onValueChange(e, 'table')}
          >
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
          <Typography sx={{ marginBottom: '10px' }}>{translate('Object column')}</Typography>
          <Select
            value={clickObjectCfg?.object_key ?? ''}
            onChange={(e) => onValueChange(e, 'object')}
          >
            {сlickhouseTableColumnsData?.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <Typography sx={{ marginBottom: '10px' }}>{translate('Parent column')}</Typography>
          <Select
            value={clickObjectCfg?.parent_key ?? ''}
            onChange={(e) => onValueChange(e, 'parent')}
          >
            {сlickhouseTableColumnsData?.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </EvenstHeaderStyled>
      <Box component="div" padding={1} />
    </>
  );
};
