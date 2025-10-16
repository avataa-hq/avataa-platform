import { enqueueSnackbar } from 'notistack';
import { Controller, useFormContext } from 'react-hook-form';
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
  CircularProgress,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CheckBox, CheckBoxOutlineBlank, RefreshRounded } from '@mui/icons-material';

import {
  useTranslate,
  FormContainer,
  getErrorMessage,
  fileManualSourcesApi,
  fileSourcesApi,
} from '6_shared';

export interface FileManualInputs {
  file_columns: string[];
  file: File;
}

export const FileManualDataForm = () => {
  const { useGetFileManualSourceColumnsWithoutIdMutation } = fileManualSourcesApi;
  const { useGetFileSourcesExtensionsQuery } = fileSourcesApi;

  const translate = useTranslate();
  const theme = useTheme();

  const {
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FileManualInputs>();

  const { data: fileExtensions } = useGetFileSourcesExtensionsQuery();

  const [getFileColumns, { isLoading: isFileColumnsLoading, data: fileColumns }] =
    useGetFileManualSourceColumnsWithoutIdMutation();

  const getColumns = () => {
    trigger('file');

    const formData = new FormData();
    formData.append('file', getValues('file'));
    getFileColumns(formData)
      .unwrap()
      .catch((error) => enqueueSnackbar(getErrorMessage(error), { variant: 'error' }));
  };

  return (
    <FormContainer sx={{ justifyContent: 'center' }}>
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
  );
};
