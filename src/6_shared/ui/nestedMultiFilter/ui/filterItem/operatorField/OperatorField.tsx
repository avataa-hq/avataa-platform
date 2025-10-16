import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, TextField, Typography } from '@mui/material';
import { useTranslate } from '6_shared';

import { INestedMultiFilterForm } from '../../../types';

interface IProps {
  currentIndex: number;
  currentOperators: [string, string][];
  filterIndex: number;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  readonly?: boolean;
}
export const OperatorField = ({
  currentIndex,
  currentOperators,
  filterIndex,
  onChange: onChangeExternal,
  readonly,
}: IProps) => {
  const translate = useTranslate();
  const form = useFormContext<INestedMultiFilterForm>();

  return (
    <Controller
      defaultValue=""
      control={form.control}
      name={`columnFilters.${currentIndex}.filters.${filterIndex}.operator`}
      rules={{ required: { value: true, message: 'Field cannot be empty' } }}
      render={({ field: { onChange, ...field }, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          onChange={(event) => {
            onChange(event);
            onChangeExternal?.(form.getValues());
            form.setValue(`columnFilters.${currentIndex}.filters.${filterIndex}.value`, '');
          }}
          sx={{ flex: 1 }}
          select
          SelectProps={{ displayEmpty: true }}
          error={invalid}
          helperText={error?.message}
          data-testid="multi-filter__operator-field"
          inputProps={{
            readOnly: readonly,
          }}
        >
          <MenuItem sx={{ display: 'none' }} value="">
            <Typography sx={{ opacity: 0.5 }}>{translate('Operator')}</Typography>
          </MenuItem>
          {currentOperators.map(([key, val]) => (
            <MenuItem key={key} value={val}>
              {key}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
