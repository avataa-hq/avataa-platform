import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import {
  Modal,
  useTranslate,
  FormContainer,
  getErrorMessage,
  graphApi,
  objectTypesApi,
  IosSwitch,
  GraphTmoNodeParam,
  InventoryObjectTypesModel,
  useGraphSettingsPage,
} from '6_shared';
import { GraphTmoNode } from '6_shared/api/graph/types';

import { addLevelToNodes } from '5_entites';

interface ModifiedGraphTmoNode {
  id: string;
  level?: number;
  key: string;
  name: string;
  virtual: boolean;
  global_uniqueness: boolean;
  materialize: boolean;
  enabled: boolean;
  params: GraphTmoNode['params'];
  is_grouped: boolean;
}

type PopulatedTprm = GraphTmoNode['params'][number] & {
  tmo_name: string;
  is_grouped: boolean;
  level?: number;
};

interface FormInputs {
  name: string;
  group_by_tprms: PopulatedTprm[];
  trace_tmo_id?: number;
  trace_tprm_id?: number;
  delete_disconnected: boolean;
}

const formId = 'edit-graph-data-form';

const { useUpdateGraphDataMutation } = graphApi.initialisation;
const { useUpdateTmoGraphMutation } = graphApi.tmo;
const { useBuildGraphMutation } = graphApi.building;
const { useGetObjectTypesQuery } = objectTypesApi;
const { useGetTmoGraphQuery } = graphApi.tmo;

