import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Badge } from '@mui/material';
import {
  getErrorMessage,
  useTranslate,
  pipelinesManagementApi,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';

const { useConfirmPipelineChangesMutation } = pipelinesManagementApi;

export const ApplyButton = () => {
  const translate = useTranslate();

  const { setIsDataflowDiagramOpen } = useDataflowDiagramPage();
  const {
    pipelineId,
    isDiagramChanged,
    isLoading,
    pipelineName,
    pipelineSchedule,
    pipelineTags,
    resetDiagramState,
  } = useDataflowDiagram();

  const [confirmPipelineChanges, { isLoading: isConfirmPipelineChangesLoading }] =
    useConfirmPipelineChangesMutation();

  const apply = async () => {
    if (pipelineId === null) return;

    try {
      if (pipelineName === null || pipelineName.trim().length === 0)
        throw new Error('Pipeline name is required');

      await confirmPipelineChanges({
        pipelineId,
        body: {
          trigger_info: {
            schedule_interval: pipelineSchedule?.trim().length ? pipelineSchedule : undefined,
          },
          pipeline_info: {
            name: pipelineName,
            tags: pipelineTags,
          },
        },
      }).unwrap();
      setIsDataflowDiagramOpen(false);
      resetDiagramState();
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <LoadingButton
      loading={isConfirmPipelineChangesLoading}
      variant="contained"
      onClick={apply}
      disabled={isLoading}
      data-testid="dataflow-add-rule__apply-button"
    >
      <Badge
        color="warning"
        variant="dot"
        invisible={!isDiagramChanged || isConfirmPipelineChangesLoading}
        sx={{ '.MuiBadge-badge': { top: '-5px', right: '-15px' } }}
      >
        {translate('Apply')}
      </Badge>
    </LoadingButton>
  );
};
