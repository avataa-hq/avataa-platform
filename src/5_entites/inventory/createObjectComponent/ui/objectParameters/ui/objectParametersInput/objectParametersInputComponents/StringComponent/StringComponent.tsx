import { Controller, useFormContext } from 'react-hook-form';
import { IObjectComponentParams, usePatternConverts, useTranslate } from '6_shared';
import { ErrorMessage, Label, Wrapper } from '../../commonComponents';
import * as SC from './StringComponent.styled';

interface IProps {
  param: IObjectComponentParams;
}

export const StringComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const { control } = useFormContext();
  const { patternConverts } = usePatternConverts();

  // const onFieldChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: ControllerRenderProps<FieldValues, string>,
  // ) => {
  //   field.onChange(e);

  //   const { value } = e.target;
  //   if (value.trim() === '') {
  //     if (!param.value && (!param.required || param.primary)) {
  //       clearErrors(param.id.toString());
  //       unregister(param.id.toString());
  //       return;
  //     }

  //     setError(param.id.toString(), {
  //       type: 'required',
  //       message: translate('This field is required'),
  //     });
  //   }

  // if (param.val_type === 'int' && !/^-?\d+$/.test(value)) {
  //   setError(param.id.toString(), {
  //     type: 'required',
  //     message: translate('Please enter a valid number'),
  //   });
  // }

  // if (param.val_type === 'float' && !/^-?[0-9]*(\.[0-9]+)?$/.test(value)) {
  //   setError(param.id.toString(), {
  //     type: 'pattern',
  //     message: translate('Please enter a valid float'),
  //   });
  // }

  // if (param.val_type === 'sequence' && !/^[1-9]\d*$/.test(value)) {
  //   setError(param.id.toString(), {
  //     type: 'pattern',
  //     message: translate('Please enter a positive integer'),
  //   });
  // }
  // };

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ?? ''}
      rules={{
        required: param.required || param.primary ? translate('This field is required') : false,
        pattern: patternConverts(param.val_type),
        // validate: {
        //   noEmptySpaces: (value) =>
        //     value?.toString().trim() !== '' ||
        //     translate('This field cannot be empty or contain only spaces'),
        // },
      }}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <Wrapper sx={{ position: 'relative', width: '100%' }}>
          <Label>{param.name}</Label>
          <SC.InputStyled
            {...field}
            multiline
            value={value ?? ''}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, field)}
            onChange={onChange}
          />
          {fieldState.error && (
            <ErrorMessage color="error">{fieldState.error.message}</ErrorMessage>
          )}
        </Wrapper>
      )}
    />
  );
};
