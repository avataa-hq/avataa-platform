import { BaseSyntheticEvent, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  Box,
  Typography,
  MenuItem,
  Link,
  Breadcrumbs,
  useTheme,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  RefreshRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

import {
  useTranslate,
  FormContainer,
  dataflowGroupsApi,
  fileSftpSourcesApi,
  ErrorPage,
  LoadingAvataa,
  getErrorMessage,
} from '6_shared';
import { FileConData } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

import { ConnectionStatus } from '../addDataSource/ui/ConnectionStatus';

export interface EditFileSftpInputs {
  name: string;
  group_id: number;
  con_data: FileConData & { current_dir: string };
}

type EditFileSftpFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: EditFileSftpInputs, event?: BaseSyntheticEvent) => void;
  onManageGroupsClick?: MouseEventHandler<HTMLButtonElement>;
  defaultValues: Subset<EditFileSftpInputs>;
};

const connectionCheckFields = [
  'con_data.host',
  'con_data.login',
  'con_data.password',
  'con_data.port',
  'con_data.file',
] as const;

export const EditFileSftpForm = ({
  onManageGroupsClick,
  defaultValues,
  onSubmit: onExternalSubmit,
  ...props
}: EditFileSftpFormProps) => {
  const { useGetAllGroupsQuery } = dataflowGroupsApi;
  const {
    useCheckFileSftpSourceConnectionWithoutIdMutation,
    useGetFileAndDirectoriesFromSftpSourcePathWithoutIdMutation,
    useGetFileSftpSourceColumnsWithoutIdMutation,
  } = fileSftpSourcesApi;

  const translate = useTranslate();
  const theme = useTheme();
  const [dirs, setDirs] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const {
    reset,
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditFileSftpInputs>({ defaultValues, mode: 'onChange' });

  const [checkSftpConnection] = useCheckFileSftpSourceConnectionWithoutIdMutation();
  const [getDirsAndFiles, { isLoading: isDirsAndFilesLoading, data: dirsAndFiles }] =
    useGetFileAndDirectoriesFromSftpSourcePathWithoutIdMutation();
  const [getFileSftpColumns, { isLoading: isFileSftpColumnsLoading, data: fileSftpColumns }] =
    useGetFileSftpSourceColumnsWithoutIdMutation();

  const checkSftpConnectionRequestBody = useMemo(() => {
    const requestBody: Record<string, any> = {};
    connectionCheckFields.forEach((fieldName) => {
      requestBody[fieldName.split('.')[1]] = getValues(fieldName);
    });

    const reqBody = {
      ...requestBody,
      file: {
        // file_name: requestBody.file.file_name,
        file_path: '/',
      },
    };
    return reqBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(connectionCheckFields)]);

  const listDir = async (filePath?: string) => {
    await trigger(connectionCheckFields);
    if (!isValid) return null;

    const { import_type, source_data_columns, current_dir, file, ...requestBody } =
      getValues('con_data');
    return getDirsAndFiles({
      ...requestBody,
      file: {
        file_path: filePath ?? getValues('con_data.file.file_path'),
      },
      // file_path: filePath ?? getValues('con_data.file.file_path'),
    })
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  const getColumns = () => {
    trigger([...connectionCheckFields, 'con_data.current_dir']);
    if (!isValid) return;

    try {
      const { import_type, source_data_columns, current_dir, ...requestBody } =
        getValues('con_data');

      getFileSftpColumns(requestBody);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const watchFileName = watch('con_data.file.file_name');

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();

  const onSubmit: SubmitHandler<EditFileSftpInputs> = (data, event) => {
    onExternalSubmit?.(data, event);
  };

  useEffect(() => {
    try {
      const { import_type, source_data_columns, current_dir, ...requestBody } =
        getValues('con_data');
      getFileSftpColumns(requestBody);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [getFileSftpColumns, getValues]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      {!isGroupsFetching && isGroupsError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          />
        </Box>
      )}
      {isGroupsFetching && !isGroupsError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <LoadingAvataa />
        </Box>
      )}
      {!isGroupsFetching && !isGroupsError && (
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
                validate: (value) => {
                  if (!value.trim()) {
                    return translate('This field is required');
                  }
                  return true;
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
                {groups?.map((group) => (
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
              requestBody={checkSftpConnectionRequestBody}
              requestFn={checkSftpConnection}
              skipAutoCheck={watch(connectionCheckFields).some((v) => v === '' || v === undefined)}
              onClick={() => trigger(connectionCheckFields)}
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
              label={`${translate('Login')}*`}
              {...register('con_data.login', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.login}
              helperText={errors.con_data?.login?.message}
              error={!!errors.con_data?.login}
            />
            <TextField
              type="password"
              label={`${translate('Password')}*`}
              {...register('con_data.password', { required: translate('This field is required') })}
              defaultValue={defaultValues.con_data?.password}
              helperText={errors.con_data?.password?.message}
              error={!!errors.con_data?.password}
            />
            <Box component="div" display="flex" gap="10px">
              <Controller
                name="con_data.current_dir"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...params } }) => (
                  <Tooltip
                    title={translate('Press button to get directories and files')}
                    placement="top-end"
                  >
                    <TextField
                      {...params}
                      inputRef={ref}
                      defaultValue={defaultValues.con_data?.current_dir ?? ''}
                      error={!!errors.con_data?.current_dir}
                      helperText={errors.con_data?.current_dir?.message}
                      label={`${translate('Directories and files')}*`}
                      onChange={async (event) => {
                        try {
                          await listDir(
                            (getValues('con_data.file.file_path') ?? '').concat(
                              '/',
                              event.target.value,
                            ),
                          );
                          setValue('con_data.current_dir', '');
                          setDirs((prevState) => {
                            const newState = [...prevState, event.target.value];
                            setValue('con_data.file.file_path', newState.join('/'));
                            return newState;
                          });
                          setValue('con_data.source_data_columns', []);
                          setValue('con_data.file.file_name', '');
                        } catch (error) {
                          setValue('con_data.file.file_name', event.target.value);
                          console.error(error);
                          setValue('con_data.source_data_columns', []);
                        }
                      }}
                      sx={{ flex: 1 }}
                      disabled={isDirsAndFilesLoading || !dirsAndFiles || dirsAndFiles.length < 1}
                      select
                    >
                      <MenuItem value="" sx={{ display: 'none' }} />
                      {dirsAndFiles?.map((name) => (
                        <MenuItem value={name}>{name}</MenuItem>
                      ))}
                    </TextField>
                  </Tooltip>
                )}
              />

              <LoadingButton
                onClick={() => listDir()}
                variant="outlined.icon"
                sx={{ alignSelf: 'flex-end' }}
                loading={isDirsAndFilesLoading}
              >
                <RefreshRounded />
              </LoadingButton>
            </Box>
            <Breadcrumbs>
              {['root', ...dirs].map((dir, dirIndex) => (
                <Link
                  underline="hover"
                  color="inherit"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setDirs((prevState) => {
                      const newState = prevState.slice(0, dirIndex);
                      const newFilePath = newState.join('/');
                      listDir(newFilePath);
                      setValue('con_data.file.file_path', newFilePath);
                      return newState;
                    });
                    setValue('con_data.file.file_name', '');
                    setValue('con_data.current_dir', '');
                    setValue('con_data.source_data_columns', []);
                  }}
                >
                  {dir}
                </Link>
              ))}
              {watchFileName && (
                <Link underline="none" color="text.primary">
                  {watchFileName}
                </Link>
              )}
            </Breadcrumbs>
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
                      value={watch('con_data.source_data_columns') ?? []}
                      disabled={
                        isFileSftpColumnsLoading || !fileSftpColumns || fileSftpColumns.length < 1
                      }
                      options={fileSftpColumns ?? []}
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
                loading={isFileSftpColumnsLoading}
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
              <TextField
                label={translate('Number of days ago')}
                {...register('con_data.file.offset', {
                  required: translate('This field is required'),
                  min: {
                    value: 0,
                    message: 'Value must be a positive number',
                  },
                })}
                helperText={errors.con_data?.file?.offset?.message}
                error={!!errors.con_data?.file?.offset}
                type="number"
                defaultValue={defaultValues.con_data?.file?.offset}
              />
            )}
          </FormContainer>
        </form>
      )}
    </>
  );
};
