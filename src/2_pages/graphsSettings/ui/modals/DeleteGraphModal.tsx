import { enqueueSnackbar } from 'notistack';
import { Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Modal, useTranslate, getErrorMessage, graphApi, useGraphSettingsPage } from '6_shared';

export const DeleteGraphModal = () => {
  const { useDeleteGraphMutation } = graphApi.initialisation;

  const translate = useTranslate();

  const { isDeleteGraphModalOpen, selectedGraph, setDeleteGraphModalOpen, setSelectedGraph } =
    useGraphSettingsPage();

  const [deleteGraph, { isLoading: isDeleteGraphLoading }] = useDeleteGraphMutation();

  const closeModal = () => setDeleteGraphModalOpen(false);

  const cancel = () => {
    setSelectedGraph(null);
    closeModal();
  };

  const handleGraphDelete = async () => {
    try {
      if (!selectedGraph) throw new Error('There is no selected graph');

      await deleteGraph(selectedGraph.key).unwrap();
      closeModal();
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title={translate('Delete')}
      open={isDeleteGraphModalOpen}
      onClose={() => cancel()}
      actions={
        <>
          <Button onClick={() => cancel()} variant="contained">
            {translate('Cancel')}
          </Button>
          <LoadingButton
            loading={isDeleteGraphLoading}
            variant="outlined"
            onClick={handleGraphDelete}
          >
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>{`${translate('Are you sure you want to delete')} ${
        selectedGraph?.name
      }?`}</Typography>
    </Modal>
  );
};
