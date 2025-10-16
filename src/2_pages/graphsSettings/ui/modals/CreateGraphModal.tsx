import { SubmitHandler, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { Button, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  Modal,
  useTranslate,
  FormContainer,
  getErrorMessage,
  graphApi,
  objectTypesApi,
  useGraphSettingsPage,
} from '6_shared';

interface FormInputs {
  name: string;
  tmo_id: number;
}

const formId = 'create-graph-form';

const { useCreateGraphMutation } = graphApi.initialisation;
const { useGetObjectTypesQuery } = objectTypesApi;

export const CreateGraphModal = () => {
  const translate = useTranslate();

  const { isCreateGraphModalOpen, setCreateGraphModalOpen } = useGraphSettingsPage();

  const [createGraph, { isLoading: isCreateGraphLoading }] = useCreateGraphMutation();
  const { data: objectTypes, isFetching: isObjectTypesFetching } = useGetObjectTypesQuery();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const closeModal = () => {
    setCreateGraphModalOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const newData = {
      ...data,
      name: data.name.trim(),
    };
    try {
      await createGraph(newData).unwrap();
      closeModal();
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  const cancel = () => closeModal();

  return (
    <Modal
      minWidth="500px"
      title={translate('Add')}
      open={isCreateGraphModalOpen}
      onClose={() => cancel()}
      actions={
        <>
          <Button onClick={() => cancel()} variant="outlined">
            {translate('Cancel')}
          </Button>
          <LoadingButton
            loading={isCreateGraphLoading}
            variant="contained"
            type="submit"
            form={formId}
          >
            {translate('Add')}
          </LoadingButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <TextField
            label={`${translate('Name')}*`}
            {...register('name', {
              required: translate('This field is required'),
              validate: (value) => {
                if (!value.trim()) {
                  return translate('This field is required');
                }
                return true;
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label={`${translate('Start point')}*`}
            select
            {...register('tmo_id', { required: translate('This field is required') })}
            error={!!errors.tmo_id}
            helperText={errors.tmo_id?.message}
            disabled={isObjectTypesFetching}
          >
            <MenuItem value="" sx={{ display: 'none' }} />
            {objectTypes?.map((objectType) => (
              <MenuItem key={objectType.id} value={objectType.id}>
                {objectType.name}
              </MenuItem>
            ))}
          </TextField>
        </FormContainer>
      </form>
    </Modal>
  );
};
