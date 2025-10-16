import { useCallback, useMemo } from 'react';
import {
  Autocomplete,
  Box,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { PaletteSettings, useColorsConfigure, useTabs, useTranslate } from '6_shared';

import { type PaletteData } from '../../ColorSettings';

interface IProps {
  paletteData: PaletteData;
  handleChangeName: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updatePalette: (updateFn: (prev: PaletteSettings) => PaletteSettings) => void;
  valType: string | undefined;
  isSeverity: boolean;
  isParamType: boolean;
  isLineWithWidth?: boolean;
}

type AutocompleteOptions = { label: string; value: string } | null;

export const Header = ({
  paletteData,
  handleChangeName,
  updatePalette,
  valType,
  isSeverity,
  isParamType,
  isLineWithWidth,
}: IProps) => {
  const translate = useTranslate();

  const { isEditPalette, currentTmoType } = useColorsConfigure();
  const { selectedTab } = useTabs();

  const options = useMemo(() => {
    return [
      { label: 'General', value: 'General' },
      ...(valType === 'number' ? [{ label: 'Percent', value: 'Percent' }] : []),
      ...(valType === 'string' && isParamType ? [{ label: 'Hex', value: 'Hex' }] : []),
      ...(isLineWithWidth && currentTmoType[selectedTab] === 'line'
        ? [{ label: 'Line', value: 'Line' }]
        : []),
    ];
  }, [valType, isParamType, isLineWithWidth, currentTmoType, selectedTab]);

  const selectedValue = useMemo(() => {
    return currentTmoType[selectedTab] === 'line'
      ? { label: 'Line', value: 'Line' }
      : { label: 'General', value: 'General' };
  }, [currentTmoType, selectedTab]);

  const handleChange = useCallback(
    (_: any, newValue: AutocompleteOptions | null) => {
      if (newValue) {
        updatePalette((prev) => ({
          ...prev,
          value_type: newValue.value,
        }));
      }
    },
    [updatePalette],
  );

  return (
    <>
      <Typography variant="h2">
        {isEditPalette[selectedTab] ? `${translate('Edit')}` : `${translate('Create')}`}{' '}
        {translate('color set')}
      </Typography>
      <Box component="div" sx={{ width: '100%' }}>
        <Box component="div" display="flex" flexDirection="column">
          <Typography>{translate('Name')}</Typography>
          <TextField
            name="nameSet"
            onChange={(event) => handleChangeName(event)}
            value={paletteData?.palette?.name}
            sx={{ width: '300px' }}
            error={paletteData?.isError?.name}
            helperText={paletteData?.helperText?.name}
          />
        </Box>
        {isSeverity && (
          <Box component="div" display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={paletteData?.palette?.withCleared ?? false}
                  onChange={() =>
                    updatePalette((prev) => ({
                      ...prev,
                      withCleared: !prev?.withCleared,
                    }))
                  }
                />
              }
              label="Include the Cleared processes"
              sx={{ width: '33%' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={paletteData?.palette?.withIndeterminate}
                  onChange={() =>
                    updatePalette((prev) => ({
                      ...prev,
                      withIndeterminate: !prev?.withIndeterminate,
                    }))
                  }
                />
              }
              label="Include the Indeterminate processes"
              sx={{ width: '33%' }}
            />
            <Box component="div" sx={{ width: '33%' }}>
              <Select
                value={paletteData?.palette?.direction ?? 'desc'}
                onChange={(event: SelectChangeEvent) => {
                  updatePalette((prev) => ({
                    ...prev,
                    direction: event.target.value as 'asc' | 'desc',
                  }));
                }}
              >
                <MenuItem value="asc">Ascending severity direction</MenuItem>
                <MenuItem value="desc">Descending severity direction</MenuItem>
              </Select>
            </Box>
          </Box>
        )}
      </Box>
      <Box component="div" display="flex" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={!paletteData?.palette?.public}
              onChange={() => {
                updatePalette((prev) => ({
                  ...prev,
                  public: !prev?.public,
                }));
              }}
            />
          }
          label={translate('Make this filter set private')}
          sx={{ width: '33%' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={paletteData?.palette?.default}
              onChange={() => {
                updatePalette((prev) => ({
                  ...prev,
                  default: !prev?.default,
                }));
              }}
            />
          }
          label={translate('Set this filter set to default')}
          sx={{ width: '33%' }}
        />
        {(isParamType || isLineWithWidth) && (
          <Box component="div" sx={{ width: '33%' }}>
            <Autocomplete
              disabled={valType === 'boolean' || currentTmoType[selectedTab] === 'line'}
              value={selectedValue}
              onChange={handleChange}
              options={options}
              disablePortal
              disableClearable
              getOptionLabel={(option: AutocompleteOptions) => option?.label ?? ''}
              renderInput={(params: any) => <TextField {...params} />}
              isOptionEqualToValue={(option: AutocompleteOptions, value: AutocompleteOptions) =>
                option?.value === value?.value
              }
            />
          </Box>
        )}
      </Box>
    </>
  );
};
