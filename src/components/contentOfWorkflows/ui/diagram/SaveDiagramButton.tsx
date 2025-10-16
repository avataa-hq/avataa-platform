import { enqueueSnackbar } from 'notistack';
import { Badge } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getErrorMessage, useTranslate, useWorkflows, zeebeClientApi } from '6_shared';
import { useGetBpmnDiagramFile } from '../../lib';

const { useDeployProcessDefinitionMutation } = zeebeClientApi;

interface IProps {
  refetchProcessDefinitions: () => void;
}

export const SaveDiagramButton = ({ refetchProcessDefinitions }: IProps) => {
  const translate = useTranslate();

  const { isDiagramChanged, setIsDiagramChanged } = useWorkflows();

  const [deployProcessDefinition, { isLoading }] = useDeployProcessDefinitionMutation();
  const getBpmnDiagramFile = useGetBpmnDiagramFile();

  const saveDiagram = async () => {
    const file = await getBpmnDiagramFile();

    if (!file) {
      enqueueSnackbar({
        variant: 'error',
        message: translate('An error occured: .bpmn file is missing'),
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      await deployProcessDefinition(formData).unwrap();
      setIsDiagramChanged(false);
      enqueueSnackbar({
        variant: 'success',
        message: translate('Successfully saved'),
      });
      refetchProcessDefinitions();
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <LoadingButton loading={isLoading} variant="contained" onClick={saveDiagram}>
      <Badge
        color="warning"
        variant="dot"
        invisible={!isDiagramChanged || isLoading}
        sx={{ '.MuiBadge-badge': { top: '-5px', right: '-15px' } }}
      >
        {translate('Save')}
      </Badge>
    </LoadingButton>
  );
};
