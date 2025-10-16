import { enqueueSnackbar } from 'notistack';
import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Modal, getErrorMessage, useTranslate, sourcesApi, useDataflowPage } from '6_shared';

const { useDeleteSourceMutation } = sourcesApi;

export const DeleteSourceModal = () => {
  const translate = useTranslate();

  const {
    isDeleteSourceModalOpen,
    selectedSource,
    isSourceDeleted,
    setDeleteSourceModalOpen,
    setIsSourceDeleted,
  } = useDataflowPage();

  const [deleteSource, { isLoading }] = useDeleteSourceMutation();

  const closeModal = () => setDeleteSourceModalOpen(false);

  const handleDelete = async () => {
    try {
      if (!selectedSource) throw new Error('Source is not selected');

      await deleteSource(selectedSource?.id).unwrap();
      closeModal();
      setIsSourceDeleted(isSourceDeleted + 1);
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title={translate('Delete')}
      open={isDeleteSourceModalOpen}
      onClose={() => closeModal()}
      actions={
        <>
          <LoadingButton loading={false} onClick={() => closeModal()} variant="contained">
            {translate('Cancel')}
          </LoadingButton>
          <LoadingButton variant="outlined" loading={isLoading} onClick={handleDelete}>
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>{`${translate('Are you sure you want to delete')} ${
        selectedSource?.name
      }?`}</Typography>
    </Modal>
  );
};
