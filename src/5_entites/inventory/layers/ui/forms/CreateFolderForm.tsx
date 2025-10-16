import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Box, TextField } from '@mui/material';
import { IFolderModel, useTranslate } from '6_shared';

interface IProps {
  foldersData?: IFolderModel[];
}

export const CreateFolderForm = ({ foldersData }: IProps) => {
  const translate = useTranslate();

  const {
    register,
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  return (
    <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
      <TextField
        {...register('folderName', {
          required: translate('This field is required'),
          validate: (value) => value.trim() !== '' || translate('This field is required'),
        })}
        defaultValue={getValues('folderName')}
        label={translate('Folder name')}
        name="folderName"
        error={!!errors.folderName}
        helperText={errors.folderName?.message as string}
        fullWidth
        required
      />
      <Controller
        name="parentId"
        control={control}
        render={({ field: { onChange, value, ...props } }) => (
          <Autocomplete
            {...props}
            options={foldersData ?? []}
            value={foldersData?.find((folder) => folder?.id === value?.id) || null}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={translate('Select parent folder')} />
            )}
            onChange={(_, newValue) => onChange(newValue)}
            fullWidth
          />
        )}
      />
    </Box>
  );
};
