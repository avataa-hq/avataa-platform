import { BaseSyntheticEvent, useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import {
  useTranslate,
  FormContainer,
  KeyValueInput,
  sourcesManagementApi,
  dataviewHelpersApi,
} from '6_shared';

const { useGetSourceConfigQuery } = sourcesManagementApi;
const { useGetAggregationsQuery } = dataviewHelpersApi;

export interface AggregationFormInputs {
  name: string;
  group: {
    by: string[];
    aggregations: Record<string, string>;
  };
}

type AggregationFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: AggregationFormInputs, event?: BaseSyntheticEvent) => void;
  sourceId?: number;
};

export const AggregationForm = ({
  onSubmit: externalOnSubmit,
  sourceId = 0,
  ...props
}: AggregationFormProps) => {
  const translate = useTranslate();
  const {
    trigger,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AggregationFormInputs>();

  const { data: sourceConfigs, isFetching: isSourceConfigsFetching } =
    useGetSourceConfigQuery(sourceId);

  const { data: allAggregations, isFetching: isAggregationsFetching } = useGetAggregationsQuery();

  const getColumnSpecifigAggregations = useCallback(
    (selectedColumn?: string) => {
      if (!allAggregations) return [];

      const columnValType = sourceConfigs?.find(({ name }) => name === selectedColumn)?.val_type;
      if (!columnValType) return [];

      return allAggregations[columnValType] ?? [];
    },
    [allAggregations, sourceConfigs],
  );

  const onSubmit: SubmitHandler<AggregationFormInputs> = (data, event) => {
    externalOnSubmit?.(data, event);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormContainer sx={{ justifyContent: 'center' }}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', { required: translate('This field is required') })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Controller
          name="group.by"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              multiple
              disableCloseOnSelect
              disabled={isSourceConfigsFetching}
              options={sourceConfigs?.map(({ name }) => name) ?? []}
              onChange={(_, data) => onChange(data)}
              renderOption={(autocompleteProps, option, { selected }) => (
                <li {...autocompleteProps}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={({ InputLabelProps, ...params }) => (
                <TextField
                  {...params}
                  {...field}
                  inputRef={ref}
                  label={`${translate('Group by')}*`}
                  placeholder="Fields"
                  error={!!errors.group?.by}
                  helperText={errors.group?.by?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSourceConfigsFetching && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        {/* Fields that are not selected in the first Autocomplete */}
        <Controller
          name="group.aggregations"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={({ field: { value } }) => (
            <FormControl error={!!errors.group?.aggregations}>
              <KeyValueInput
                label={`${translate('Aggregations')}*`}
                onChange={(v) => {
                  setValue('group.aggregations', v);
                  trigger('group.aggregations');
                }}
                initialValue={value}
                sx={{ width: '100%' }}
                keyInputProps={{
                  select: true,
                  sx: { flex: 1 },
                  label: translate('Additional prop'),
                  children: sourceConfigs?.map(({ name, id }) => (
                    <MenuItem key={id} value={name}>
                      {name}
                    </MenuItem>
                  )),
                }}
                valueInputProps={(keyValue) => ({
                  select: true,
                  disabled: isAggregationsFetching,
                  sx: { flex: 1 },
                  label: translate('Aggregation'),
                  children: getColumnSpecifigAggregations(keyValue).map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  )),
                })}
              />
              <FormHelperText>{errors.group?.aggregations?.message?.toString()}</FormHelperText>
            </FormControl>
          )}
        />
      </FormContainer>
    </form>
  );
};
