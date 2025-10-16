import { Stack } from '@mui/material';
import { getErrorMessage, migrationApi } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { UploadZone } from '../../../6_shared/ui/imageUploader/uploadZone/UploadZone';

const { useMigrationImportMutation } = migrationApi;

interface IProps {
  onSuccess?: () => void;
}

export const ImportTmoComponent = ({ onSuccess }: IProps) => {
  const [mutate, { isLoading, isSuccess, error }] = useMigrationImportMutation();

  const onFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('File imported successfully', { variant: 'success' });
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (error) enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  }, [error]);

  return (
    <Stack sx={{ p: 2 }}>
      <UploadZone onFileUpload={onFileUpload} accept="xlsx" isLoading={isLoading} />
    </Stack>
  );
};
