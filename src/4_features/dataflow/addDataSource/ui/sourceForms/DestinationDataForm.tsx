import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { RefreshRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { CreateDestinationsRequest, SftpDestinationConData } from '6_shared/api/dataflowV3/types';
import { useTranslate, FormContainer, remoteDestinationsApi } from '6_shared';

import { ConnectionStatus } from '../ConnectionStatus';

const connectionCheckFields: (keyof SftpDestinationConData)[] = [
  'host',
  'login',
  'password',
  'path',
  'port',
];

export const DestinationDataForm = ({ type = 'SFTP' }: { type: 'SFTP' }) => {
  const { useCheckConnectionMutation, useGetListOfDirsAndFilesMutation } = remoteDestinationsApi;

  const translate = useTranslate();
  const [dirs, setDirs] = useState<string[]>([]);

  const {
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,

    formState: { errors, isValid },
  } = useFormContext<CreateDestinationsRequest & { current_dir: string; file_name: string }>();

  const [checkSftpConnection] = useCheckConnectionMutation();
  const [getSftpDirsAndFiles, { isLoading: isSftpDirsAndFilesLoading, data: sftpDirsAndFiles }] =
    useGetListOfDirsAndFilesMutation();

  const formFunctions = {
    SFTP: {
      checkConnection: checkSftpConnection,
      getDirsAndFiles: getSftpDirsAndFiles,
      isDirsAndFilesLoading: isSftpDirsAndFilesLoading,
      dirsAndFiles: sftpDirsAndFiles,
    },
  };
  const { checkConnection, getDirsAndFiles, isDirsAndFilesLoading, dirsAndFiles } =
    formFunctions[type];

  const checkConnectionRequestBody = useMemo(() => {
    const conData: Record<string, any> = {};
    connectionCheckFields.forEach((fieldName) => {
      conData[fieldName] = getValues(`con_data.${fieldName}`);
    });

    const requestBody = {
      con_type: type,
      con_data: conData,
    };
    return requestBody as CreateDestinationsRequest;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch(['con_data.host', 'con_data.login', 'con_data.password', 'con_data.port'])]);

  const listDir = (filePath?: string) => {
    trigger(['con_data.host', 'con_data.login', 'con_data.password', 'con_data.port']);
    if (!isValid) return null;
    const { con_type, con_data, file_name } = getValues();
    return getDirsAndFiles({
      con_type,
      con_data: {
        ...con_data,
        path: filePath && file_name ? `${filePath}/${file_name}` : getValues('con_data.path'),
      },
    }).unwrap();
  };

  // const getColumns = () => {
  // trigger([...connectionCheckFields, 'current_dir']);
  // if (!isValid) return;
  // const { host, login, password, port, file } = getValues();
  // const requestBody = {
  //   host,
  //   login,
  //   password,
  //   port,
  //   file,
  // };
  // getFileColumns(requestBody);
  // };

  // const watchFileName = watch('file.file_name');

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked);
  // };

  // useEffect(() => {
  //   setValue('con_type', type);
  //   setValue('con_data.path', '/');
  // }, [setValue, type]);

  // useEffect(() => {
  //   if (checked && fileName !== '') {
  //     const pattern = detectDatePattern(fileName);
  //     const newFileName = replaceDateWithPattern(fileName, pattern);

  //     setValue('con_data.file_name', newFileName);
  //     setValue('file.date_pattern', pattern);
  //   }

  //   if (!checked && fileName !== '') {
  //     setValue('file.file_name', fileName);
  //     unregister('file.offset');
  //   }
  // }, [detectDatePattern, setValue, checked, replaceDateWithPattern, fileName, unregister]);

  return (
    <FormContainer sx={{ justifyContent: 'center', paddingBottom: '10px' }}>
      <ConnectionStatus
        requestBody={checkConnectionRequestBody}
        requestFn={checkConnection}
        skipAutoCheck={watch([
          'con_data.host',
          'con_data.login',
          'con_data.password',
          'con_data.port',
        ]).some((v) => v === '' || v === undefined)}
        onClick={() =>
          trigger(['con_data.host', 'con_data.login', 'con_data.password', 'con_data.port'])
        }
      />
      <TextField
        label={`${translate('Host')}*`}
        {...register('con_data.host', { required: translate('This field is required') })}
        helperText={errors.con_data?.host?.message}
        error={!!errors.con_data?.host}
      />
      <TextField
        label={`${translate('Port')}*`}
        {...register('con_data.port', { required: translate('This field is required') })}
        helperText={errors.con_data?.port?.message}
        error={!!errors.con_data?.port}
      />
      <TextField
        label={`${translate('Login')}*`}
        {...register('con_data.login', { required: translate('This field is required') })}
        helperText={errors.con_data?.login?.message}
        error={!!errors.con_data?.login}
      />
      <TextField
        type="password"
        label={`${translate('Password')}*`}
        {...register('con_data.password', { required: translate('This field is required') })}
        helperText={errors.con_data?.password?.message}
        error={!!errors.con_data?.password}
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
                      setValue('con_data.path', newState.join('/'));
                      return newState;
                    });
                    // setValue('source_data_columns', []);
                    // setValue('file.file_name', '');
                  } catch (error) {
                    // setValue('file.file_name', event.target.value);
                    // setFileName(event.target.value);
                    console.error(error);
                    // setValue('source_data_columns', []);
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
                setValue('con_data.path', newFilePath);
                return newState;
              });
              // setValue('file.file_name', '');
              setValue('current_dir', '');
              // setValue('source_data_columns', []);
            }}
          >
            {dir}
          </Link>
        ))}
        {/* {watchFileName && (
          <Link underline="none" color="text.primary">
            {watchFileName}
          </Link>
        )} */}
      </Breadcrumbs>

      <TextField
        label={`${translate('File name')}*`}
        {...register('file_name', { required: translate('This field is required') })}
        helperText={errors.file_name?.message}
        error={!!errors.file_name}
      />

      {/* <Box component="div" display="flex" gap="10px">
        <Controller
          name="source_data_columns"
          control={control}
          defaultValue={[]}
          render={({ field: { ref, onChange, ...field } }) => (
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
          )}
        />
        <LoadingButton
          onClick={getColumns}
          variant="outlined.icon"
          sx={{ alignSelf: 'flex-end' }}
          loading={isFileColumnsLoading}
        >
          <RefreshRounded />
        </LoadingButton>
      </Box> */}
    </FormContainer>
  );
};
