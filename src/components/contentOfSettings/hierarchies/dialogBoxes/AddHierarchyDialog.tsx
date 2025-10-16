import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import {
  FormContainer,
  Modal,
  useTranslate,
  hierarchyApi,
  getErrorMessage,
  fetchWithRetry,
  useHierarchyBuilder,
  useUser,
} from '6_shared';
import { AddHierarchyFormInputs } from './types';
import { validateName } from '../lib/validateName';

const { useAddHierarchyMutation } = hierarchyApi;

const formId = 'add-hierarchy-form';

export const AddHierarchyDialog = () => {
  const translate = useTranslate();

  const { user } = useUser();

  const { isAddHierarchyDialogOpen, setIsAddHierarchyDialogOpen } = useHierarchyBuilder();

  const defaultValues = useMemo(
    () => ({
      name: undefined,
      author: user?.name || '',
      create_empty_nodes: true,
      description: '',
    }),
    [user],
  );

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddHierarchyFormInputs>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const [addHierarchy, { isLoading: isAddHierarchyLoading }] = useAddHierarchyMutation();

  const closeDialog = () => {
    setIsAddHierarchyDialogOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<AddHierarchyFormInputs> = async (data) => {
    try {
      if (data.name) {
        data.name = data.name.trim();
      }

      await fetchWithRetry(async (requestData, signal) => {
        return addHierarchy({ body: requestData, signal }).unwrap();
      }, data);

      closeDialog();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Modal
      open={!!isAddHierarchyDialogOpen}
      title={translate('New hierarchy')}
      minWidth={500}
      onClose={() => {
        closeDialog();
      }}
      actions={
        <LoadingButton
          loading={isAddHierarchyLoading}
          variant="contained"
          type="submit"
          form={formId}
        >
          {translate('Save')}
        </LoadingButton>
      }
    >
      <FormContainer component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', {
            required: {
              value: true,
              message: translate('This field is required'),
            },
            validate: (value) => validateName(value, translate),
            maxLength: {
              value: 50,
              message: `${translate('Maximum allowed length')}: ${50}`,
            },
          })}
          helperText={errors.name?.message}
          error={!!errors.name}
        />
        <FormControlLabel
          control={
            <Controller
              name="create_empty_nodes"
              control={control}
              render={({ field: props }) => (
                <Checkbox
                  {...props}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                />
              )}
            />
          }
          label={translate('Create empty')}
        />
        <TextField
          label={translate('Description')}
          {...register('description')}
          helperText={errors.description?.message}
          error={!!errors.description}
          rows={3}
          multiline
          autoFocus
        />
      </FormContainer>
    </Modal>
  );
};
