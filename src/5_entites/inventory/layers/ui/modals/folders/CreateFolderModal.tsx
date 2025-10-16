import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { ICreateFolderBody, IFolderModel, Modal, useLayersSlice, useTranslate } from '6_shared';
import { useCreateFolder } from '5_entites/inventory/layers/api';
import { CreateFolderForm } from '../../forms';

type Inputs = {
  folderName: string;
  parentId: IFolderModel;
};

interface IProps {
  foldersData?: IFolderModel[];
}

export const CreateFolderModal = ({ foldersData }: IProps) => {
  const translate = useTranslate();
  const { isCreateFolderModalOpen, setIsCreateFolderModalOpen } = useLayersSlice();

  const { createFolder } = useCreateFolder();

  const form = useForm<Inputs>();

  const { handleSubmit, reset } = form;

  const handleFolderModalClose = () => {
    setIsCreateFolderModalOpen(false);
    reset();
  };

  const onSubmit = async (data: Inputs) => {
    const createFolderBody: ICreateFolderBody = {
      name: data.folderName,
    };

    if (data.parentId) {
      createFolderBody.parent_id = data.parentId.id;
    }

    await createFolder(createFolderBody);

    handleFolderModalClose();
  };

  return (
    <Modal
      title={translate('Create new folder')}
      width="320px"
      open={isCreateFolderModalOpen}
      onClose={handleFolderModalClose}
      actions={
        <Button form="create-folder-form" type="submit">
          {translate('Create')}
        </Button>
      }
    >
      <FormProvider {...form}>
        <form id="create-folder-form" onSubmit={handleSubmit(onSubmit)}>
          <CreateFolderForm foldersData={foldersData} />
        </form>
      </FormProvider>
    </Modal>
  );
};
