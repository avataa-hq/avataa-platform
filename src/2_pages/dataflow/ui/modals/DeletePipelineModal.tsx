import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Modal,
  getErrorMessage,
  useTranslate,
  pipelinesManagementApi,
  useDataflowPage,
} from '6_shared';
import { enqueueSnackbar } from 'notistack';

const { useDeletePipelineMutation } = pipelinesManagementApi;

interface IProps {
  deletePipelineFromState: (dag_id: string) => void;
}

export const DeletePipelineModal = ({ deletePipelineFromState }: IProps) => {
  const translate = useTranslate();

  const {
    isDeletePipelineModalOpen,
    selectedPipeline,
    setDeletePipelineModalOpen,
    setPipelineInfoModalOpen,
    setSelectedPipeline,
  } = useDataflowPage();

  const [deletePipeline, { isLoading }] = useDeletePipelineMutation();

  const closeModal = () => setDeletePipelineModalOpen(false);

  const handleDelete = async () => {
    try {
      if (!selectedPipeline) throw new Error('Pipeline is not selected');
      if (!selectedPipeline.id) throw new Error('External DAGs must be deleted directly');

      if (!selectedPipeline.dag_id) return;
      await deletePipeline({ pipelineId: selectedPipeline.dag_id, drop_metadata: true }).unwrap();
      deletePipelineFromState(selectedPipeline.dag_id);
      setSelectedPipeline(undefined);
      closeModal();
      setPipelineInfoModalOpen(false);
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      minWidth="500px"
      title={translate('Delete')}
      open={isDeletePipelineModalOpen}
      onClose={() => closeModal()}
      actions={
        <>
          <LoadingButton loading={false} onClick={() => closeModal()} variant="contained">
            {translate('Cancel')}
          </LoadingButton>
          <LoadingButton variant="outlined" loading={isLoading} onClick={handleDelete}>
            {translate('Delete')}
          </LoadingButton>
        </>
      }
    >
      <Typography>{`${translate('Are you sure you want to delete')} ${
        selectedPipeline?.name
      }?`}</Typography>
    </Modal>
  );
};
