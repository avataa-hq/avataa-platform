import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { CheckImportedTprmTableRow } from '6_shared';

interface InventoryImportTprmAutocompleteProps
  extends GridRenderCellParams<CheckImportedTprmTableRow> {
  options: { value: string | number; label: string }[];
  onChange: (id: number, value: { value: string | number; label: string }) => void;
}

export const InventoryImportTprmAutocomplete = ({
  row,
  options,
  onChange,
}: InventoryImportTprmAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Autocomplete
      value={row.selectTprm}
      onChange={(_, newValue) => {
        if (newValue && typeof newValue !== 'string') {
          onChange(row.id, newValue);
        }
      }}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
      }}
      onBlur={() => {
        if (row.selectTprm.label !== inputValue) {
          onChange(row.id, {
            label: inputValue,
            value:
              options.find((option) => option.label.toLowerCase() === inputValue.toLowerCase())
                ?.value || '',
          });
        }
      }}
      options={options}
      sx={{ width: '100%', margin: '10px 0' }}
      renderInput={(params) => <TextField {...params} label="Select a parameter type" />}
    />
  );
};
