import { BaseSyntheticEvent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';

import { useTranslate, FormContainer } from '6_shared';

export interface AddVariableFormInputs {
  name: string;
  variable: { name: string; formula: string };
}

type AddVariableFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: AddVariableFormInputs, event?: BaseSyntheticEvent) => Promise<void>;
};

export const AddVariableForm = ({ onSubmit: onExternalSubmit, ...props }: AddVariableFormProps) => {
  const translate = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddVariableFormInputs>();

  const onSubmit: SubmitHandler<AddVariableFormInputs> = (data, event) => {
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
          label={translate('Column name')}
          {...register('variable.name', { required: translate('This field is required') })}
          error={!!errors.variable?.name}
          helperText={errors.variable?.name?.message}
        />
        <TextField
          label={translate('Formula')}
          minRows={2}
          maxRows={4}
          multiline
          {...register('variable.formula', { required: translate('This field is required') })}
          error={!!errors.variable?.formula}
          helperText={errors.variable?.formula?.message}
        />
      </FormContainer>
    </form>
  );
};
