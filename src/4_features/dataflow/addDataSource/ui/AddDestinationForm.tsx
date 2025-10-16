import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormEvent, MouseEventHandler, useEffect, useState } from 'react';
import { TextField, MenuItem, Divider, CircularProgress } from '@mui/material';
// import { SettingsRounded } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
// import { NativeTypes } from 'react-dnd-html5-backend';
// import { useDrop } from 'react-dnd';

import { useTranslate, FormContainer, fileSourcesApi, remoteDestinationsApi } from '6_shared';
import { FileImportType, CreateDestinationsRequest } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

// import { DropFileBox } from './DropFileBox';
import { DestinationDataForm } from './sourceForms/DestinationDataForm';

const defaultValues: Subset<CreateDestinationsRequest> = {
  con_type: 'SFTP',
};

const sftpDestinationFormDefaultValues: CreateDestinationsRequest = {
  con_type: 'SFTP',
  con_data: {
    path: '/',
    host: '',
    login: '',
    password: '',
    port: '',
  },
  name: '',
};

type AddDataSourceFormProps = JSX.IntrinsicElements['form'] & {
  onManageGroupsClick: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: (
    func: (e?: React.BaseSyntheticEvent<any> | undefined) => Promise<any>,
    event: FormEvent<HTMLFormElement>,
  ) => void;
};

export const AddDestinationForm = ({
  onManageGroupsClick,
  handleSubmit: handleExternalSubmit,
  ...props
}: AddDataSourceFormProps) => {
  const { useCreateRemoteDestinationMutation } = remoteDestinationsApi;

  const { useGetFileSourcesTypesQuery } = fileSourcesApi;

  const translate = useTranslate();
  // const [conType, setConType] = useState<ConType>('DB');
  const [fileImportType, setFileImportType] = useState<FileImportType>('SFTP');

  const {
    reset,
    trigger,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ defaultValues });

  const fileSftpDestinationForm = useForm<
    CreateDestinationsRequest & { current_dir: string; file_name: string }
  >({
    defaultValues: sftpDestinationFormDefaultValues,
  });

  const { data: fileImportTypes, isFetching: isFileImportTypesFetching } =
    useGetFileSourcesTypesQuery();
  // const { data: fileExtensions } = useGetFileSourcesExtensionsQuery();

  // const [{ isHovering }, drop] = useDrop(() => ({
  //   accept: NativeTypes.FILE,
  //   collect: (monitor) => ({
  //     isHovering: monitor.isOver(),
  //   }),
  //   drop({ files }: any) {
  //     const fileExtensionRegex = new RegExp(`\\.(${fileExtensions?.join('|') ?? 'xlsx'})$`);

  //     if (files.length === 1 && files[0] && fileExtensionRegex.test(files[0].name)) {
  //       setValue('con_type', 'File');
  //       setConType('File');
  //       setValue('con_data.import_type', 'Manual');
  //       // setFileImportType('Manual');
  //       // fileManualForm.setValue('file', files[0]);
  //     } else {
  //       enqueueSnackbar(
  //         `${translate('The file must be of extension')}: ${fileExtensions?.join()}`,
  //         { variant: 'error' },
  //       );
  //     }
  //   },
  // }));

  const [createSftpDestination] = useCreateRemoteDestinationMutation();

  useEffect(() => {
    reset(defaultValues);
  }, [reset]);

  useEffect(() => {
    fileSftpDestinationForm.reset(sftpDestinationFormDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileSftpDestinationForm.reset]);

  const onSubmit: SubmitHandler<CreateDestinationsRequest> = async (data) => {
    if (data.con_type === 'SFTP') {
      return fileSftpDestinationForm.handleSubmit(
        ({ current_dir, file_name, ...sftpDestinationData }) => {
          const destinationBody = {
            ...sftpDestinationData,
            ...data,
            con_data: {
              ...sftpDestinationData.con_data,
              path: `${sftpDestinationData.con_data.path}${file_name}`,
            },
          };

          return (async () => {
            const response = await createSftpDestination(destinationBody).unwrap();
            enqueueSnackbar('Destination added successfully', {
              variant: 'success',
            });
          })();
        },
      )();
    }

    return null;
  };

  return (
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

        // @ts-ignore
        handleExternalSubmit(handleSubmit(onSubmit), e);
      }}
      // ref={drop}
      {...props}
    >
      <FormContainer sx={{ justifyContent: 'center' }}>
        <TextField
          label={`${translate('Destination Name')}*`}
          {...register('name', {
            required: translate('This field is required'),
            maxLength: {
              value: 32,
              message: `${translate('Max length is')} 32${translate('characters')}`,
            },
          })}
          helperText={errors.name?.message}
          error={!!errors.name}
        />

        <TextField
          label={`${translate('Import type')}*`}
          onChange={(event) => {
            setValue('con_type', event.target.value as FileImportType);
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
          {/* {fileImportTypes?.map((fileImpType) => (
            <MenuItem key={fileImpType} value={fileImpType}>
              {fileImpType}
            </MenuItem>
          ))} */}
          <MenuItem key="SFTP" value="SFTP">
            SFTP
          </MenuItem>
        </TextField>
      </FormContainer>
      <Divider orientation="vertical" sx={{ mx: '0.625rem' }} flexItem />
      <FormContainer>
        <FormProvider {...fileSftpDestinationForm}>
          <DestinationDataForm type="SFTP" />
        </FormProvider>
      </FormContainer>
      {/* {isHovering && <DropFileBox />} */}
    </form>
  );
};
