import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { EditApiSourceForm, EditApiSourceInputs } from '4_features';
import {
  Modal,
  useTranslate,
  getErrorMessage,
  apiSourcesApi,
  sourcesApi,
  useDataflowPage,
} from '6_shared';
import { DbConData, Source } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';
import { ManageDataflowGroupsWidget } from '3_widgets/dataflow';

const { useUpdateApiSourceMutation } = apiSourcesApi;
const { useLoadSourceDataMutation } = sourcesApi;

const formId = 'dataflow-edit-api-source-form';

export const EditApiSourceModal = () => {
  const translate = useTranslate();

  const [isManageGroupsWidgetOpen, setIsManageGroupsWidgetOpen] = useState(false);

  const { isEditApiSourceModalOpen, setEditApiSourceModalOpen, selectedSource } = useDataflowPage();

  // const selectedSource = dataflowPageState.selectedSource as Source<FileManualConData>;

  const [updateApiSource, { isLoading }] = useUpdateApiSourceMutation();
  const [loadSourceData, { isLoading: isDataLoading }] = useLoadSourceDataMutation();

  const closeModal = () => {
    setEditApiSourceModalOpen(false);
  };

  const cancel = () => {
    closeModal();
  };

  const formDefaultValues: Subset<Source<DbConData>> = {
    name: selectedSource?.name || '',
    group_id: selectedSource?.group_id || 0,
    con_data: selectedSource?.con_data,
  };

  const onSubmit = async (data: EditApiSourceInputs) => {
    try {
      if (!selectedSource) throw new Error('No selected source');

      await updateApiSource({
        sourceId: selectedSource.id,
        body: { ...data, con_type: 'RestAPI' },
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
        open={isEditApiSourceModalOpen}
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
        <EditApiSourceForm
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
