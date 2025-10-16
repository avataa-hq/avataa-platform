import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';

import { useTranslate, FormContainer } from '6_shared';

export interface GroupFormInputs {
  name: string;
}

type GroupFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: GroupFormInputs) => void;
};

export const GroupForm = ({ onSubmit: externalOnSubmit, ...props }: GroupFormProps) => {
  const translate = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormInputs>();

  const onSubmit: SubmitHandler<GroupFormInputs> = (data) => {
    externalOnSubmit?.(data);
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
      </FormContainer>
    </form>
  );
};
