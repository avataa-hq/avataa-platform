import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, Typography, useTheme } from '@mui/material';
import { LineWobble } from '@uiball/loaders';
import { useTranslate } from '6_shared';
import { INestedFilterColumn, INestedMultiFilterForm } from '../../../types';

interface IProps {
  currentColumnIndex: number;
  setCurrentColumnIndex: (idx: null | number) => void;
  columnsList?: INestedFilterColumn[];
  isLoading?: boolean;
  isError?: boolean;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  readonly?: boolean;
  filterIndex: number;
}
export const ColumField = ({
  currentColumnIndex,
  setCurrentColumnIndex,
  columnsList,
  isError,
  isLoading,
  onChange: onChangeExternal,
  readonly,
  filterIndex,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const form = useFormContext<INestedMultiFilterForm>();
  const { getValues, setValue } = form;

  return (
    <Controller
      name={`columnFilters.${currentColumnIndex}.column`}
      control={form.control}
      rules={{ required: { value: true, message: 'Field cannot be empty' } }}
      render={({ field: { onChange, name, ...other }, fieldState: { invalid, error } }) => (
        <Autocomplete
          {...other}
          sx={{ flex: 1 }}
          disabled={isLoading || isError}
          readOnly={readonly}
          loading={isLoading}
          filterSelectedOptions
          options={columnsList || []}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            onChange(newValue);
            setCurrentColumnIndex(currentColumnIndex);
            onChangeExternal?.(getValues());
            setValue(`columnFilters.${currentColumnIndex}.filters.${filterIndex}.operator`, '');
          }}
          renderInput={(props) => (
            <TextField
              error={invalid}
              helperText={error?.message}
              placeholder={translate('Column')}
              data-testid="multi-filter__column-name"
              {...props}
              InputProps={{
                ...props.InputProps,
                endAdornment: (
                  <>
                    {!isError && isLoading && <LineWobble color={theme.palette.primary.main} />}
                    {isError && <Typography color="error">Error </Typography>}
                    {props.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
};
