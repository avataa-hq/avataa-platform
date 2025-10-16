import { BaseSyntheticEvent, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Autocomplete, Box, Checkbox, CircularProgress, TextField } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import { useTranslate, FormContainer, sourcesManagementApi } from '6_shared';
import { useGetObjectTypeParamTypes, useGetObjectTypes } from '5_entites';

const { useGetSourceConfigQuery } = sourcesManagementApi;

export interface MapFormInputs {
  name: string;
  tmo_id: number;
  source: {
    columns: string[];
    delimiter: string;
  };
  inventory: {
    columns: string[];
    delimiter: string;
  };
}

type MapFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: MapFormInputs, event?: BaseSyntheticEvent) => void;
  sourceId?: number;
};

export const MapForm = ({ onSubmit: externalOnSubmit, sourceId = 0, ...props }: MapFormProps) => {
  const translate = useTranslate();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MapFormInputs>();
  const [objectTypeId, setObjectTypeId] = useState<number | null>(null);

  const { objectTypesData, isFetching: isObjectTypesFetching } = useGetObjectTypes({});

  const { objectTypeParamTypes, isObjectTypesParamTypesFetching } = useGetObjectTypeParamTypes({
    objectTmoId: objectTypeId ?? 0,
  });

  const { data: sourceConfigs, isFetching: isSourceConfigsFetching } =
    useGetSourceConfigQuery(sourceId);

  const onSubmit: SubmitHandler<MapFormInputs> = (data, event) => {
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
          name="tmo_id"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              disabled={isObjectTypesFetching}
              options={objectTypesData ?? []}
              getOptionLabel={(option) => option.name}
              onChange={(_, data) => {
                onChange(data?.id);
                setObjectTypeId(data?.id ?? null);
              }}
              renderInput={({ InputLabelProps, ...params }) => (
                <TextField
                  {...params}
                  {...field}
                  inputRef={ref}
                  label={`${translate('Object type')} ID*`}
                  placeholder="Fields"
                  error={!!errors.tmo_id}
                  helperText={errors.tmo_id?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isObjectTypesFetching && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />

        <Box component="div" sx={{ display: 'flex', gap: '20px', width: '100%' }}>
          <Controller
            name="source.columns"
            control={control}
            rules={{ required: translate('This field is required') }}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                disabled={isSourceConfigsFetching}
                options={sourceConfigs?.map(({ name }) => name) ?? []}
                onChange={(_, data) => {
                  onChange(data);
                  setValue('source.delimiter', '-');
                }}
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
                    label={`${translate('Source columns')}*`}
                    placeholder="Fields"
                    error={!!errors.source?.columns}
                    helperText={errors.source?.columns?.message}
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
                sx={{ width: '50%' }}
              />
            )}
          />

          <Controller
            name="inventory.columns"
            control={control}
            rules={{ required: translate('This field is required') }}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                disabled={isObjectTypesParamTypesFetching}
                options={objectTypeParamTypes?.map(({ name }) => name) ?? []}
                onChange={(_, data) => {
                  onChange(data);
                  setValue('inventory.delimiter', '-');
                }}
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
                    label={`${translate('Inventory columns')}*`}
                    placeholder="Fields"
                    error={!!errors.inventory?.columns}
                    helperText={errors.inventory?.columns?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isObjectTypesParamTypesFetching && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{ width: '50%' }}
              />
            )}
          />
        </Box>
      </FormContainer>
    </form>
  );
};
