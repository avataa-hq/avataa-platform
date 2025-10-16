import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { EditFileManualForm, EditFileManualInputs } from '4_features';
import {
  Modal,
  useTranslate,
  getErrorMessage,
  fileManualSourcesApi,
  sourcesApi,
  useDataflowPage,
} from '6_shared';
import { ManageDataflowGroupsWidget } from '3_widgets/dataflow';

const { useUpdateFileManualSourceMutation } = fileManualSourcesApi;
const { useLoadSourceDataMutation } = sourcesApi;

const formId = 'dataflow-edit-file-manual-form';

export const EditFileManualModal = () => {
  const translate = useTranslate();
  const [isManageGroupsWidgetOpen, setIsManageGroupsWidgetOpen] = useState(false);
  const { isEditFileManualModalOpen, setEditFileManualModalOpen, selectedSource } =
    useDataflowPage();

  // const selectedSource = dataflowPageState.selectedSource as Source<FileManualConData>;

  const [updateFileManualSource, { isLoading }] = useUpdateFileManualSourceMutation();
  const [loadSourceData, { isLoading: isDataLoading }] = useLoadSourceDataMutation();

  const closeModal = () => {
    setEditFileManualModalOpen(false);
  };

  const cancel = () => {
    closeModal();
  };

  const formDefaultValues = {
    name: selectedSource?.name || '',
    group_id: selectedSource?.group_id || 0,
    file_columns: selectedSource?.con_data?.source_data_columns || [],
  };

  const onSubmit = async (data: EditFileManualInputs) => {
    try {
      if (!selectedSource) throw new Error('No selected source');

      const body = new FormData();
      body.append('name', data.name);
      body.append('group_id', data.group_id.toString());
      body.append('file', data.file);
      body.append('file_columns', JSON.stringify(data.file_columns));

      await updateFileManualSource({
        sourceId: selectedSource.id,
        body,
      }).unwrap();
      enqueueSnackbar(translate('Success'), { variant: 'success' });
      await loadSourceData(selectedSource.id).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <>
      <Modal
        minWidth="700px"
        open={isEditFileManualModalOpen}
        title={translate('Edit data source')}
        onClose={() => cancel()}
        actions={
          <>
            <Button variant="outlined" onClick={() => cancel()}>
              {translate('Cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              loading={isLoading || isDataLoading}
              type="submit"
              form={formId}
              name="apply-button"
            >
              {translate('Apply')}
            </LoadingButton>
          </>
        }
      >
        <EditFileManualForm
          onManageGroupsClick={() => setIsManageGroupsWidgetOpen(true)}
          defaultValues={formDefaultValues}
          id={formId}
          onSubmit={onSubmit}
        />
      </Modal>
      <ManageDataflowGroupsWidget
        open={isManageGroupsWidgetOpen}
        onClose={() => setIsManageGroupsWidgetOpen(false)}
      />
    </>
  );
};
