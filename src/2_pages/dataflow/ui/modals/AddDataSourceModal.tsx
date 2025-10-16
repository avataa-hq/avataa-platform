import { HTML5Backend } from 'react-dnd-html5-backend';
import { enqueueSnackbar } from 'notistack';
import { DndProvider } from 'react-dnd';
import { BaseSyntheticEvent, FormEvent, useState } from 'react';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AddDataSourceForm } from '4_features';
import { Modal, useTranslate, getErrorMessage, useDataflowPage } from '6_shared';
import { ManageDataflowGroupsWidget } from '3_widgets/dataflow';

const formId = 'add-data-source-form';

export const AddDataSourceModal = () => {
  const translate = useTranslate();

  const { isAddDataSourceModalOpen, setAddDataSourceModalOpen } = useDataflowPage();

  const [isLoading, setIsLoading] = useState(false);
  const [isManageGroupsWidgetOpen, setIsManageGroupsWidgetOpen] = useState(false);

  const handleFormSubmit: (
    func: (e?: BaseSyntheticEvent<any, any, any> | undefined) => Promise<any>,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void> = async (submitFn, event) => {
    setIsLoading(true);
    try {
      await submitFn(event);
      enqueueSnackbar('Source added successfully', { variant: 'success' });
      setAddDataSourceModalOpen(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        title={translate('Add data source')}
        open={isAddDataSourceModalOpen}
        onClose={() => setAddDataSourceModalOpen(false)}
        actions={
          <>
            <Button variant="outlined" onClick={() => setAddDataSourceModalOpen(false)}>
              {translate('Cancel')}
            </Button>
            <Button variant="contained" type="reset" form={formId}>
              {translate('Clear')}
            </Button>
            <LoadingButton variant="contained" loading={isLoading} type="submit" form={formId}>
              {translate('Add')}
            </LoadingButton>
          </>
        }
      >
        <DndProvider backend={HTML5Backend}>
          <AddDataSourceForm
            onManageGroupsClick={() => setIsManageGroupsWidgetOpen(true)}
            id={formId}
            handleSubmit={handleFormSubmit}
          />
        </DndProvider>
      </Modal>
      <ManageDataflowGroupsWidget
        open={isManageGroupsWidgetOpen}
        onClose={() => setIsManageGroupsWidgetOpen(false)}
      />
    </>
  );
};
