import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { EditDbSourceForm, EditDbSourceInputs } from '4_features';
import {
  Modal,
  useTranslate,
  getErrorMessage,
  dbSourcesApi,
  sourcesApi,
  useDataflowPage,
} from '6_shared';
import { DbConData, Source } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';
import { ManageDataflowGroupsWidget } from '3_widgets/dataflow';

const { useUpdateDbSourceMutation } = dbSourcesApi;
const { useLoadSourceDataMutation } = sourcesApi;

const formId = 'dataflow-edit-db-source-form';

export const EditDbSourceModal = () => {
  const translate = useTranslate();

  const [isManageGroupsWidgetOpen, setIsManageGroupsWidgetOpen] = useState(false);

  const { isEditDbSourceModalOpen, setEditDbSourceModalOpen, selectedSource } = useDataflowPage();

  // const selectedSource = dataflowPageState.selectedSource as Source<FileManualConData>;

  const [updateDbSource, { isLoading }] = useUpdateDbSourceMutation();
  const [loadSourceData, { isLoading: isDataLoading }] = useLoadSourceDataMutation();

  const closeModal = () => {
    setEditDbSourceModalOpen(false);
  };

  const cancel = () => {
    closeModal();
  };

  const formDefaultValues: Subset<Source<DbConData>> = {
    name: selectedSource?.name || '',
    group_id: selectedSource?.group_id || 0,
    con_data: selectedSource?.con_data,
  };

  const onSubmit = async (data: EditDbSourceInputs) => {
    try {
      if (!selectedSource) throw new Error('No selected source');

      await updateDbSource({
        sourceId: selectedSource.id,
        body: { ...data, con_type: 'DB' },
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
        open={isEditDbSourceModalOpen}
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
        <EditDbSourceForm
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
