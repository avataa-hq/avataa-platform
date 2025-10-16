import { useEffect, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { LoadingButton } from '@mui/lab';
import {
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  Checkbox,
  Typography,
  CircularProgress,
  Tooltip,
  useTheme,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, RefreshRounded } from '@mui/icons-material';

import {
  useTranslate,
  FormContainer,
  getErrorMessage,
  KeyValueInput,
  apiSourcesApi,
} from '6_shared';
import { ApiConData } from '6_shared/api/dataflowV3/types';

import { ConnectionStatus } from '../ConnectionStatus';

const connectionCheckFields: (keyof ApiConData)[] = [
  'end_point',
  'method',
  'query_params',
  'body_params',
  'auth_type',
  'auth_data',
];

export const ApiDataForm = () => {
  const {
    useCheckApiSourceConnectionWithoutIdMutation,
    useGetApiAuthTypesQuery,
    useGetApiSourceColumnsWithoutIdMutation,
  } = apiSourcesApi;

  const translate = useTranslate();
  const theme = useTheme();
  const [authType, setAuthType] = useState<string>();

  const {
    watch,
    reset,
    control,
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ApiConData>();

  const { data: authTypes, isFetching: isAuthTypesFetching } = useGetApiAuthTypesQuery();
  const [getApiSourceColumns, { isLoading: isApiSourceColumnsLoading, data: apiSourceColumns }] =
    useGetApiSourceColumnsWithoutIdMutation();
  const [checkApiConnection] = useCheckApiSourceConnectionWithoutIdMutation();

  const checkApiConnectionRequestBody = useMemo(() => {
    const requestBody: Record<string, any> = {};
    connectionCheckFields.forEach((fieldName) => {
      requestBody[fieldName] = getValues(fieldName);
    });
    return requestBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(connectionCheckFields)]);

  const getColumns = () => {
    trigger(['end_point', 'auth_data']);

    const requestBody = getValues();
    getApiSourceColumns(requestBody)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  useEffect(() => {
    if (!authTypes) return;
    const authTypesKeys = Object.keys(authTypes);
    if (!getValues('auth_type') || !authType || !(authTypesKeys.length < 1)) {
      setValue('auth_type', authTypesKeys[0]);
      setAuthType(authTypesKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, authTypes, getValues, setValue]);

  return (
    <FormContainer sx={{ justifyContent: 'center' }}>
      <ConnectionStatus
        alignSelf="start"
        requestFn={checkApiConnection}
        requestBody={checkApiConnectionRequestBody}
        skipAutoCheck={
          watch(connectionCheckFields).some((v) => v === '' || v === undefined) ||
          (watch('auth_type') !== 'No Authentication' && watch('auth_data') === undefined)
        }
        onClick={() => trigger(connectionCheckFields)}
      />
      <TextField
        label={`${translate('Endpoint')}*`}
        {...register('end_point', { required: translate('This field is required') })}
        helperText={errors.end_point?.message}
        error={!!errors.end_point}
      />
      <TextField
        label={`${translate('Method')}*`}
        {...register('method', { required: translate('This field is required') })}
        defaultValue="get"
        helperText={errors.method?.message}
        error={!!errors.method}
        sx={{ flex: 1 }}
        select
      >
        <MenuItem value="get">GET</MenuItem>
        <MenuItem value="post">POST</MenuItem>
      </TextField>
      <KeyValueInput
        label={translate('Query params')}
        onChange={(value) => setValue('query_params', value)}
      />
      <KeyValueInput
        label={translate('Body params')}
        onChange={(value) => setValue('body_params', value)}
      />
      <Box component="div" display="flex" gap="10px">
        <Controller
          name="source_data_columns"
          control={control}
          render={({ field: { ref, onChange, ...field } }) => (
            <Tooltip title={translate('Press button to get columns')} placement="top-end">
              <Autocomplete
                multiple
                sx={{ flex: 1 }}
                disableCloseOnSelect
                disabled={
                  isApiSourceColumnsLoading || !apiSourceColumns || apiSourceColumns.length < 1
                }
                options={apiSourceColumns ?? []}
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
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isApiSourceColumnsLoading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    placeholder={translate('Columns')}
                    error={!!errors.source_data_columns}
                    helperText={errors.source_data_columns?.message}
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
          data-testid="api-data-source__refresh-columns"
        >
          <RefreshRounded />
        </LoadingButton>
      </Box>
      <Box component="div">
        <TextField
          label={`${translate('Authentification type')}*`}
          {...register('auth_type', { required: translate('This field is required') })}
          onChange={(event) => {
            setValue('auth_type', event?.target.value);
            setAuthType(event.target.value);
          }}
          value={authType ?? ''}
          helperText={errors.auth_type?.message}
          defaultValue=""
          error={!!errors.auth_type}
          disabled={isAuthTypesFetching || !authTypes}
          InputProps={{
            endAdornment: isAuthTypesFetching ? (
              <CircularProgress size={20} sx={{ mr: '20px' }} />
            ) : undefined,
          }}
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
        {authTypes && authTypes[watch('auth_type')] && (
          <Form
            uiSchema={{
              'ui:options': {
                title: '',
              },
              'ui:submitButtonOptions': {
                norender: true,
              },
            }}
            formData={watch('auth_data') ?? undefined}
            schema={authTypes[watch('auth_type')]}
            validator={validator}
            onChange={(value) => setValue('auth_data', value.formData)}
          />
        )}
      </Box>
    </FormContainer>
  );
};
