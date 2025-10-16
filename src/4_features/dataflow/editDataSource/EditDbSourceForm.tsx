import { BaseSyntheticEvent, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControlLabel,
  useTheme,
  CircularProgress,
  Tooltip,
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
  dbSourcesApi,
  ErrorPage,
  LoadingAvataa,
} from '6_shared';
import { DbConData } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

import { ConnectionStatus } from '../addDataSource/ui/ConnectionStatus';

export interface EditDbSourceInputs {
  name: string;
  group_id: number;
  con_data: DbConData;
}

type EditDbSourceFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: EditDbSourceInputs, event?: BaseSyntheticEvent) => void;
  onManageGroupsClick?: MouseEventHandler<HTMLButtonElement>;
  defaultValues: Subset<EditDbSourceInputs>;
};

const fieldNamesWithoutTableAndColumns = [
  'con_data.db_name',
  'con_data.db_type',
  'con_data.host',
  'con_data.password',
  'con_data.port',
  'con_data.user',
  'con_data.date_column',
  'con_data.offset',
] as const;

export const EditDbSourceForm = ({
  onManageGroupsClick,
  defaultValues,
  onSubmit: onExternalSubmit,
  ...props
}: EditDbSourceFormProps) => {
  const { useGetAllGroupsQuery } = dataflowGroupsApi;
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
    reset,
    watch,
    control,
    trigger,
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditDbSourceInputs>({ defaultValues, mode: 'onChange' });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();

  const onSubmit: SubmitHandler<EditDbSourceInputs> = (data, event) => {
    onExternalSubmit?.(data, event);
  };

  const {
    data: dbDrivers,
    isFetching: isDbDriverFetching,
    isError: isDbDriverError,
  } = useGetDbDriversQuery();
  const [getDbSourceTables, { isLoading: isDbSourceTablesLoading, data: dbSourceTables }] =
    useGetDbSourceTablesWithoutIdMutation();
  const [getDbSourceColumns, { isLoading: isDbSourceColumnsLoading, data: dbSourceColumns }] =
    useGetDbSourceTableColumnsWithoutIdMutation();
  const [checkDbConnection] = useCheckDbSourceConnectionWithoutIdMutation();
  const [
    getDbSourceDateColumns,
    { isLoading: isDbSourceDateColumnsLoading, data: dbSourceDateColumns },
  ] = useGetDbSourceTableColumnsWithoutIdMutation();

  const isLoading = isGroupsFetching || isDbDriverFetching;
  const isError = isGroupsError || isDbDriverError;

  const checkDbConnectionRequestBody = useMemo(() => {
    const { db_table, source_data_columns, ...requestBody } = getValues('con_data');
    return requestBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(fieldNamesWithoutTableAndColumns)]);

  const getTables = async () => {
    await trigger(fieldNamesWithoutTableAndColumns);

    const { db_table, source_data_columns, ...requestBody } = getValues('con_data');
    getDbSourceTables(requestBody)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  const getTableColumns = async () => {
    await trigger();
    if (!isValid) return;

    try {
      const { source_data_columns, ...requestBody } = getValues('con_data');
      getDbSourceColumns(requestBody);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { db_table, source_data_columns, ...requestBody } = getValues('con_data');
        await getDbSourceTables(requestBody);

        await getDbSourceColumns({ ...requestBody, db_table });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    };

    fetchInitialData();
  }, [getDbSourceColumns, getDbSourceTables, getValues]);

  useEffect(() => {
    if (checked) {
      try {
        const { source_data_columns, ...requestBody } = getValues('con_data');
        getDbSourceDateColumns({ ...requestBody, only_datetime: true });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    }
  }, [checked, getDbSourceDateColumns, getValues]);

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
              {...register('con_data.db_type', { required: translate('This field is required') })}
              disabled={isDbDriverFetching}
              helperText={errors.con_data?.db_type?.message}
              defaultValue={defaultValues.con_data?.db_type}
              error={!!errors.con_data?.db_type}
              select
            >
              <MenuItem value="" sx={{ display: 'none' }} />
              {dbDrivers?.map((dbDriver) => (
                <MenuItem value={dbDriver}>{dbDriver}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={`${translate('DB Name')}*`}
              {...register('con_data.db_name', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.db_name}
              helperText={errors.con_data?.db_type?.message}
              error={!!errors.con_data?.db_type}
            />
            <TextField
              label={`${translate('Host')}*`}
              {...register('con_data.host', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.host}
              helperText={errors.con_data?.host?.message}
              error={!!errors.con_data?.host}
            />
            <TextField
              label={`${translate('Port')}*`}
              {...register('con_data.port', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.port}
              helperText={errors.con_data?.port?.message}
              error={!!errors.con_data?.port}
            />
            <TextField
              label={`${translate('User')}*`}
              {...register('con_data.user', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.user}
              helperText={errors.con_data?.user?.message}
              error={!!errors.con_data?.user}
            />
            <TextField
              label={`${translate('Password')}*`}
              {...register('con_data.password', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.password}
              helperText={errors.con_data?.password?.message}
              error={!!errors.con_data?.password}
              type="password"
            />
            <Box component="div" display="flex" gap="10px">
              <Tooltip title={translate('Press button to get table')} placement="top-end">
                <TextField
                  label={`${translate('Table')}*`}
                  {...register('con_data.db_table', {
                    required: translate('This field is required'),
                  })}
                  defaultValue={defaultValues.con_data?.db_table}
                  helperText={errors.con_data?.db_table?.message}
                  disabled={isDbSourceTablesLoading}
                  error={!!errors.con_data?.db_table}
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
              >
                <RefreshRounded />
              </LoadingButton>
            </Box>
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
                      disabled={isDbSourceColumnsLoading}
                      options={dbSourceColumns ?? []}
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
                onClick={getTableColumns}
                variant="outlined.icon"
                sx={{ alignSelf: 'flex-end' }}
                loading={isDbSourceColumnsLoading}
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
                  name="con_data.date_column"
                  control={control}
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      sx={{ flex: 1 }}
                      disabled={isDbSourceDateColumnsLoading}
                      options={dbSourceDateColumns ?? []}
                      defaultValue={defaultValues.con_data?.date_column ?? ''}
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
                          error={!!errors.con_data?.date_column}
                          helperText={errors.con_data?.date_column?.message}
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  label={translate('Number of days ago')}
                  {...register('con_data.offset', {
                    required: translate('This field is required'),
                    min: {
                      value: 0,
                      message: 'Value must be a positive number',
                    },
                  })}
                  helperText={errors.con_data?.offset?.message}
                  error={!!errors.con_data?.offset}
                  type="number"
                  defaultValue={defaultValues.con_data?.offset}
                />
              </>
            )}
          </FormContainer>
        </form>
      )}
    </>
  );
};
