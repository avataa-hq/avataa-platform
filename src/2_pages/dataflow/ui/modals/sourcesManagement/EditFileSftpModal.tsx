import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { EditFileSftpInputs, EditFileSftpForm } from '4_features';
import {
  Modal,
  useTranslate,
  getErrorMessage,
  fileSftpSourcesApi,
  sourcesApi,
  useDataflowPage,
} from '6_shared';
import { DbConData, Source } from '6_shared/api/dataflowV3/types';
import { Subset } from 'types';

import { ManageDataflowGroupsWidget } from '3_widgets/dataflow';

const { useUpdateFileSftpSourceMutation } = fileSftpSourcesApi;
const { useLoadSourceDataMutation } = sourcesApi;

const formId = 'dataflow-edit-sftp-source-form';

export const EditFileSftpModal = () => {
  const translate = useTranslate();
  const [isManageGroupsWidgetOpen, setIsManageGroupsWidgetOpen] = useState(false);
  const { isEditFileSftpModalOpen, setEditFileSftpModalOpen, selectedSource } = useDataflowPage();

  // const selectedSource = dataflowPageState.selectedSource as Source<FileConData>;

  const [updateFileSftpSource, { isLoading }] = useUpdateFileSftpSourceMutation();
  const [loadSourceData, { isLoading: isDataLoading }] = useLoadSourceDataMutation();

  const closeModal = () => {
    setEditFileSftpModalOpen(false);
  };

  const cancel = () => {
    closeModal();
  };

  const formDefaultValues: Subset<Source<DbConData>> = {
    name: selectedSource?.name || '',
    group_id: selectedSource?.group_id || 0,
    con_data: selectedSource?.con_data,
  };

  const onSubmit = async (data: EditFileSftpInputs) => {
    try {
      if (!selectedSource) throw new Error('No selected source');

      await updateFileSftpSource({
        sourceId: selectedSource.id,
        body: { ...data, con_type: 'File', con_data: { ...data.con_data, import_type: 'SFTP' } },
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
        open={isEditFileSftpModalOpen}
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
        <EditFileSftpForm
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
