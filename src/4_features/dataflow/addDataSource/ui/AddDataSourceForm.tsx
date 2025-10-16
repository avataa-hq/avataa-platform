import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormEvent, MouseEventHandler, useEffect, useState } from 'react';
import { TextField, MenuItem, Divider, Box, Button, CircularProgress } from '@mui/material';
import { SettingsRounded } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';

import {
  useTranslate,
  FormContainer,
  apiSourcesApi,
  fileManualSourcesApi,
  dbSourcesApi,
  fileSftpSourcesApi,
  sourcesApi,
  fileSourcesApi,
  dataflowGroupsApi,
  ErrorPage,
  LoadingAvataa,
} from '6_shared';
import {
  ApiConData,
  ConType,
  DbConData,
  FileImportType,
  FileConData,
  Source,
} from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

import { DropFileBox } from './DropFileBox';
import { DbDataForm } from './sourceForms/DbDataForm';
import { ApiDataForm } from './sourceForms/ApiDataForm';
import { FileDataForm } from './sourceForms/FileDataForm';
import { FileManualDataForm, FileManualInputs } from './sourceForms/FileManualDataForm';

const defaultValues: Subset<Source> = {
  con_type: 'DB',
  con_data: {
    import_type: '',
  },
};

const apiFormDefaultValues: Subset<ApiConData> = {
  method: 'get',
  auth_type: '',
  query_params: {},
  body_params: {},
};

const dbFormDefaultValues: Subset<DbConData> = {
  db_type: '',
  db_table: '',
};

const fileSftpFormDefaultValues: Subset<FileConData> = {
  file: {
    file_path: '/',
  },
};

const fileFtpFormDefaultValues: Subset<FileConData> = {
  // file_path: '/',
  file: {
    file_path: '/',
  },
};

