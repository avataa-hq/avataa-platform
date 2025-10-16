import { BaseSyntheticEvent } from 'react';
import { Autocomplete, Checkbox, CircularProgress, MenuItem, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useTranslate, FormContainer, sourcesManagementApi } from '6_shared';
import { JoinRule, joinRules } from '6_shared/api/dataview/types';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const { useGetSourceConfigQuery } = sourcesManagementApi;

export interface AddJoinFormInputs {
  name: string;
  join: {
    rule: JoinRule;
    rootColumns: string[];
    targetColumns: string[];
  };
  // description: string;
}

type AddJoinFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: AddJoinFormInputs, event?: BaseSyntheticEvent) => void;
  rootSourceId?: number;
  targetSourceId?: number;
};

export const AddJoinForm = ({
  onSubmit: onExternalSubmit,
  rootSourceId = 0,
  targetSourceId = 0,
  ...props
}: AddJoinFormProps) => {
  const translate = useTranslate();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddJoinFormInputs>();

  const { data: rootSourceConfigs, isFetching: isRootSourceConfigsFetching } =
    useGetSourceConfigQuery(rootSourceId);
  const { data: targetSourceConfigs, isFetching: isTargetSourceConfigsFetching } =
    useGetSourceConfigQuery(targetSourceId);

  const onSubmit: SubmitHandler<AddJoinFormInputs> = (data, event) => {
    onExternalSubmit?.(data, event);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormContainer sx={{ justifyContent: 'center' }}>
        <TextField
          label={translate('Name')}
          {...register('name', { required: translate('This field is required') })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label={translate('Join rule')}
          {...register('join.rule', { required: translate('This field is required') })}
          error={!!errors.join?.rule}
          helperText={errors.join?.rule?.message}
          select
        >
          {joinRules.map((rule) => (
            <MenuItem key={rule} value={rule}>
              {rule}
            </MenuItem>
          ))}
        </TextField>
        <Controller
          name="join.rootColumns"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              multiple
              disableCloseOnSelect
              disabled={isRootSourceConfigsFetching}
              options={rootSourceConfigs?.map((config) => config.name) ?? []}
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
                  label={`${translate('Root source columns')}*`}
                  placeholder={translate('Columns')}
                  error={!!errors.join?.rootColumns}
                  helperText={errors.join?.rootColumns?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isRootSourceConfigsFetching && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        <Controller
          name="join.targetColumns"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              multiple
              disableCloseOnSelect
              disabled={isTargetSourceConfigsFetching}
              options={targetSourceConfigs?.map((config) => config.name) ?? []}
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
                  label={`${translate('Target source columns')}*`}
                  placeholder={translate('Columns')}
                  error={!!errors.join?.targetColumns}
                  helperText={errors.join?.targetColumns?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isTargetSourceConfigsFetching && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        {/* <TextField
          label={translate('Description')}
          minRows={2}
          maxRows={4}
          multiline
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        /> */}
      </FormContainer>
    </form>
  );
};
