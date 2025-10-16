import { Box, Button, Typography } from '@mui/material';
import { layersMsApi, Modal, useLayersSlice, useTranslate } from '6_shared';

export const DeleteLayersModal = () => {
  const { useDeleteFolderMutation } = layersMsApi.folders;
  const { useDeleteLayerMutation } = layersMsApi.layers;

  const translate = useTranslate();
  const { isDeleteModalOpen, selectedLayersItem, setIsDeleteModalOpen } = useLayersSlice();

  const [deleteFolder] = useDeleteFolderMutation();
  const [deleteLayer] = useDeleteLayerMutation();

  const handleFolderModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const onDeleteClick = async () => {
    if (!selectedLayersItem) return;

    if (selectedLayersItem.type === 'folder') {
      await deleteFolder({ folder_id: selectedLayersItem.id });
    }
    if (selectedLayersItem.type === 'layer') {
      await deleteLayer({ layer_id: selectedLayersItem.id });
    }

    handleFolderModalClose();
  };

  return (
    <Modal
      title={translate('Delete')}
      width="320px"
      open={isDeleteModalOpen}
      onClose={handleFolderModalClose}
      actions={<Button onClick={onDeleteClick}>{translate('Delete')}</Button>}
    >
      <Box component="div">
        <Typography>{`${translate('Are you sure you want to delete')} ${selectedLayersItem?.type} ${
          selectedLayersItem?.name
        }?`}</Typography>
      </Box>
    </Modal>
  );
};
