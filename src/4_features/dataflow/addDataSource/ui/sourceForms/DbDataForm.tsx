import { Controller, useFormContext } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import {
  TextField,
  MenuItem,
  Autocomplete,
  Checkbox,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  useTheme,
  Tooltip,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, RefreshRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useTranslate, FormContainer, getErrorMessage, dbSourcesApi } from '6_shared';
import { DbConData } from '6_shared/api/dataflowV3/types';

import { ConnectionStatus } from '../ConnectionStatus';

const fieldNamesWithoutTableAndColumns: (keyof DbConData)[] = [
  'db_name',
  'db_type',
  'host',
  'password',
  'port',
  'user',
];

export const DbDataForm = () => {
  const {
    useCheckDbSourceConnectionWithoutIdMutation,
    useGetDbDriversQuery,
    useGetDbSourceTableColumnsWithoutIdMutation,
    useGetDbSourceTablesWithoutIdMutation,
  } = dbSourcesApi;
  const translate = useTranslate();
  const theme = useTheme();

  const [checked, setChecked] = useState(false);

  const {
    watch,
    control,
    trigger,
    register,
    getValues,
    formState: { errors, isValid },
  } = useFormContext<DbConData>();

  const { data: dbDrivers, isFetching: isDbDriverFetching } = useGetDbDriversQuery();
  const [getDbSourceTables, { isLoading: isDbSourceTablesLoading, data: dbSourceTables }] =
    useGetDbSourceTablesWithoutIdMutation();
  const [getDbSourceColumns, { isLoading: isDbSourceColumnsLoading, data: dbSourceColumns }] =
    useGetDbSourceTableColumnsWithoutIdMutation();
  const [
    getDbSourceDateColumns,
    { isLoading: isDbSourceDateColumnsLoading, data: dbSourceDateColumns },
  ] = useGetDbSourceTableColumnsWithoutIdMutation();
  const [checkDbConnection] = useCheckDbSourceConnectionWithoutIdMutation();

  const checkDbConnectionRequestBody = useMemo(() => {
    const requestBody: Record<string, any> = {};
    fieldNamesWithoutTableAndColumns.forEach((fieldName) => {
      requestBody[fieldName] = getValues(fieldName as keyof DbConData);
    });
    return requestBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(fieldNamesWithoutTableAndColumns)]);

  const getTables = () => {
    trigger(fieldNamesWithoutTableAndColumns);

    const { db_table, source_data_columns, ...requestBody } = getValues();
    getDbSourceTables(requestBody)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  const getTableColumns = () => {
    trigger();
    if (!isValid) return;

    const { source_data_columns, ...requestBody } = getValues();
    getDbSourceColumns(requestBody);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (checked) {
      const { source_data_columns, ...requestBody } = getValues();
      getDbSourceDateColumns({ ...requestBody, only_datetime: true });
    }
  }, [checked, getDbSourceDateColumns, getValues]);

  return (
    <FormContainer sx={{ paddingBottom: '10px' }}>
      <ConnectionStatus
        requestFn={checkDbConnection}
        requestBody={checkDbConnectionRequestBody}
        alignSelf="start"
        skipAutoCheck={watch(fieldNamesWithoutTableAndColumns).some(
          (v) => v === '' || v === undefined,
        )}
        onClick={() => trigger(fieldNamesWithoutTableAndColumns)}
      />
      <TextField
        label={`${translate('DB Type')}*`}
        {...register('db_type', { required: translate('This field is required') })}
        disabled={isDbDriverFetching}
        InputProps={{
          endAdornment: isDbDriverFetching ? (
            <CircularProgress size={20} sx={{ mr: '20px' }} />
          ) : undefined,
        }}
        helperText={errors.db_type?.message}
        defaultValue=""
        error={!!errors.db_type}
        select
      >
        <MenuItem value="" hidden />
        {dbDrivers?.map((dbDriver) => (
          <MenuItem value={dbDriver}>{dbDriver}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={`${translate('DB Name')}*`}
        {...register('db_name', { required: translate('This field is required') })}
        helperText={errors.db_name?.message}
        error={!!errors.db_name}
      />
      <TextField
        label={`${translate('Host')}*`}
        {...register('host', { required: translate('This field is required') })}
        helperText={errors.host?.message}
        error={!!errors.host}
      />
      <TextField
        label={`${translate('Port')}*`}
        {...register('port', { required: translate('This field is required') })}
        helperText={errors.port?.message}
        error={!!errors.port}
      />
      <TextField
        label={`${translate('User')}*`}
        {...register('user', { required: translate('This field is required') })}
        helperText={errors.user?.message}
        error={!!errors.user}
      />
      <TextField
        label={`${translate('Password')}*`}
        {...register('password', { required: translate('This field is required') })}
        helperText={errors.password?.message}
        error={!!errors.password}
        type="password"
      />
      <Box component="div" display="flex" gap="10px">
        <Tooltip title={translate('Press button to get table')} placement="top-end">
          <TextField
            label={`${translate('Table')}*`}
            {...register('db_table', { required: translate('This field is required') })}
            helperText={errors.db_table?.message}
            disabled={isDbSourceTablesLoading}
            InputProps={{
              endAdornment: isDbSourceTablesLoading ? (
                <CircularProgress size={20} sx={{ mr: '20px' }} />
              ) : undefined,
            }}
            error={!!errors.db_table}
            defaultValue=""
            sx={{ flex: 1 }}
            select
          >
            <MenuItem value="" sx={{ display: 'none' }} />
            {dbSourceTables?.map((table) => (
              <MenuItem value={table}>{table}</MenuItem>
            ))}
          </TextField>
        </Tooltip>
        <LoadingButton
          onClick={getTables}
          variant="outlined.icon"
          sx={{ alignSelf: 'flex-end' }}
          loading={isDbSourceTablesLoading}
          data-testid="db-data-source__refresh-tables"
        >
          <RefreshRounded />
        </LoadingButton>
      </Box>
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
                disabled={isDbSourceColumnsLoading}
                options={dbSourceColumns ?? []}
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
                          {isDbSourceColumnsLoading && <CircularProgress size={20} />}
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
          onClick={getTableColumns}
          variant="outlined.icon"
          sx={{ alignSelf: 'flex-end' }}
          loading={isDbSourceColumnsLoading}
          data-testid="db-data-source__refresh-columns"
        >
          <RefreshRounded />
        </LoadingButton>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checked={checked}
            onChange={handleCheckboxChange}
          />
        }
        label="Enable date filter"
      />

      {checked && (
        <>
          <Controller
            name="date_column"
            control={control}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                sx={{ flex: 1 }}
                disabled={isDbSourceDateColumnsLoading}
                options={dbSourceDateColumns ?? []}
                onChange={(_, data) => onChange(data)}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField
                    {...params}
                    {...field}
                    inputRef={ref}
                    label={translate('Column')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isDbSourceColumnsLoading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    placeholder={translate('Column')}
                    error={!!errors.source_data_columns}
                    helperText={errors.source_data_columns?.message}
                  />
                )}
              />
            )}
          />
          <TextField
            label={translate('Number of days ago')}
            {...register('offset', {
              required: translate('This field is required'),
              min: {
                value: 0,
                message: 'Value must be a positive number',
              },
            })}
            helperText={errors.offset?.message}
            error={!!errors.offset}
            type="number"
          />
        </>
      )}
    </FormContainer>
  );
};
