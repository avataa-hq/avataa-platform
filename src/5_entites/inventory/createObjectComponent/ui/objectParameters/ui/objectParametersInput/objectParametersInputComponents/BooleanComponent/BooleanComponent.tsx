import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem } from '@mui/material';
import { IObjectComponentParams, useTranslate } from '6_shared';
import { ErrorMessage, Label, Wrapper } from '../../commonComponents';
import * as SC from './BooleanComponent.styled';

interface IProps {
  param: IObjectComponentParams;
}

export const BooleanComponent = ({ param }: IProps) => {
  const translate = useTranslate();

  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ?? ''}
      rules={{
        required: param.required || param.primary ? translate('This field is required') : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <Wrapper sx={{ position: 'relative' }}>
          <Label>{param.name}</Label>
          <SC.SelectStyled
            {...field}
            value={field.value || ''}
            onChange={(e) => {
              setValue(param.id.toString(), e.target.value);
              clearErrors(param.id.toString());
            }}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </SC.SelectStyled>

          {error && (
            <ErrorMessage color="error">{translate('This field is required')}</ErrorMessage>
          )}
        </Wrapper>
      )}
    />
  );
};
