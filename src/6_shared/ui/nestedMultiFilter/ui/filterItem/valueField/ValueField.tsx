import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, TextField, Typography } from '@mui/material';
import { usePatternConverts, useTranslate } from '6_shared';

import { INestedMultiFilterForm } from '../../../types';

interface IProps {
  currentColumnIndex: number;
  filterIndex: number;
  valueSelectList?: string[];
  type:
    | 'string'
    | 'date'
    | 'datetime-local'
    | 'number'
    | 'int'
    | 'float'
    | 'boolean'
    | 'str'
    | 'bool';
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  readonly?: boolean;
}
export const ValueField = ({
  currentColumnIndex,
  filterIndex,
  valueSelectList,
  type = 'string',
  onChange: onChangeExternal,
  readonly,
}: IProps) => {
  const translate = useTranslate();
  const form = useFormContext<INestedMultiFilterForm>();
  const { patternConverts } = usePatternConverts();

  return (
    <Controller
      control={form.control}
      defaultValue=""
      name={`columnFilters.${currentColumnIndex}.filters.${filterIndex}.value`}
      rules={{
        required: 'Field cannot be empty',
        pattern: patternConverts(type),
      }}
      // rules={{ required: { value: true, message: 'Field cannot be empty' } }}
      render={({ field: { onChange, value, ...field }, fieldState: { invalid, error } }) => {
        return (
          <TextField
            {...field}
            onChange={(event) => {
              onChange(event);
              onChangeExternal?.(form.getValues());
            }}
            type={type}
            select={valueSelectList !== undefined}
            error={invalid}
            helperText={error?.message}
            sx={{ flex: 1 }}
            value={value}
            placeholder={translate('Value')}
            data-testid="multi-filter__value-field"
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              // @ts-ignore
              'data-testid': 'multi-filter__value-field-2',
              // readOnly: readonly,
              inputProps: {
                'data-testid': 'multi-filter__value-field-3',
              },
            }}
          >
            {valueSelectList !== undefined && (
              <MenuItem sx={{ display: 'none' }} value="">
                <Typography sx={{ opacity: 0.5 }}>Value</Typography>
              </MenuItem>
            )}
            {valueSelectList?.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
};
