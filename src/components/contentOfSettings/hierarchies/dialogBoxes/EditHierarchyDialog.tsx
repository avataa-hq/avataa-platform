import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { ObjectPermissions } from '5_entites';
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
import type { EditHierarchyFormInputs } from './types';
import { validateName } from '../lib/validateName';

const { useUpdateHierarchyMutation } = hierarchyApi;

const formId = 'edit-hierarchy-form';

export const EditHierarchyDialog = () => {
  const translate = useTranslate();

  const { user } = useUser();

  const { selectedHierarchy, isEditHierarchyDialogOpen, setIsEditHierarchyDialogOpen } =
    useHierarchyBuilder();

  const [tabValue, setTabValue] = useState('1');

  const defaultValues = useMemo(
    () => ({
      name: selectedHierarchy?.name ?? undefined,
      author: user?.name ?? selectedHierarchy?.author,
      create_empty_nodes: selectedHierarchy?.create_empty_nodes ?? true,
      description: selectedHierarchy?.description,
    }),
    [
      selectedHierarchy?.author,
      selectedHierarchy?.create_empty_nodes,
      selectedHierarchy?.description,
      selectedHierarchy?.name,
      user?.name,
    ],
  );

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [updateHierarchy, { isLoading: isUpdateHierarchyLoading }] = useUpdateHierarchyMutation();

  const closeDialog = () => {
    setIsEditHierarchyDialogOpen(false);
    setTabValue('1');
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit: SubmitHandler<EditHierarchyFormInputs> = async (data) => {
    try {
      if (!selectedHierarchy) throw new Error('No hierarchy selected');

      if (data.name) {
        data.name = data.name.trim();
      }

      await fetchWithRetry(async (requestData, signal) => {
        return updateHierarchy({
          hierarchyId: selectedHierarchy?.id!,
          body: requestData,
          signal,
        }).unwrap();
      }, data);

      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const tabsContent = [
    {
      label: 'Permissions',
      content: <ObjectPermissions hierarchyId={selectedHierarchy?.id} onModalClose={closeDialog} />,
    },
  ];

  return (
    <Modal
      open={!!isEditHierarchyDialogOpen}
      minWidth={500}
      onClose={() => {
        closeDialog();
      }}
      title={translate('Edit hierarchy')}
      actions={
        tabValue === '1' && (
          <LoadingButton
            loading={isUpdateHierarchyLoading}
            variant="contained"
            type="submit"
            form={formId}
          >
            {translate('Save')}
          </LoadingButton>
        )
      }
      tabValue={tabValue}
      tabsContent={tabsContent}
      setTabValue={setTabValue}
      width="auto"
      ModalContentSx={{ height: 'unset' }}
    >
      {/* @ts-ignore - onSubmit data should have required `name`, but in order to enable required fields error it should be initially set to `undefined` */}
      <FormContainer component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', {
            required: translate('This field is required'),
            validate: (value) => validateName(value!, translate),
            maxLength: {
              value: 50,
              message: `${translate('Maximum allowed length')}: ${50}`,
            },
          })}
          helperText={errors.name?.message}
          error={!!errors.name}
          fullWidth
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
          fullWidth
          autoFocus
        />
      </FormContainer>
    </Modal>
  );
};
