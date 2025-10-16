import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { IUpdateFolderBody, IFolderModel, Modal, useTranslate, useLayersSlice } from '6_shared';
import { useUpdateFolder } from '5_entites/inventory/layers/api';
import { CreateFolderForm } from '../../forms';

type Inputs = {
  folderName: string;
  parentId: IFolderModel;
};

interface IProps {
  foldersData?: IFolderModel[];
}

export const UpdateFolderModal = ({ foldersData }: IProps) => {
  const translate = useTranslate();

  const { isEditFolderModalOpen, selectedLayersItem, setIsEditFolderModalOpen } = useLayersSlice();

  const { updateFolder } = useUpdateFolder();

  const filteredFoldersData = useMemo(
    () => foldersData?.filter((folder) => folder.id !== selectedLayersItem?.id),
    [foldersData, selectedLayersItem?.id],
  );

  const defaultValues = useMemo(() => {
    return {
      folderName: selectedLayersItem?.name || '',
      parentId: foldersData?.find((folder) => folder.id === selectedLayersItem?.parent_id),
    };
  }, [foldersData, selectedLayersItem]);

  const form = useForm<Inputs>({
    defaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleFolderModalClose = () => {
    setIsEditFolderModalOpen(false);
    reset();
  };

  const onSubmit = async (data: Inputs) => {
    if (!selectedLayersItem) return;

    const updateFolderBody: IUpdateFolderBody = {
      id: selectedLayersItem.id,
    };

    if (data.folderName.trim() !== selectedLayersItem.name) {
      updateFolderBody.name = data.folderName.trim();
    }

    if (data.parentId !== undefined) {
      updateFolderBody.parent_id = data.parentId?.id ?? null;
    }

    if (Object.keys(updateFolderBody).length === 1) {
      handleFolderModalClose();
      return;
    }

    await updateFolder(updateFolderBody);

    handleFolderModalClose();
  };

  return (
    <Modal
      title={translate('Update folder')}
      width="320px"
      open={isEditFolderModalOpen}
      onClose={handleFolderModalClose}
      actions={
        <Button form="update-folder-form" type="submit">
          {translate('Update')}
        </Button>
      }
    >
      <FormProvider {...form}>
        <form id="update-folder-form" onSubmit={handleSubmit(onSubmit)}>
          <CreateFolderForm foldersData={filteredFoldersData} />
        </form>
      </FormProvider>
    </Modal>
  );
};
