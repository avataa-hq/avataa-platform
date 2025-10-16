import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { InventoryParameterTypesModel, useTranslate } from '6_shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAttributesList } from '../utilities/interface';

type FormUnionType = Record<string, any>;

interface IProps<T extends FormUnionType> {
  control: Control<T, any>;
  disabled?: boolean;
  defaultValues?: IAttributesList[];
  attributesList?: IAttributesList[];
  isLoading?: boolean;
}

export const AttributesAutocomplete = <T extends FormUnionType>({
  control,
  disabled,
  defaultValues,
  attributesList,
  isLoading,
}: IProps<T>) => {
  const translate = useTranslate();

  return (
    <Box component="div">
      <Typography sx={{ mb: 1 }}>{`${translate('Param type')}*`}</Typography>
      <Controller
        // @ts-ignore
        name="key_attrs"
        control={control}
        rules={{
          required: translate('This field is required'),
        }}
        render={({ field: { onChange, ...props }, fieldState: { error } }) => (
          <Autocomplete
            {...props}
            multiple
            onChange={(e, val) => {
              const correctValue = val.map((item) => {
                const neededOption = attributesList?.find(
                  (attr) => String(attr.value) === String(item.value),
                );
                if (neededOption) return neededOption;
                return item;
              });
              onChange(correctValue);
            }}
            options={attributesList ?? []}
            defaultValue={defaultValues}
            getOptionLabel={(opt) => opt?.label}
            disabled={disabled}
            loading={isLoading}
            fullWidth
            data-testid="hierarchy-level__param-type"
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="primary" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
      />
    </Box>
  );
};
