import { Dispatch, useEffect } from 'react';
import { Box, FormControlLabel, TextField, Switch, Typography, Autocomplete } from '@mui/material';
import { TprmData, useColorsConfigure, useTranslate } from '6_shared';

interface IProps {
  tprms?: TprmData[] | TprmData;
  isOnlyPrivateColors: boolean;
  setIsOnlyPrivateColors: Dispatch<React.SetStateAction<boolean>>;
  selectedTab: string;
}

const allParamsOption = { id: 0, name: 'All Parameters', val_type: '' };

export const Header = ({
  tprms,
  isOnlyPrivateColors,
  setIsOnlyPrivateColors,
  selectedTab,
}: IProps) => {
  const translate = useTranslate();

  const { currentTprm, setCurrentTprm } = useColorsConfigure();

  const handleSelectTprm = (_: React.SyntheticEvent, value: TprmData | null) => {
    if (!Array.isArray(tprms) || !value) return;
    const selectedTprm = tprms?.find((tprm) => tprm.id === value.id);
    setCurrentTprm({ module: selectedTab, tprm: selectedTprm ?? undefined });
  };

  useEffect(() => {
    if (currentTprm?.[selectedTab]?.id) return;
    if (Array.isArray(tprms)) {
      // setCurrentTprm({ module: selectedTab, tprm: tprms?.[0] ?? undefined });
    } else {
      setCurrentTprm({ module: selectedTab, tprm: tprms ?? undefined });
    }
  }, [currentTprm, selectedTab, tprms]);

  return (
    <Box component="div" sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h2">{translate('Selecting a filter set')}</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isOnlyPrivateColors}
              onChange={() => setIsOnlyPrivateColors(!isOnlyPrivateColors)}
            />
          }
          label={translate('Show only the private filter sets')}
        />
      </Box>
      {tprms && !Array.isArray(tprms) && <TextField variant="outlined" value={tprms.name} />}
      {tprms && Array.isArray(tprms) && (
        <Autocomplete
          options={[allParamsOption, ...tprms]}
          getOptionLabel={(option) => option.name}
          disablePortal
          disableClearable
          sx={{ width: '30%' }}
          includeInputInList
          value={currentTprm?.[selectedTab] || allParamsOption}
          onChange={handleSelectTprm}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
      )}
    </Box>
  );
};
