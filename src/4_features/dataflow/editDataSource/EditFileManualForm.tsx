import { BaseSyntheticEvent, MouseEventHandler, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  TextField,
  Autocomplete,
  Checkbox,
  FormControl,
  FormHelperText,
  Button,
  FormLabel,
  Box,
  Typography,
  MenuItem,
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
  fileManualSourcesApi,
  fileSourcesApi,
  dataflowGroupsApi,
  ErrorPage,
  LoadingAvataa,
} from '6_shared';

export interface EditFileManualInputs {
  name: string;
  group_id: number;
  file_columns: string[];
  file: File;
}

type EditFileManualFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: EditFileManualInputs, event?: BaseSyntheticEvent) => void;
  onManageGroupsClick?: MouseEventHandler<HTMLButtonElement>;
  defaultValues: Partial<EditFileManualInputs>;
};

export const EditFileManualForm = ({
  onManageGroupsClick,
  defaultValues,
  onSubmit: onExternalSubmit,
  ...props
}: EditFileManualFormProps) => {
  const { useGetFileManualSourceColumnsWithoutIdMutation } = fileManualSourcesApi;
  const { useGetFileSourcesExtensionsQuery } = fileSourcesApi;
  const { useGetAllGroupsQuery } = dataflowGroupsApi;

  const translate = useTranslate();
  const theme = useTheme();

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
  } = useForm<EditFileManualInputs>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();
  const {
    data: fileExtensions,
    isFetching: isFileExtensionsFetching,
    isError: isFileExtensionsError,
  } = useGetFileSourcesExtensionsQuery();

  const [getFileColumns, { isLoading: isFileColumnsLoading, data: fileColumns }] =
    useGetFileManualSourceColumnsWithoutIdMutation();

  const isLoading = isGroupsFetching || isFileExtensionsFetching;
  const isError = isGroupsError || isFileExtensionsError;

  const getColumns = () => {
    trigger('file');

    const formData = new FormData();
    formData.append('file', getValues('file'));
    getFileColumns(formData)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  const onSubmit: SubmitHandler<EditFileManualInputs> = (data, event) => {
    onExternalSubmit?.(data, event);
  };

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
            <Box component="div" display="flex" gap="10px">
              <Controller
                name="file_columns"
                control={control}
                render={({ field: { ref, onChange, ...field } }) => (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    sx={{ flex: 1 }}
                    disabled={isFileColumnsLoading}
                    defaultValue={defaultValues?.file_columns}
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
                        placeholder={translate('Columns')}
                        error={!!errors.file_columns}
                        helperText={errors.file_columns?.message}
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
            </Box>
            <FormControl error={!!errors.file}>
              <FormLabel
                htmlFor="dataflow-file-upload"
                sx={{ maxWidth: 'fit-content', display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <input
                  id="dataflow-file-upload"
                  type="file"
                  accept={fileExtensions?.map((ext) => '.'.concat(ext)).join() ?? '.xlsx'}
                  {...register('file', {
                    validate: (value?: any) => {
                      if (value.length !== undefined) {
                        return value.length > 0 || translate('Please upload a file');
                      }
                      return value || translate('Please upload a file');
                    },
                  })}
                  onChange={(event) => {
                    const selectedFile = (event.target as HTMLInputElement).files?.[0];
                    if (selectedFile) {
                      setValue('file', selectedFile);
                    }
                  }}
                  hidden
                />
                {/* @ts-expect-error - MUI Button type does not have 'label' value for `component` prop, but it works as intended */}
                <Button
                  component="label"
                  variant="contained"
                  type="button"
                  sx={{ alignSelf: 'flex-start' }}
                  htmlFor="dataflow-file-upload"
                >
                  {translate('Upload file')}
                </Button>
                {watch('file')?.name}
              </FormLabel>
              <FormHelperText>{errors.file?.message}</FormHelperText>
            </FormControl>
          </FormContainer>
        </form>
      )}
    </>
  );
};
