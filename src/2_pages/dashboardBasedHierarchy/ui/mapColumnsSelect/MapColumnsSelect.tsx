import { MapColumnsSelectData } from '6_shared';
import { Autocomplete, TextField } from '@mui/material';
import { SyntheticEvent } from 'react';

interface IProps {
  dataList?: MapColumnsSelectData[];
  selectedItem?: MapColumnsSelectData;
  setSelectedItem?: (item: MapColumnsSelectData) => void;

  fullWidth?: boolean;
}

export const MapColumnsSelect = ({
  setSelectedItem,
  selectedItem,
  dataList,
  fullWidth,
}: IProps) => {
  const onChange = (_: SyntheticEvent, value: MapColumnsSelectData | null) => {
    if (!value) return;
    setSelectedItem?.(value);
  };

  return (
    <Autocomplete
      options={dataList ?? []}
      getOptionLabel={(option) => option.label}
      autoComplete
      disableClearable
      disablePortal
      includeInputInList
      value={selectedItem}
      fullWidth={fullWidth}
      onChange={onChange}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
      sx={({ palette }) => ({
        '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
          backgroundColor: palette.background.default,
        },
        width: '40%',
      })}
    />
  );
};
