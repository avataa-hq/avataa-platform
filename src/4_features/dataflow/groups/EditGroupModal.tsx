import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { FormContainer, Modal, useTranslate } from '6_shared';
import { Group, GroupSourceType, groupSourceTypes } from '6_shared/api/dataflowV3/types';

import { useUpdateGroup } from './api';

interface EditGroupModalProps {
  selectedGroup?: Group;
  onClose: () => void;
  open: boolean;
}

interface AddGroupFormInputs {
  name: string;
  source_type: GroupSourceType;
}

const formId = 'edit-dataflow-group-form';

export const EditGroupModal = ({ onClose, open, selectedGroup }: EditGroupModalProps) => {
  const translate = useTranslate();

  const defaultValues = useMemo(
    () => ({
      name: selectedGroup?.name ?? '',
      source_type: selectedGroup?.source_type ?? '',
    }),
    [selectedGroup?.name, selectedGroup?.source_type],
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddGroupFormInputs>({ defaultValues });

  const [updateGroup, { isLoading: isPatchGroupLoading }] = useUpdateGroup();

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const close = () => {
    onClose();
  };

  const onSubmit: SubmitHandler<AddGroupFormInputs> = async (data) => {
    if (selectedGroup?.name === data.name && selectedGroup?.source_type === data.source_type) {
      close();
      return;
    }

    if (selectedGroup) await updateGroup({ id: selectedGroup?.id, ...data });
    close();
  };

  return (
    <Modal
      onClose={close}
      open={open}
      title={translate('Edit group')}
      actions={
        <>
          <Button variant="outlined" onClick={close}>
            {translate('Cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            form={formId}
            loading={isPatchGroupLoading}
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
          <TextField
            label={`${translate('Source type')}*`}
            {...register('source_type', { required: translate('This field is required') })}
            error={!!errors.name}
            defaultValue={defaultValues.source_type}
            helperText={errors.name?.message}
            select
          >
            <MenuItem value="" sx={{ display: 'none' }} />
            {groupSourceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </FormContainer>
      </form>
    </Modal>
  );
};
