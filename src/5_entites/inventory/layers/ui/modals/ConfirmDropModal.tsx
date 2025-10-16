import { Button, Typography } from '@mui/material';
import { Modal, useLayersSlice, useTranslate } from '6_shared';
import { useUpdateFolder, useUpdateLayer } from '5_entites/inventory/layers/api';

export const ConfirmDropModal = () => {
  const translate = useTranslate();

  const { isConfirmModalOpen, selectedLayersItem, dropFolder, setIsConfirmModalOpen } =
    useLayersSlice();

  const { updateFolder } = useUpdateFolder();
  const { updateLayer } = useUpdateLayer();

  const handleFolderModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const onConfirmClick = async () => {
    if (!selectedLayersItem || !dropFolder) return;

    if (selectedLayersItem.type === 'folder') {
      await updateFolder({
        id: selectedLayersItem.id,
        parent_id: dropFolder.id,
      });
    }

    if (selectedLayersItem.type === 'layer') {
      await updateLayer({
        layer_id: selectedLayersItem.id,
        body: {
          folder_id: dropFolder.id,
        },
      });
    }

    handleFolderModalClose();
  };

  return (
    <Modal
      title={translate('Confirm')}
      width="320px"
      open={isConfirmModalOpen}
      onClose={handleFolderModalClose}
      actions={<Button onClick={onConfirmClick}>{translate('Confirm')}</Button>}
    >
      <Typography>{`Are you sure you want to move ${selectedLayersItem?.name} to ${dropFolder?.name}`}</Typography>
    </Modal>
  );
};
