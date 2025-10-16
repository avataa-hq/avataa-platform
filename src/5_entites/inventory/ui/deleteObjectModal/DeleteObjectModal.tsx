import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDeleteMultipleObjects } from '5_entites';
import { Modal, useObjectCRUD, useTranslate } from '6_shared';

interface IProps {
  objectId: number | null;
  isOpen?: boolean;
}

export const DeleteObjectModal = ({ objectId, isOpen }: IProps) => {
  const translate = useTranslate();

  const {
    objectCRUDComponentUi: { isObjectDeleteModalOpen },
    isObjectsActive,

    setIsObjectCRUDModalOpen,
    setIsObjectDeleteModalOpen,
  } = useObjectCRUD();

  const { deleteMultipleObjectsFn } = useDeleteMultipleObjects();

  const handleDeleteObject = async (id: number | null) => {
    if (id === null) return;

    setIsObjectCRUDModalOpen(false);
    setIsObjectDeleteModalOpen(false);
    await deleteMultipleObjectsFn({ mo_ids: [id], erase: !isObjectsActive });
  };

  return (
    <Modal
      minWidth="500px"
      title={translate(isObjectsActive ? 'Delete' : 'Delete Permanently')}
      open={isObjectDeleteModalOpen && (isOpen ?? true)}
      onClose={() => setIsObjectDeleteModalOpen(false)}
      actions={
        <>
          <LoadingButton
            loading={false}
            onClick={() => setIsObjectDeleteModalOpen(false)}
            variant="contained"
          >
            {translate('Cancel')}
          </LoadingButton>
          <LoadingButton variant="outlined" onClick={() => handleDeleteObject(objectId)}>
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>{`${translate(
        isObjectsActive
          ? 'Are you sure you want to delete object with id'
          : 'Are you sure you want to delete permanently object with id',
      )} ${objectId}?`}</Typography>
    </Modal>
  );
};
