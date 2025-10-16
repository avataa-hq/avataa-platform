import { useMemo, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { CheckBox, CheckBoxOutlineBlank, RefreshRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { FileConData, IFileConData } from '6_shared/api/dataflowV3/types';
import { useTranslate, FormContainer, fileSftpSourcesApi, fileFtpSourcesApi } from '6_shared';

import { ConnectionStatus } from '../ConnectionStatus';
import { useDatePattern } from '../../hooks/useDatePattern';

const connectionCheckFields: (keyof FileConData)[] = ['host', 'login', 'password', 'port', 'file'];

export const FileDataForm = ({ type = 'SFTP' }: { type: 'SFTP' | 'FTP' }) => {
  const {
    useCheckFileSftpSourceConnectionWithoutIdMutation,
    useGetFileAndDirectoriesFromSftpSourcePathWithoutIdMutation,
    useGetFileSftpSourceColumnsWithoutIdMutation,
  } = fileSftpSourcesApi;

  const {
    useCheckFileFtpSourceConnectionWithoutIdMutation,
    useGetFileAndDirectoriesFromFtpSourcePathWithoutIdMutation,
    useGetFileFtpSourceColumnsWithoutIdMutation,
  } = fileFtpSourcesApi;

  const translate = useTranslate();
  const theme = useTheme();
  const [dirs, setDirs] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const { detectDatePattern, replaceDateWithPattern } = useDatePattern();

  const {
    watch,
    control,
    trigger,
    register,
    setValue,
    setError,
    clearErrors,
    getValues,
    unregister,
    formState: { errors, isValid },
  } = useFormContext<
    FileConData & { current_dir: string; file_path: string; file_name: string; file: IFileConData }
  >();

  const [checkSftpConnection] = useCheckFileSftpSourceConnectionWithoutIdMutation();
  const [getSftpDirsAndFiles, { isLoading: isSftpDirsAndFilesLoading, data: sftpDirsAndFiles }] =
    useGetFileAndDirectoriesFromSftpSourcePathWithoutIdMutation();
  const [getFileSftpColumns, { isLoading: isFileSftpColumnsLoading, data: fileSftpColumns }] =
    useGetFileSftpSourceColumnsWithoutIdMutation();

  const [checkFtpConnection] = useCheckFileFtpSourceConnectionWithoutIdMutation();
  const [getFtpDirsAndFiles, { isLoading: isFtpDirsAndFilesLoading, data: ftpDirsAndFiles }] =
    useGetFileAndDirectoriesFromFtpSourcePathWithoutIdMutation();
  const [getFileFtpColumns, { isLoading: isFileFtpColumnsLoading, data: fileFtpColumns }] =
    useGetFileFtpSourceColumnsWithoutIdMutation();

  const formFunctions = {
    FTP: {
      checkConnection: checkFtpConnection,
      getDirsAndFiles: getFtpDirsAndFiles,
      isDirsAndFilesLoading: isFtpDirsAndFilesLoading,
      dirsAndFiles: ftpDirsAndFiles,
      getFileColumns: getFileFtpColumns,
      isFileColumnsLoading: isFileFtpColumnsLoading,
      fileColumns: fileFtpColumns,
    },
    SFTP: {
      checkConnection: checkSftpConnection,
      getDirsAndFiles: getSftpDirsAndFiles,
      isDirsAndFilesLoading: isSftpDirsAndFilesLoading,
      dirsAndFiles: sftpDirsAndFiles,
      getFileColumns: getFileSftpColumns,
      isFileColumnsLoading: isFileSftpColumnsLoading,
      fileColumns: fileSftpColumns,
    },
  };
  const {
    checkConnection,
    getDirsAndFiles,
    isDirsAndFilesLoading,
    dirsAndFiles,
    getFileColumns,
    isFileColumnsLoading,
    fileColumns,
  } = formFunctions[type];

  const checkConnectionRequestBody = useMemo(() => {
    const requestBody: Record<string, any> = {};
    connectionCheckFields.forEach((fieldName) => {
      requestBody[fieldName] = getValues(fieldName);
    });
    return requestBody;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(connectionCheckFields)]);

  const listDir = (filePath?: string) => {
    trigger(connectionCheckFields);
    if (!isValid) return null;

    const { import_type, source_data_columns, current_dir, ...requestBody } = getValues();
    return getDirsAndFiles({
      ...requestBody,
      file: {
        file_path: filePath ?? getValues('file.file_path'),
      },
    }).unwrap();
  };

  const getColumns = () => {
    if (!fileName) {
      enqueueSnackbar('The file must be selected', {
        variant: 'warning',
      });
      return;
    }
    trigger([...connectionCheckFields, 'current_dir']);
    if (!isValid) return;

    const { host, login, password, port, file } = getValues();

    const requestBody = {
      host,
      login,
      password,
      port,
      file: {
        file_path: file.file_path,
        file_name: fileName,
      },
    };

    getFileColumns(requestBody);
  };

  const watchFileName = watch('file.file_name');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (!fileName) {
      setError('file.file_name', {
        type: 'required',
        message: translate('This field is required'),
      });
    } else {
      clearErrors('file.file_name');
    }
  }, [clearErrors, fileName, setError, translate]);

  useEffect(() => {
    if (checked && fileName !== '') {
      const pattern = detectDatePattern(fileName);
      const newFileName = replaceDateWithPattern(fileName, pattern);

      setValue('file.file_name', newFileName);
      setValue('file.date_pattern', pattern);
    }

    if (!checked && fileName !== '') {
      setValue('file.file_name', fileName);
      unregister('file.offset');
    }
  }, [detectDatePattern, setValue, checked, replaceDateWithPattern, fileName, unregister]);

  return (
    <FormContainer sx={{ justifyContent: 'center', paddingBottom: '10px' }}>
      <ConnectionStatus
        requestBody={checkConnectionRequestBody}
        requestFn={checkConnection}
        skipAutoCheck={watch(connectionCheckFields).some((v) => v === '' || v === undefined)}
        onClick={() => trigger(connectionCheckFields)}
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
        label={`${translate('Login')}*`}
        {...register('login', { required: translate('This field is required') })}
        helperText={errors.login?.message}
        error={!!errors.login}
      />
      <TextField
        type="password"
        label={`${translate('Password')}*`}
        {...register('password', { required: translate('This field is required') })}
        helperText={errors.password?.message}
        error={!!errors.password}
      />
      <Box component="div" display="flex" gap="10px">
        <Controller
          name="current_dir"
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
                error={!!errors.current_dir}
                helperText={errors.current_dir?.message}
                label={`${translate('Directories and files')}*`}
                onChange={async (event) => {
                  try {
                    // await listDir(getValues('file_path').concat('/', event.target.value));
                    await listDir(dirs.concat('/', event.target.value).join(''));
                    setValue('current_dir', '');
                    setDirs((prevState) => {
                      const newState = [...prevState, event.target.value];
                      setValue('file.file_path', newState.join('/'));
                      return newState;
                    });
                    setValue('source_data_columns', []);
                    setValue('file.file_name', '');
                  } catch (error) {
                    setValue('file.file_name', event.target.value);
                    setFileName(event.target.value);
                    console.error(error);
                    setValue('source_data_columns', []);
                  }
                }}
                defaultValue=""
                sx={{ flex: 1 }}
                disabled={isDirsAndFilesLoading || !dirsAndFiles || dirsAndFiles.length < 1}
                InputProps={{
                  endAdornment: isDirsAndFilesLoading ? (
                    <CircularProgress size={20} sx={{ mr: '20px' }} />
                  ) : undefined,
                }}
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
          data-testid="file-data-source__refresh-files"
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
                setValue('file.file_path', newFilePath);
                return newState;
              });
              setValue('file.file_name', '');
              setValue('current_dir', '');
              setValue('source_data_columns', []);
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
          name="source_data_columns"
          control={control}
          defaultValue={[]}
          render={({ field: { ref, onChange, ...field } }) => (
            <Tooltip title={translate('Press button to get columns')} placement="top-end">
              <Autocomplete
                multiple
                sx={{ flex: 1 }}
                disableCloseOnSelect
                value={watch('source_data_columns')}
                disabled={isFileColumnsLoading || !fileColumns || fileColumns.length < 1}
                options={fileColumns ?? []}
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
                          {isFileColumnsLoading && <CircularProgress size={20} />}
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
          loading={isFileColumnsLoading}
          data-testid="file-data-source__refresh-columns"
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
          {...register('file.offset', {
            required: translate('This field is required'),
            min: {
              value: 0,
              message: 'Value must be a positive number',
            },
          })}
          helperText={errors.file?.offset?.message}
          error={!!errors.file?.offset}
          type="number"
          defaultValue={0}
        />
      )}
    </FormContainer>
  );
};
