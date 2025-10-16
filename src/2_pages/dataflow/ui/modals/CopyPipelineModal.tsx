import { enqueueSnackbar } from 'notistack';
import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDisplayPipeline } from '2_pages/dataflow/lib';
import {
  Modal,
  getErrorMessage,
  useTranslate,
  pipelinesManagementApi,
  useDataflowPage,
} from '6_shared';

const { useCreatePipelineCopyMutation } = pipelinesManagementApi;

export const CopyPipelineModal = () => {
  const translate = useTranslate();
  const displayPipeline = useDisplayPipeline();

  const { isCopyPipelineModalOpen, selectedPipeline, setCopyPipelineModalOpen } = useDataflowPage();

  const [copyPipeline, { isLoading }] = useCreatePipelineCopyMutation();

  const closeModal = () => setCopyPipelineModalOpen(false);

  const handlePipelineCopy = async () => {
    try {
      if (!selectedPipeline) throw new Error(translate('Pipeline is not selected'));

      const pipelineStructure = await copyPipeline(selectedPipeline?.id).unwrap();
      closeModal();
      displayPipeline(pipelineStructure);
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title={translate('Create pipeline copy')}
      open={isCopyPipelineModalOpen}
      onClose={() => closeModal()}
      actions={
        <>
          <LoadingButton loading={false} onClick={() => closeModal()} variant="contained">
            {translate('Cancel')}
          </LoadingButton>
          <LoadingButton variant="outlined" loading={isLoading} onClick={handlePipelineCopy}>
            {translate('Copy')}
          </LoadingButton>
        </>
      }
    >
      <Typography>{`${translate('Are you sure you want to create a copy for')} ${
        selectedPipeline?.name
      }?`}</Typography>
    </Modal>
  );
};
