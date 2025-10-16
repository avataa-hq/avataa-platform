import { Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import {
  Modal,
  getErrorMessage,
  useTranslate,
  hierarchyLevels,
  useHierarchyBuilder,
} from '6_shared';

const { useDeleteLevelMutation } = hierarchyLevels;

export const DeleteHierarchyLevelDialog: React.FC = () => {
  const translate = useTranslate();

  const {
    selectedHierarchyLevel,
    isDeleteHierarchyLevelDialogOpen,
    setIsDeleteHierarchyLevelDialogOpen,
  } = useHierarchyBuilder();

  const [deleteHierarchyLevel, { isLoading: isDeleteHierarchyLevelLoading }] =
    useDeleteLevelMutation();

  const handleLevelDelete = async () => {
    try {
      if (!selectedHierarchyLevel || !selectedHierarchyLevel.data)
        throw new Error('No hierarchy level selected');

      await deleteHierarchyLevel({
        hierarchyId: selectedHierarchyLevel.data.hierarchy_id,
        levelId: selectedHierarchyLevel.data.id,
      }).unwrap();

      setIsDeleteHierarchyLevelDialogOpen(false);
      enqueueSnackbar(translate('Success'), { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title="Delete hierarchy level"
      open={isDeleteHierarchyLevelDialogOpen}
      onClose={() => setIsDeleteHierarchyLevelDialogOpen(false)}
      actions={
        <>
          <Button
            variant="outlined"
            className="btn"
            onClick={() => setIsDeleteHierarchyLevelDialogOpen(false)}
          >
            {translate('Back')}
          </Button>
          <LoadingButton
            loading={isDeleteHierarchyLevelLoading}
            variant="contained"
            className="btn"
            onClick={handleLevelDelete}
          >
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>
        {translate('Are you sure you want to delete')} {selectedHierarchyLevel?.data?.name} ?
      </Typography>
    </Modal>
  );
};
