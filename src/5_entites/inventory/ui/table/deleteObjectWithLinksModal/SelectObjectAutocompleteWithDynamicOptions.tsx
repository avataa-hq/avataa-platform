import { AutocompleteValue, useDebounceValue } from '6_shared';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { AutocompleteInputChangeReason, SxProps, Theme } from '@mui/material';
import { useSearchObjectsByNameWithMisspelledWords } from '../../../api';

interface SelectObjectAutocompleteWithDynamicOptionsProps {
  tmoId: number;
  value: AutocompleteValue | null;
  setValue: (value: AutocompleteValue) => void;
  sxProps?: SxProps<Theme>;
}

export const SelectObjectAutocompleteWithDynamicOptions = ({
  tmoId,
  value,
  setValue,
  sxProps,
}: SelectObjectAutocompleteWithDynamicOptionsProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<AutocompleteValue[]>([]);
  const debounceSearchValue = useDebounceValue(searchValue);

  const { objectsByNameWithMisspelledWordsData: newOptions } =
    useSearchObjectsByNameWithMisspelledWords({
      searchValue: debounceSearchValue,
      tmo_id: tmoId,
      skip: !tmoId,
    });

  useEffect(() => {
    if (!newOptions) return;

    const newSearchOptions: AutocompleteValue[] = newOptions?.objects.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    setOptions(newSearchOptions);
  }, [newOptions]);

  const handleInputValueChange = useCallback(
    (_: SyntheticEvent, val: string, reason: AutocompleteInputChangeReason) => {
      if (reason === 'input') {
        setSearchValue(val.trim());
      }

      if (reason === 'clear') {
        setSearchValue('');
        setValue({ id: null, label: '' });
      }
    },
    [setValue],
  );

  const onChange = useCallback(
    (newValue: AutocompleteValue | null) => {
      if (newValue) {
        setValue(newValue);
      } else {
        setValue({ id: null, label: '' });
      }
    },
    [setValue],
  );

  return (
    <Autocomplete
      options={options}
      sx={{ width: 300, ...sxProps }}
      value={value}
      onChange={(_: SyntheticEvent, newValue: AutocompleteValue | null) => onChange(newValue)}
      onInputChange={handleInputValueChange}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => <TextField {...params} label="Select object" />}
    />
  );
};
