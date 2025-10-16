import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import {
  createMultipleUpdateBody,
  useDeleteMultipleObjects,
  useGetInventoryObjectData,
  useUpdateMultipleObjects,
} from '5_entites';
import {
  LoadingOverlay,
  Modal,
  ObjectByFilters,
  PmSelectedRow,
  useDeleteObjectWithLinks,
  useInventory,
  useInventoryTable,
  useObjectCRUD,
  useTranslate,
} from '6_shared';
import { useEffect, useState } from 'react';
import { useCloseAlarmsAndDeleteGroup } from '4_features';
import {
  useGetLinkedObjectsData,
  useGetObjectsWithLinksIds,
} from '5_entites/inventory/lib/deleteObjectWithLinksModal';
import { DeleteObjectWithLinksModal } from '../deleteObjectWithLinksModal/DeleteObjectWithLinksModal';
import { useWaitForDeletingObjects } from '../../../lib';

interface IProps {
  objIds: number[];
  objectsData?: ObjectByFilters[] | undefined;
  pmSelectedRows?: PmSelectedRow[];
  setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export const ChangeObjectActivityStatusModal = ({
  objIds,
  objectsData,
  pmSelectedRows,
  setIsRightPanelOpen,
}: IProps) => {
  const translate = useTranslate();

  const [isLoading, setIsLoading] = useState(false);

  const { setSelectedRows } = useInventoryTable();
  const { setIsObjectCRUDModalOpen } = useObjectCRUD();
  const { currentObjectId, currentTmoId, setCurrentTmoId, setCurrentObjectId } =
    useDeleteObjectWithLinks();
  const { changeObjectActivityStatusModal, tmoId, setChangeObjectActivityStatusModal } =
    useInventory();

  const { updateMultipleObjectFn } = useUpdateMultipleObjects();
  const { deleteMultipleObjectsFn, isLoading: isLoadingDelete } = useDeleteMultipleObjects();
  const { closeAlarmsAndDeleteGroup } = useCloseAlarmsAndDeleteGroup({});

  const { isOpen, role } = changeObjectActivityStatusModal;

  const { waitForDeletingObjects } = useWaitForDeletingObjects();

  const onClose = () =>
    setChangeObjectActivityStatusModal({
      ...changeObjectActivityStatusModal,
      isOpen: false,
    });

  const handleRestoreObject = async (objectIds: number[]) => {
    if (!objectIds.length) return;
    const body = createMultipleUpdateBody({ objectIds, objectsData, active: true });
    if (!body) return;
    await updateMultipleObjectFn(body);

    onClose();
  };

  const handleDeleteObjectsPermanently = async (objectIds: number[]) => {
    if (!objectIds.length) return;

    setIsLoading(true);

    const res = await deleteMultipleObjectsFn({ mo_ids: objectIds, erase: true }, true);

    if (res?.status === 'Objects were successfully deleted') {
      await waitForDeletingObjects(objectIds);
    }

    translate('Object deleted successfully');
    setIsLoading(false);

    onClose();
    setIsObjectCRUDModalOpen(false);
    setIsRightPanelOpen?.(false);
    setSelectedRows([]);
  };

  // *******************************************
  const { objectsWithLinksIds, objectsWithoutLinksIds } = useGetObjectsWithLinksIds({ objIds });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (objectsWithLinksIds[currentIndex]) {
      setCurrentObjectId(objectsWithLinksIds[currentIndex]);
    }
  }, [currentIndex, objectsWithLinksIds]);

  useEffect(() => {
    if (tmoId) {
      setCurrentTmoId(tmoId);
    }
  }, [tmoId]);

  const { incMoLinkInfo, outMoLinkInfo, incomingMoLinksRefetch, outMoLinksRefetch } =
    useGetLinkedObjectsData({
      // moId: objectsWithLinksIds[currentIndex],
      moId: currentObjectId as number,
    });

  const refetchLinkValues = () => {
    incomingMoLinksRefetch();
    outMoLinksRefetch();
  };

  const { inventoryObjectData } = useGetInventoryObjectData({
    // objectId: objectsWithLinksIds[currentIndex],
    objectId: currentObjectId as number,
  });

  const handleNext = () => {
    setIsLinkModalOpen(false);

    // Переход к следующему объекту
    if (currentIndex < objectsWithLinksIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsLinkModalOpen(true); // Открываем модалку для следующего объекта
    }
  };

  // Функция для открытия модалки и начала процесса
  const startProcess = () => {
    setCurrentIndex(0);
    setIsLinkModalOpen(true);
  };

  // Закрытие модалки без передачи аргументов
  const handleModalClose = () => {
    handleNext(); // Переход к следующему объекту
  };

  const handleDeleteObjects = async (objectIds: number[]) => {
    if (!objectIds.length) return;

    await deleteMultipleObjectsFn({ mo_ids: objectIds, erase: false });

    if (pmSelectedRows) {
      await closeAlarmsAndDeleteGroup(pmSelectedRows);
    }
    onClose();
    setIsObjectCRUDModalOpen(false);
  };

  const onObjectsDelete = () => {
    onClose();
    if (objectsWithLinksIds.length) {
      startProcess();
      handleDeleteObjects(objectsWithoutLinksIds);
    } else {
      handleDeleteObjects(objIds);
    }
  };

  // Get title
  const renderTitle = () => {
    if (role === 'Delete') {
      return translate('Delete');
    }
    if (role === 'Restore') {
      return translate('Restore');
    }

    return translate('Delete Permanently');
  };

  return (
    <>
      <Modal
        minWidth="500px"
        title={renderTitle()}
        open={isOpen}
        onClose={onClose}
        actions={
          <>
            <LoadingButton
              loading={false}
              onClick={onClose}
              variant="contained"
              disabled={isLoading}
            >
              {translate('Cancel')}
            </LoadingButton>
            {role === 'Delete' && (
              <LoadingButton
                variant="outlined"
                onClick={onObjectsDelete}
                disabled={isLoading || isLoadingDelete}
              >
                {translate('Delete')}
              </LoadingButton>
            )}
            {role === 'Restore' && (
              <LoadingButton
                variant="outlined"
                onClick={() => handleRestoreObject(objIds)}
                disabled={isLoading || isLoadingDelete}
              >
                {translate('Restore')}
              </LoadingButton>
            )}
            {role === 'Delete Permanently' && (
              <LoadingButton
                variant="outlined"
                onClick={() => handleDeleteObjectsPermanently(objIds)}
                disabled={isLoading || isLoadingDelete}
              >
                {translate('Delete Permanently')}
              </LoadingButton>
            )}
          </>
        }
      >
        {isLoading || isLoadingDelete ? (
          <LoadingOverlay />
        ) : (
          <>
            {role === 'Delete' && (
              <Typography>
                {objIds.length === 1 &&
                  `${translate('Are you sure you want to delete object with id')} ${objIds[0]}?`}
                {objIds.length > 1 &&
                  `${translate('Are you sure you want to delete objects with id')} ${objIds.join(
                    ', ',
                  )}`}
              </Typography>
            )}
            {role === 'Restore' && (
              <Typography>
                {objIds.length === 1 &&
                  `${translate('Are you sure you want to restore object with id')} ${objIds[0]}`}
                {objIds.length > 1 &&
                  `${translate('Are you sure you want to restore objects with id')} ${objIds.join(
                    ', ',
                  )}`}
              </Typography>
            )}
            {role === 'Delete Permanently' && (
              <Typography>
                {objIds.length === 1 &&
                  `${translate('Are you sure you want to delete permanently object with id')} ${
                    objIds[0]
                  }?`}
                {objIds.length > 1 &&
                  `${translate(
                    'Are you sure you want to delete permanently objects with id',
                  )} ${objIds.join(', ')}`}
              </Typography>
            )}
          </>
        )}
      </Modal>
      {currentObjectId &&
        currentTmoId &&
        (incMoLinkInfo || outMoLinkInfo) &&
        inventoryObjectData && (
          <DeleteObjectWithLinksModal
            initialObjectId={objectsWithLinksIds[currentIndex]}
            currentObjectId={currentObjectId}
            tmoId={currentTmoId}
            incMoLinkInfo={incMoLinkInfo}
            outMoLinkInfo={outMoLinkInfo}
            isOpen={isLinkModalOpen}
            onClose={handleModalClose}
            inventoryObjectData={inventoryObjectData}
            refetchLinkValues={refetchLinkValues}
          />
        )}
    </>
  );
};
