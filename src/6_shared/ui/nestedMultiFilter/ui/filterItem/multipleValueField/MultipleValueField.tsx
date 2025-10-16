import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Chip, TextField } from '@mui/material';

import { useState } from 'react';
import { INestedMultiFilterForm } from '../../../types';
import { FILTER_VALUE_SEPARATOR } from '../../../config';

interface IProps {
  currentColumnIndex: number;
  filterIndex: number;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  valueSelectList?: string[];
}

export const MultipleValueField = ({
  currentColumnIndex,
  filterIndex,
  onChange: onChangeExternal,
  valueSelectList,
}: IProps) => {
  const form = useFormContext<INestedMultiFilterForm>();
  const [inputLocalValue, setInputLocalValue] = useState('');

  return (
    <Controller
      control={form.control}
      defaultValue=""
      name={`columnFilters.${currentColumnIndex}.filters.${filterIndex}.value`}
      rules={{ required: { value: true, message: 'Field cannot be empty' } }}
      render={({ field: { onChange, value, ...other }, fieldState: { invalid, error } }) => (
        <Autocomplete
          {...other}
          sx={{ flex: 2, maxHeight: 100, overflowY: 'auto' }}
          value={value && typeof value === 'string' ? value.split(FILTER_VALUE_SEPARATOR) : []}
          multiple
          freeSolo
          onBlur={(e) => {
            const currentValues =
              form.getValues().columnFilters[currentColumnIndex].filters[filterIndex].value;

            if (inputLocalValue.trim().length > 0 && typeof currentValues === 'string') {
              let newValue: string = '';
              if (currentValues.length) {
                newValue = `${currentValues}${FILTER_VALUE_SEPARATOR}${inputLocalValue}`;
              } else {
                newValue = inputLocalValue;
              }
              onChange(newValue);
              onChangeExternal?.(form.getValues());
              setInputLocalValue('');
            }
          }}
          inputValue={inputLocalValue}
          onInputChange={(event, val) => setInputLocalValue(val)}
          options={valueSelectList ?? []}
          getOptionLabel={(option) => option}
          onChange={(_, newValue) => {
            onChange(newValue.join(FILTER_VALUE_SEPARATOR));
            onChangeExternal?.(form.getValues());
          }}
          renderTags={(values, getTagProps) =>
            values.map((option, index) => (
              <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={invalid}
              helperText={error?.message}
              placeholder="Value"
              data-testid="multi-filter__multivalue-field"
            />
          )}
        />
      )}
    />
  );
};
