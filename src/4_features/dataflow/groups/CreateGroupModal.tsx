import { Button, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { FormContainer, Modal, useTranslate } from '6_shared';
import { GroupSourceType, groupSourceTypes } from '6_shared/api/dataflowV3/types';

import { useCreateGroup } from './api';

interface AddGroupFormInputs {
  name: string;
  source_type: GroupSourceType;
}

interface CreateGroupModalProps {
  onClose: () => void;
  open: boolean;
}

const formId = 'add-dataflow-group-form';

export const CreateGroupModal = ({ onClose, open }: CreateGroupModalProps) => {
  const translate = useTranslate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddGroupFormInputs>({ mode: 'onChange' });

  const [createGroup, { isLoading: isCreateGroupLoading }] = useCreateGroup();

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<AddGroupFormInputs> = async (data) => {
    createGroup(data);
    reset();
    close();
  };

  return (
    <Modal
      title={translate('Create group')}
      onClose={close}
      open={open}
      actions={
        <>
          <Button variant="outlined" onClick={close}>
            {translate('Cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            form={formId}
            loading={isCreateGroupLoading}
          >
            {translate('Save')}
          </LoadingButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <TextField
            label={`${translate('Name')}*`}
            {...register('name', { required: translate('This field is required') })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Controller
            name="source_type"
            control={control}
            rules={{ required: translate('This field is required') }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={`${translate('Source type')}*`}
                error={!!error}
                helperText={error?.message}
                select
              >
                <MenuItem value="" sx={{ display: 'none' }} />
                {groupSourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </FormContainer>
      </form>
    </Modal>
  );
};
