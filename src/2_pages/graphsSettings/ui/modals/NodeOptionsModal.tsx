import { useEffect, useMemo } from 'react';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { Autocomplete, Button, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  Modal,
  useTranslate,
  FormContainer,
  getErrorMessage,
  graphApi,
  GraphTmoNodeParam,
  useGraphSettingsPage,
} from '6_shared';

interface FormInputs {
  commutationTprms: GraphTmoNodeParam[];
  showAsTable: boolean;
}

const formId = 'create-graph-form';

const { useSetNodeShowAsTableMutation, useSetCommutationBusyParametersMutation } = graphApi.tmo;

export const NodeOptionsModal = () => {
  const translate = useTranslate();
  const { isNodeOptionsModalOpen, selectedNode, displayedGraph, setNodeOptionsModalOpen } =
    useGraphSettingsPage();

  const [updateCommutationBusyParams, { isLoading: isUpdateCommutationBusyParamsLoading }] =
    useSetCommutationBusyParametersMutation();
  const [changeShowAsATableParameter] = useSetNodeShowAsTableMutation();

  const defaultValues: Partial<FormInputs> = useMemo(
    () => ({
      commutationTprms:
        selectedNode?.params.filter((param: any) =>
          selectedNode?.busy_parameter_groups.flat()?.includes(param.id),
        ) ?? [],
      showAsTable: selectedNode?.show_as_a_table ?? true,
    }),
    [selectedNode?.busy_parameter_groups, selectedNode?.params, selectedNode?.show_as_a_table],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const closeModal = () => {
    setNodeOptionsModalOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<FormInputs> = async ({ commutationTprms, showAsTable }) => {
    try {
      const nodeKey = selectedNode?.key ?? '';
      const graphKey = displayedGraph?.key ?? '';
      const busy_parameters = commutationTprms.map((param) => [param.id]);

      await updateCommutationBusyParams({ nodeKey, graphKey, busy_parameters });

      if (showAsTable !== selectedNode?.show_as_a_table) {
        await changeShowAsATableParameter({ nodeKey, graphKey, showAsTable });
      }

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
      title={translate('Options')}
      open={isNodeOptionsModalOpen}
      onClose={() => cancel()}
      actions={
        <>
          <Button onClick={() => cancel()} variant="outlined">
            {translate('Cancel')}
          </Button>
          <LoadingButton
            loading={isUpdateCommutationBusyParamsLoading}
            variant="contained"
            type="submit"
            form={formId}
          >
            {translate('Apply')}
          </LoadingButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <Controller
            name="commutationTprms"
            control={control}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                sx={{ flex: 1 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={selectedNode?.params.filter((p: any) => p.val_type === 'mo_link') ?? []}
                defaultValue={defaultValues.commutationTprms ?? []}
                onChange={(_, data) => onChange(data)}
                getOptionLabel={(option) => option.name}
                getOptionKey={(option) => option.id}
                renderOption={(autocompleteProps, option, { selected }) => (
                  <li {...autocompleteProps} key={option.id}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <Typography
                      display="inline"
                      ml="5px"
                      sx={{ color: (theme) => theme.palette.text.secondary }}
                    >
                      {option.name}
                    </Typography>
                  </li>
                )}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField
                    {...params}
                    {...field}
                    inputRef={ref}
                    label={translate('Busy TPRMs')}
                    placeholder="Tprms"
                    error={!!errors.commutationTprms}
                    helperText={errors.commutationTprms?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="showAsTable"
            control={control}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Checkbox {...field} defaultChecked={defaultValues.showAsTable} />
                <Typography>Show as a table</Typography>
              </Stack>
            )}
          />
        </FormContainer>
      </form>
    </Modal>
  );
};