type AddDataSourceFormProps = JSX.IntrinsicElements['form'] & {
  onManageGroupsClick: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: (
    func: (e?: React.BaseSyntheticEvent<any> | undefined) => Promise<any>,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;
};

export const AddDataSourceForm = ({
  onManageGroupsClick,
  handleSubmit: handleExternalSubmit,
  ...props
}: AddDataSourceFormProps) => {
  const { useCreateApiSourceMutation } = apiSourcesApi;
  const { useCreateFileManualSourceMutation } = fileManualSourcesApi;
  const { useCreateFileSftpSourceMutation } = fileSftpSourcesApi;
  const { useCreateDbSourceMutation } = dbSourcesApi;
  const { useGetConTypesQuery, useLoadSourceDataMutation } = sourcesApi;
  const { useGetAllGroupsQuery } = dataflowGroupsApi;
  const { useGetFileSourcesExtensionsQuery, useGetFileSourcesTypesQuery } = fileSourcesApi;

  const translate = useTranslate();
  const [conType, setConType] = useState<ConType>('DB');
  const [fileImportType, setFileImportType] = useState<FileImportType>('SFTP');

  const {
    reset,
    watch,
    trigger,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Omit<Source, 'id'>>({ defaultValues });

  const dbForm = useForm<DbConData>({ defaultValues: dbFormDefaultValues });
  const fileSftpForm = useForm<FileConData & { current_dir: string }>({
    defaultValues: fileSftpFormDefaultValues,
  });
  const fileFtpForm = useForm<FileConData & { current_dir: string }>({
    defaultValues: fileFtpFormDefaultValues,
  });
  const fileManualForm = useForm<FileManualInputs>();
  const apiForm = useForm<ApiConData>({ defaultValues: apiFormDefaultValues });

  const watchConType = watch('con_type');

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();
  const {
    data: conTypes,
    isFetching: isConTypesFetching,
    isError: isConTypesError,
  } = useGetConTypesQuery();
  const {
    data: fileImportTypes,
    isFetching: isFileImportTypesFetching,
    isError: isFileImportTypesError,
  } = useGetFileSourcesTypesQuery();
  const {
    data: fileExtensions,
    isFetching: isFileExtensionsFetching,
    isError: isFileExtensionsError,
  } = useGetFileSourcesExtensionsQuery();

  const isLoading =
    isConTypesFetching || isGroupsFetching || isFileImportTypesFetching || isFileExtensionsFetching;
  const isError =
    isGroupsError || isConTypesError || isFileImportTypesError || isFileExtensionsError;

  const [{ isHovering }, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    collect: (monitor) => ({
      isHovering: monitor.isOver(),
    }),
    drop({ files }: any) {
      const fileExtensionRegex = new RegExp(`\\.(${fileExtensions?.join('|') ?? 'xlsx'})$`);

      if (files.length === 1 && files[0] && fileExtensionRegex.test(files[0].name)) {
        setValue('con_type', 'File');
        setConType('File');
        setValue('con_data.import_type', 'Manual');
        setFileImportType('Manual');
        fileManualForm.setValue('file', files[0]);
      } else {
        enqueueSnackbar(
          `${translate('The file must be of extension')}: ${fileExtensions?.join()}`,
          { variant: 'error' },
        );
      }
    },
  }));

  const [createApiSource] = useCreateApiSourceMutation();
  const [createFileSftpSource] = useCreateFileSftpSourceMutation();
  const [createFileManualSource] = useCreateFileManualSourceMutation();
  const [createDbSource] = useCreateDbSourceMutation();

  // Loads source data to the DataView
  const [loadSourceData] = useLoadSourceDataMutation();

  useEffect(() => {
    reset(defaultValues);
  }, [reset]);

  useEffect(() => {
    apiForm.reset(apiFormDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiForm.reset]);

  useEffect(() => {
    dbForm.reset(dbFormDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbForm.reset]);

  useEffect(() => {
    fileSftpForm.reset(fileSftpFormDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileSftpForm.reset]);

  useEffect(() => {
    fileFtpForm.reset(fileFtpFormDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileFtpForm.reset]);

  const onSubmit: SubmitHandler<Omit<Source, 'id'>> = async (data) => {
    if (data.con_type === 'File' && fileImportType === 'SFTP') {
      await fileSftpForm.trigger();
      if (
        !fileSftpForm.getValues('file.file_name') ||
        fileSftpForm.getValues('file.file_name') === ''
      ) {
        throw new Error('The file must be selected');
      }
      if (!fileSftpForm.formState.isValid) throw new Error(translate('The form is not valid'));
      return fileSftpForm.handleSubmit(({ current_dir, ...fileSftpData }) => {
        return (async () => {
          const response = await createFileSftpSource({
            ...data,
            name: data.name.trim(),
            con_data: fileSftpData,
          }).unwrap();
          enqueueSnackbar('Source added successfully. Loading the source to the DataView', {
            variant: 'success',
          });
          await loadSourceData(response.id).unwrap();
        })();
      })();
    }
    if (data.con_type === 'File' && fileImportType === 'Manual') {
      await fileManualForm.trigger();
      if (!fileManualForm.formState.isValid) throw new Error(translate('The form is not valid'));

      return fileManualForm.handleSubmit(async (fileManualData) => {
        const formData = new FormData();
        formData.append('name', data.name.trim());
        formData.append('group_id', data.group_id.toString());
        fileManualData.file_columns?.forEach((column) => formData.append('file_columns', column));
        formData.append('file', fileManualData.file);
        return (async () => {
          const response = await createFileManualSource(formData).unwrap();
          enqueueSnackbar('Source added successfully. Loading the source to the DataView', {
            variant: 'success',
          });
          await loadSourceData(response.id).unwrap();
        })();
      })();
    }
    if (data.con_type === 'DB') {
      await dbForm.trigger();
      if (!dbForm.formState.isValid) throw new Error(translate('The form is not valid'));

      return dbForm.handleSubmit(async (dbData) => {
        return (async () => {
          const response = await createDbSource({
            ...data,
            name: data.name.trim(),
            con_data: dbData,
          }).unwrap();
          enqueueSnackbar('Source added successfully. Loading the source to the DataView', {
            variant: 'success',
          });
          await loadSourceData(response.id).unwrap();
        })();
      })();
    }
    if (data.con_type === 'RestAPI') {
      await apiForm.trigger();
      if (!apiForm.formState.isValid) throw new Error(translate('The form is not valid'));

      return apiForm.handleSubmit(async (apiData) => {
        return (async () => {
          const response = await createApiSource({
            ...data,
            name: data.name.trim(),
            con_data: apiData,
          }).unwrap();
          enqueueSnackbar('Source added successfully. Loading the source to the DataView', {
            variant: 'success',
          });
          await loadSourceData(response.id).unwrap();
        })();
      })();
    }
    return null;
  };

  return (
    <>
      {!isLoading && isError && (
        <Box component="div" width="400px" height="200px">
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          />
        </Box>
      )}
      {isLoading && !isError && (
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="400px"
          height="200px"
        >
          <LoadingAvataa />
        </Box>
      )}
      {!isLoading && !isError && (
        <form
          style={{ display: 'flex', position: 'relative' }}
          onSubmit={async (e) => {
            e.preventDefault();
            await trigger();
            if (!isValid) {
              handleExternalSubmit(async () => {
                throw new Error(translate('The form is not valid'));
              }, e);
              return;
            }

            handleExternalSubmit(handleSubmit(onSubmit), e);
          }}
          ref={drop}
          {...props}
        >
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
                InputProps={{
                  endAdornment: isGroupsFetching ? (
                    <CircularProgress size={20} sx={{ mr: '20px' }} />
                  ) : undefined,
                }}
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
              <Button variant="outlined.icon" onClick={onManageGroupsClick}>
                <SettingsRounded />
              </Button>
            </Box>
            <TextField
              label={`${translate('Import source')}*`}
              onChange={(event) => {
                setValue('con_type', event.target.value as ConType);
                setConType(event.target.value as ConType);
              }}
              disabled={isConTypesFetching}
              defaultValue={defaultValues.con_type}
              InputProps={{
                endAdornment: isConTypesFetching ? (
                  <CircularProgress size={20} sx={{ mr: '20px' }} />
                ) : undefined,
              }}
              value={conType}
              select
            >
              <MenuItem value="DB" sx={{ display: 'none' }} />
              {conTypes?.map((cType) => (
                <MenuItem key={cType} value={cType}>
                  {cType}
                </MenuItem>
              ))}
            </TextField>
          </FormContainer>
          <Divider orientation="vertical" sx={{ mx: '0.625rem' }} flexItem />
          <FormContainer>
            {watchConType === 'DB' && (
              <FormProvider {...dbForm}>
                <DbDataForm />
              </FormProvider>
            )}
            {watchConType === 'RestAPI' && (
              <FormProvider {...apiForm}>
                <ApiDataForm />
              </FormProvider>
            )}

            {watchConType === 'File' && (
              <>
                <TextField
                  label={`${translate('Import type')}*`}
                  onChange={(event) => {
                    setValue('con_data.import_type', event.target.value as FileImportType);
                    setFileImportType(event.target.value as FileImportType);
                  }}
                  disabled={isFileImportTypesFetching}
                  InputProps={{
                    endAdornment: isFileImportTypesFetching ? (
                      <CircularProgress size={20} sx={{ mr: '20px' }} />
                    ) : undefined,
                  }}
                  defaultValue=""
                  value={fileImportType}
                  select
                >
                  <MenuItem value="SFTP" sx={{ display: 'none' }} />
                  {fileImportTypes?.map((fileImpType) => (
                    <MenuItem key={fileImpType} value={fileImpType}>
                      {fileImpType}
                    </MenuItem>
                  ))}
                </TextField>

                {fileImportType === 'SFTP' && (
                  <FormProvider {...fileSftpForm}>
                    <FileDataForm type="SFTP" />
                  </FormProvider>
                )}

                {fileImportType === 'FTP' && (
                  <FormProvider {...fileFtpForm}>
                    <FileDataForm type="FTP" />
                  </FormProvider>
                )}

                {fileImportType === 'Manual' && (
                  <FormProvider {...fileManualForm}>
                    <FileManualDataForm />
                  </FormProvider>
                )}
              </>
            )}
          </FormContainer>
          {isHovering && <DropFileBox />}
        </form>
      )}
    </>
  );
};
