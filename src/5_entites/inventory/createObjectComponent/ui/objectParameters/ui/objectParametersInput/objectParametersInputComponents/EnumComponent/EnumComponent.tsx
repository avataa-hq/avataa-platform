import { useEffect, useState } from 'react';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { IObjectComponentParams, useTranslate } from '6_shared';
import { useParseEnumConstraint } from '5_entites/inventory/hooks';
import { AutocompleteWrapper, ErrorMessage, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
  duplicateObject: boolean;
}

export const EnumComponent = ({ param, duplicateObject }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [selectedOption, setSelectedOption] = useState<string | null>(
    getValues(param.id.toString()),
  );

  // useEffect(() => {
  //   if (param.value) {
  //     setSelectedOption(getValues(param.id.toString()));
  //   } else {
  //     setSelectedOption(null);
  //   }
  // }, [getValues, param.id, param.value]);

  const { options } = useParseEnumConstraint({ constraint: param.constraint });

  useEffect(() => {
    if (duplicateObject && selectedOption) {
      setValue(param.id.toString(), selectedOption);
    }
  }, [duplicateObject, param.id, selectedOption, setValue]);

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
              value={selectedOption}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedOption(newValue);
                  setValue(param.id.toString(), newValue);
                  clearErrors(param.id.toString());
                }
              }}
              options={options}
              renderInput={(params) => <TextField variant="outlined" {...params} />}
              sx={{
                backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
                borderRadius: '10px',
                '.MuiInputBase-root': {
                  height: '24px',
                  padding: '0 34px 0 6px',
                },
                '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                  padding: '0 34px 0 6px',
                },
              }}
            />

            {errors[param.id.toString()] && (
              <ErrorMessage color="error">{translate('This field is required')}</ErrorMessage>
            )}
          </AutocompleteWrapper>
        </Wrapper>
      )}
    />
  );
};
