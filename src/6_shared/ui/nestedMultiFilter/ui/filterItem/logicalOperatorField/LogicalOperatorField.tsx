import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, TextField } from '@mui/material';

import { INestedMultiFilterForm } from '../../../types';

interface IProps {
  currentIndex: number;
  filterIndex: number;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  readonly?: boolean;
}
export const LogicalOperatorField = ({
  currentIndex,
  filterIndex,
  onChange: onChangeExternal,
  readonly,
}: IProps) => {
  const form = useFormContext<INestedMultiFilterForm>();

  return (
    <Controller
      render={({ field: { onChange, ...other } }) => (
        <TextField
          {...other}
          select
          sx={{ width: 80 }}
          onChange={(event) => {
            onChange(event.target.value);
            onChangeExternal?.(form.getValues());
          }}
          disabled={filterIndex !== 1}
          inputProps={{
            readOnly: readonly,
          }}
        >
          <MenuItem value="and">AND</MenuItem>
          <MenuItem value="or">OR</MenuItem>
        </TextField>
      )}
      name={`columnFilters.${currentIndex}.logicalOperator`}
      control={form.control}
    />
  );
};
