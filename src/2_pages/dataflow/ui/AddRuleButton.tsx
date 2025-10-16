import { enqueueSnackbar } from 'notistack';
import { AddRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  getErrorMessage,
  useTranslate,
  pipelinesManagementApi,
  ActionTypes,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';

const { useCreatePipelineMutation } = pipelinesManagementApi;

export const AddRuleButton = ({ permissions }: { permissions?: Record<ActionTypes, boolean> }) => {
  const translate = useTranslate();

  const { setPipelineId, setPipelineName } = useDataflowDiagram();
  const { setIsDataflowDiagramOpen } = useDataflowDiagramPage();

  const [createPipeline, { isLoading: isCreatePipelineLoading }] = useCreatePipelineMutation();

  const handleClick = async () => {
    try {
      const response = await createPipeline({}).unwrap();
      setPipelineId(response.id);
      setPipelineName(response.name);
      setIsDataflowDiagramOpen(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <LoadingButton
      variant="contained"
      sx={{ flexShrink: 0 }}
      onClick={handleClick}
      loading={isCreatePipelineLoading}
      disabled={!(permissions?.administrate ?? true)}
    >
      <AddRounded /> {translate('Add rule')}
    </LoadingButton>
  );
};
