import { BaseSyntheticEvent, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import {
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  Box,
  Typography,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  RefreshRounded,
  SettingsRounded,
} from '@mui/icons-material';

import {
  useTranslate,
  FormContainer,
  getErrorMessage,
  dataflowGroupsApi,
  apiSourcesApi,
  KeyValueInput,
  ErrorPage,
  LoadingAvataa,
} from '6_shared';
import { ApiConData } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

import { ConnectionStatus } from '../addDataSource/ui/ConnectionStatus';

export interface EditApiSourceInputs {
  name: string;
  group_id: number;
  con_data: ApiConData;
}

type EditApiSourceFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: EditApiSourceInputs, event?: BaseSyntheticEvent) => void;
  onManageGroupsClick?: MouseEventHandler<HTMLButtonElement>;
  defaultValues: Subset<EditApiSourceInputs>;
};

const connectionCheckFields = [
  'con_data.end_point',
  'con_data.method',
  'con_data.query_params',
  'con_data.body_params',
  'con_data.auth_type',
  'con_data.auth_data',
] as const;

export const EditApiSourceForm = ({
  onManageGroupsClick,
  defaultValues,
  onSubmit: onExternalSubmit,
  ...props
}: EditApiSourceFormProps) => {
  const { useGetAllGroupsQuery } = dataflowGroupsApi;
  const {
    useCheckApiSourceConnectionWithoutIdMutation,
    useGetApiAuthTypesQuery,
    useGetApiSourceColumnsWithoutIdMutation,
  } = apiSourcesApi;

  const translate = useTranslate();
  const theme = useTheme();
  const [authType, setAuthType] = useState<string | null>(null);

  const {
    reset,
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<EditApiSourceInputs>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();

  const onSubmit: SubmitHandler<EditApiSourceInputs> = (data, event) => {
    onExternalSubmit?.(data, event);
  };

  const {
    data: authTypes,
    isFetching: isAuthTypesFetching,
    isError: isAuthTypesError,
  } = useGetApiAuthTypesQuery();
  const [getApiSourceColumns, { isLoading: isApiSourceColumnsLoading, data: apiSourceColumns }] =
    useGetApiSourceColumnsWithoutIdMutation();
  const [checkApiConnection] = useCheckApiSourceConnectionWithoutIdMutation();

  const isLoading = isGroupsFetching || isAuthTypesFetching;
  const isError = isGroupsError || isAuthTypesError;

  const checkApiConnectionRequestBody = useMemo(() => {
    const { source_data_columns, ...requestBody } = getValues('con_data');
    return requestBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(connectionCheckFields)]);

  const getColumns = async () => {
    await trigger(['con_data.end_point', 'con_data.auth_data']);

    const requestBody = getValues('con_data');
    getApiSourceColumns(requestBody)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  useEffect(() => {
    try {
      const requestBody = getValues('con_data');
      getApiSourceColumns(requestBody);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [getApiSourceColumns, getValues]);

  useEffect(() => {
    if (!authTypes) return;
    const authTypesKeys = Object.keys(authTypes);
    if (!getValues('con_data.auth_type') || !authType || !(authTypesKeys.length < 1)) {
      setValue('con_data.auth_type', authTypesKeys[0]);
      setAuthType(authTypesKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, authTypes, getValues, setValue]);

  return (
    <>
      {!isLoading && isError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          />
        </Box>
      )}
      {isLoading && !isError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <LoadingAvataa />
        </Box>
      )}
      {!isLoading && !isError && (
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <FormContainer sx={{ justifyContent: 'center' }}>
            <TextField
              label={`${translate('Source Name')}*`}
              {...register('name', {
                required: translate('This field is required'),
                maxLength: {
                  value: 32,
                  message: `${translate('Max length is')} 32${translate('characters')}`,
                },
              })}
              defaultValue={defaultValues.name}
              helperText={errors.name?.message}
              error={!!errors.name}
            />
            <Box component="div" display="flex" gap="10px" alignItems="end">
              <TextField
                sx={{ flex: 1 }}
                label={`${translate('Source Group')}*`}
                {...register('group_id', { required: translate('This field is required') })}
                helperText={errors.group_id?.message}
                disabled={isGroupsFetching}
                defaultValue={defaultValues.group_id}
                error={!!errors.group_id}
                select
              >
                <MenuItem value="" sx={{ display: 'none' }} />
                {groups &&
                  groups?.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
              </TextField>
              <Button component="button" variant="outlined.icon" onClick={onManageGroupsClick}>
                <SettingsRounded />
              </Button>
            </Box>
            <ConnectionStatus
              alignSelf="start"
              requestFn={checkApiConnection}
              requestBody={checkApiConnectionRequestBody}
              skipAutoCheck={
                watch(connectionCheckFields).some((v) => v === '' || v === undefined) ||
                (watch('con_data.auth_type') !== 'No Authentication' &&
                  watch('con_data.auth_data') === undefined)
              }
              onClick={() => trigger(connectionCheckFields)}
            />
            <TextField
              label={`${translate('Endpoint')}*`}
              {...register('con_data.end_point', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.end_point}
              helperText={errors.con_data?.end_point?.message}
              error={!!errors.con_data?.end_point}
            />
            <TextField
              label={`${translate('Method')}*`}
              {...register('con_data.method', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.method}
              helperText={errors.con_data?.method?.message}
              error={!!errors.con_data?.method}
              sx={{ flex: 1 }}
              select
            >
              <MenuItem value="get">GET</MenuItem>
              <MenuItem value="post">POST</MenuItem>
            </TextField>
            <KeyValueInput
              label={translate('Query params')}
              onChange={(value) => setValue('con_data.query_params', value)}
            />
            <KeyValueInput
              label={translate('Body params')}
              onChange={(value) => setValue('con_data.body_params', value)}
            />
            <Box component="div" display="flex" gap="10px">
              <Controller
                name="con_data.source_data_columns"
                control={control}
                render={({ field: { ref, onChange, ...field } }) => (
                  <Tooltip title={translate('Press button to get columns')} placement="top-end">
                    <Autocomplete
                      multiple
                      sx={{ flex: 1 }}
                      disableCloseOnSelect
                      disabled={
                        isApiSourceColumnsLoading ||
                        !apiSourceColumns ||
                        apiSourceColumns.length < 1
                      }
                      options={apiSourceColumns ?? []}
                      defaultValue={defaultValues.con_data?.source_data_columns ?? []}
                      onChange={(_, data) => onChange(data)}
                      renderOption={(autocompleteProps, option, { selected }) => (
                        <li {...autocompleteProps}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                            checkedIcon={<CheckBox />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option}
                        </li>
                      )}
                      renderInput={({ InputLabelProps, ...params }) => (
                        <TextField
                          {...params}
                          {...field}
                          inputRef={ref}
                          label={
                            <span style={{ display: 'flex', gap: '5px' }}>
                              {translate('Columns')}
                              <Typography sx={{ color: theme.palette.text.disabled }}>
                                ({translate('leave empty to select all')})
                              </Typography>
                            </span>
                          }
                          placeholder={translate('Columns')}
                          error={!!errors.con_data?.source_data_columns}
                          helperText={errors.con_data?.source_data_columns?.message}
                        />
                      )}
                    />
                  </Tooltip>
                )}
              />
              <LoadingButton
                onClick={getColumns}
                variant="outlined.icon"
                sx={{ alignSelf: 'flex-end' }}
                loading={isApiSourceColumnsLoading}
              >
                <RefreshRounded />
              </LoadingButton>
            </Box>
            <Box component="div">
              <TextField
                label={`${translate('Authentification type')}*`}
                {...register('con_data.auth_type', {
                  required: translate('This field is required'),
                })}
                onChange={(event) => {
                  setValue('con_data.auth_type', event?.target.value);
                  setAuthType(event.target.value);
                }}
                value={authType ?? ''}
                helperText={errors.con_data?.auth_type?.message}
                defaultValue={defaultValues.con_data?.auth_type}
                error={!!errors.con_data?.auth_type}
                disabled={isAuthTypesFetching || !authTypes}
                sx={{
                  width: '100%',
                }}
                select
              >
                <MenuItem value="" sx={{ display: 'none' }} />
                {authTypes &&
                  Object.keys(authTypes).map((authTypeKey) => (
                    <MenuItem key={authTypeKey} value={authTypeKey}>
                      {authTypeKey}
                    </MenuItem>
                  ))}
              </TextField>
              {authTypes && authTypes[watch('con_data.auth_type')] && (
                <Form
                  uiSchema={{
                    'ui:options': {
                      title: '',
                    },
                    'ui:submitButtonOptions': {
                      norender: true,
                    },
                  }}
                  formData={watch('con_data.auth_data') ?? undefined}
                  schema={authTypes[watch('con_data.auth_type')]}
                  validator={validator}
                  onChange={(value) => setValue('con_data.auth_data', value.formData)}
                />
              )}
            </Box>
          </FormContainer>
        </form>
      )}
    </>
  );
};
