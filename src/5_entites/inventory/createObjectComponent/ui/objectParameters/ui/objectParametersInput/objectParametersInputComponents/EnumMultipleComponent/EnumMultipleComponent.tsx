import { useEffect, useState } from 'react';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useParseEnumConstraint } from '5_entites/inventory/hooks';
import { IObjectComponentParams, useTranslate } from '6_shared';
import { AutocompleteWrapper, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
  duplicateObject: boolean;
}

export const EnumMultipleComponent = ({ param, duplicateObject }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const { control, setValue, getValues, clearErrors } = useFormContext();

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    getValues(param.id.toString()) ?? [],
  );

  const { options } = useParseEnumConstraint({ constraint: param.constraint });

  useEffect(() => {
    if (duplicateObject && selectedOptions) {
      setValue(param.id.toString(), selectedOptions);
    }
  }, [duplicateObject, param.id, selectedOptions, setValue]);

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ?? ''}
      rules={{
        required: param.required || param.primary ? translate('This field is required') : false,
      }}
      render={({ field }) => (
        <Wrapper sx={{ position: 'relative' }}>
          <Label>{param.name}</Label>
          <AutocompleteWrapper sx={{ width: '60%' }}>
            <Autocomplete
              {...field}
              multiple
              // disablePortal
              disableCloseOnSelect
              value={selectedOptions}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedOptions(newValue);
                  setValue(param.id.toString(), newValue);
                  clearErrors(param.id.toString());
                }
              }}
              options={options}
              renderInput={(params) => (
                <TextField sx={{ fontSize: '12px' }} variant="outlined" {...params} />
              )}
              sx={{
                backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
                borderRadius: '10px',
                '.MuiInputBase-root': {
                  minHeight: '24px',
                  height: 'auto',
                },
                '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                  padding: '0 34px 0 6px',
                },
                '.MuiChip-root': {
                  fontSize: '12px',
                  height: 'max-content',
                  margin: '2px',
                  '.MuiSvgIcon-root': {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </AutocompleteWrapper>
        </Wrapper>
      )}
    />
  );
};
