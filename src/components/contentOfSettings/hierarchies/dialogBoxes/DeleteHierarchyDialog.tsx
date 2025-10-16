import { Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import {
  Modal,
  useTranslate,
  hierarchyApi,
  getErrorMessage,
  fetchWithRetry,
  useHierarchyBuilder,
} from '6_shared';

export const DeleteHierarchyDialog = () => {
  const { useDeleteHierarchyMutation } = hierarchyApi;

  const translate = useTranslate();

  const { selectedHierarchy, isDeleteHierarchyDialogOpen, setIsDeleteHierarchyDialogOpen } =
    useHierarchyBuilder();

  const [deleteHierarchy, { isLoading: isDeleteHierarchyLoading }] = useDeleteHierarchyMutation();

  const handleDeleteHierarchy = async () => {
    try {
      if (selectedHierarchy?.id) {
        await fetchWithRetry(async (requestData, signal) => {
          return deleteHierarchy({ hierarchyId: requestData, signal }).unwrap();
        }, selectedHierarchy.id);
      }

      setIsDeleteHierarchyDialogOpen(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title="Delete hierarchy"
      open={isDeleteHierarchyDialogOpen}
      onClose={() => setIsDeleteHierarchyDialogOpen(false)}
      actions={
        <>
          <Button
            variant="outlined"
            className="btn"
            onClick={() => setIsDeleteHierarchyDialogOpen(false)}
          >
            {translate('Back')}
          </Button>
          <LoadingButton
            loading={isDeleteHierarchyLoading}
            variant="contained"
            className="btn"
            onClick={handleDeleteHierarchy}
          >
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>
        {translate('Are you sure you want to delete')} {selectedHierarchy?.name} ?
      </Typography>
    </Modal>
  );
};