export const EditGraphDataModal = () => {
  const theme = useTheme();
  const translate = useTranslate();
  const activateTheModel = useRef(false);

  const { isEditGraphDataModalOpen, selectedGraph, setEditGraphDataModalOpen, setSelectedGraph } =
    useGraphSettingsPage();

  const [paramsListFromSelectedObject, setParamsListFromSelectedObject] = useState<
    GraphTmoNodeParam[]
  >([]);

  const [objectTypesList, setObjectTypesList] = useState<InventoryObjectTypesModel[]>([]);

  const { data: graphTmo } = useGetTmoGraphQuery(selectedGraph?.key ?? '', {
    skip: !selectedGraph,
  });
  const { data: objectTypes, isFetching: isObjectTypesFetching } = useGetObjectTypesQuery();

  const [editGraphData, { isLoading: isEditGraphDataLoading }] = useUpdateGraphDataMutation();
  const [editTmoGraph, { isLoading: isEditTmoGraphLoading }] = useUpdateTmoGraphMutation();
  const [buildGraph, { isLoading: isBuildGraphLoading }] = useBuildGraphMutation();

  const nodesWithLevelAndId = useMemo(
    () =>
      addLevelToNodes(graphTmo?.nodes ?? [], graphTmo?.edges ?? [])
        .map((node) => ({
          ...node,
          id: node.key,
        }))
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0)) ?? [],
    [graphTmo?.edges, graphTmo?.nodes],
  );

  const populatedTprms: PopulatedTprm[] = useMemo(
    () =>
      nodesWithLevelAndId
        .map((node: ModifiedGraphTmoNode) => [
          ...node.params
            .map((param) => ({
              tmo_name: node.name,
              is_grouped: node.is_grouped,
              level: node.level,
              ...param,
            }))
            .filter((tprm) => !tprm.is_grouped),
        ])
        .flat() ?? [],
    [nodesWithLevelAndId],
  );

  const defaultValues: Partial<FormInputs> = useMemo(
    () => ({
      name: selectedGraph?.name,
      group_by_tprms:
        graphTmo?.group_by_tprms?.flatMap(
          (tprmId) => populatedTprms.find((tprm) => tprm.id === tprmId) ?? [],
        ) ?? [],
      trace_tmo_id: graphTmo?.trace_tmo_id,
      delete_disconnected: graphTmo?.delete_orphan_branches ?? false,
      trace_tprm_id: graphTmo?.trace_tprm_id,
    }),
    [
      graphTmo?.delete_orphan_branches,
      graphTmo?.group_by_tprms,
      graphTmo?.trace_tmo_id,
      graphTmo?.trace_tprm_id,
      populatedTprms,
      selectedGraph?.name,
    ],
  );

  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({ defaultValues });

  const watchTraceObject = watch('trace_tmo_id');

  useEffect(() => {
    const graphTmoIds = graphTmo?.nodes?.map((tmo) => tmo.id);
    const neededTmoList = objectTypes?.filter((tmo) => graphTmoIds?.includes(tmo.id));
    setObjectTypesList(neededTmoList ?? []);

    const currentGraphTmoParams = graphTmo?.nodes.find((node) => {
      return node.id === watchTraceObject;
    })?.params;

    setParamsListFromSelectedObject(currentGraphTmoParams ?? []);
  }, [watchTraceObject, graphTmo?.nodes, objectTypes]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const closeModal = () => {
    setEditGraphDataModalOpen(false);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      if (!selectedGraph) throw new Error('There is no selected graph');

      const requestBody = {
        group_by_tprms:
          data.group_by_tprms
            ?.sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
            .map(({ id }) => id) ?? [],
        ...(data.trace_tmo_id && { trace_tmo_id: data.trace_tmo_id }),
        delete_orphan_branches: data.delete_disconnected,
        trace_tprm_id: data.trace_tprm_id,
      };

      await editGraphData({
        graphKey: selectedGraph.key,
        body: { name: data.name.trim() },
      }).unwrap();

      if (Object.keys(requestBody).length) {
        await editTmoGraph({ graphKey: selectedGraph.key, body: requestBody }).unwrap();
      }

      if (activateTheModel.current) {
        await buildGraph(selectedGraph.key).unwrap();
      }
      closeModal();
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  const cancel = () => {
    setSelectedGraph(null);
    closeModal();
  };

  return (
    <Modal
      title={translate('Settings')}
      open={isEditGraphDataModalOpen}
      onClose={() => cancel()}
      ModalContentSx={{ overflow: 'hidden', display: 'flex' }}
      actions={
        <Box component="div" display="flex" justifyContent="space-between" width="100%">
          <FormControlLabel
            sx={{ justifyContent: 'space-between', gap: '5px' }}
            control={<IosSwitch color="primary" />}
            labelPlacement="end"
            label={translate('Activate the model')}
            onChange={(e) => {
              // @ts-ignore - The `checked` property exists, because the input is of type `checkbox`
              activateTheModel.current = e.target.checked;
            }}
          />
          <Box component="div" display="flex" gap="5px">
            <Button onClick={() => cancel()} variant="outlined">
              {translate('Cancel')}
            </Button>
            <LoadingButton
              loading={isEditGraphDataLoading || isEditTmoGraphLoading || isBuildGraphLoading}
              variant="contained"
              type="submit"
              form={formId}
            >
              {translate('Save')}
            </LoadingButton>
          </Box>
        </Box>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex' }}>
        <FormContainer>
          <TextField
            label={translate('Name')}
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
            defaultValue={defaultValues.name}
          />
          <Controller
            name="group_by_tprms"
            control={control}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                multiple
                disableCloseOnSelect
                sx={{ flex: 1 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={populatedTprms ?? []}
                defaultValue={defaultValues.group_by_tprms ?? []}
                onChange={(_, data) => onChange(data)}
                getOptionLabel={(option) =>
                  option.is_grouped ? option.name : `${option.tmo_name} • ${option.name}`
                }
                getOptionKey={(option) => option.id}
                renderOption={(autocompleteProps, option, { selected }) => (
                  <li {...autocompleteProps} key={option.id}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.tmo_name}
                    {option.is_grouped ? (
                      <Typography
                        display="inline"
                        ml="5px"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {translate('grouped')}
                      </Typography>
                    ) : (
                      ` • ${option.name}`
                    )}
                  </li>
                )}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField
                    {...params}
                    {...field}
                    inputRef={ref}
                    label={translate('Aggregation')}
                    placeholder="Tprms"
                    error={!!errors.group_by_tprms}
                    helperText={errors.group_by_tprms?.message}
                  />
                )}
              />
            )}
          />
          <TextField
            label={`${translate('Trace object')}`}
            select
            {...register('trace_tmo_id')}
            error={!!errors.trace_tmo_id}
            helperText={errors.trace_tmo_id?.message}
            disabled={isObjectTypesFetching}
            defaultValue={defaultValues.trace_tmo_id}
          >
            <MenuItem value="" sx={{ display: 'none' }}>
              {translate('None')}
            </MenuItem>
            {objectTypesList.map((objectType) => (
              <MenuItem key={objectType.id} value={objectType.id}>
                {objectType.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={`${translate('Trace object name')}`}
            select
            {...register('trace_tprm_id')}
            error={!!errors.trace_tprm_id}
            helperText={errors.trace_tprm_id?.message}
            disabled={!watchTraceObject || !paramsListFromSelectedObject.length}
            defaultValue={defaultValues.trace_tprm_id}
          >
            <MenuItem value="" sx={{ display: 'none' }}>
              {translate('None')}
            </MenuItem>
            {paramsListFromSelectedObject.map((param) => (
              <MenuItem key={param.id} value={param.id}>
                {param.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            sx={{ alignSelf: 'start' }}
            control={
              <Controller
                name="delete_disconnected"
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
            label={translate('Delete disconnected')}
          />
        </FormContainer>
      </form>
    </Modal>
  );
};
