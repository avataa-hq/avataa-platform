import { enqueueSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Modal, Box, useTranslate, getErrorMessage, zeebeClientApi, useWorkflows } from '6_shared';
import { useGetBpmnDiagramFile } from '../../lib';

export const SaveWarningModal = () => {
  const { useDeployProcessDefinitionMutation } = zeebeClientApi;

  const translate = useTranslate();

  const {
    saveWarningModalState: { isOpen, resolveFn, rejectFn },
  } = useWorkflows();

  const getBpmnDiagramFile = useGetBpmnDiagramFile();

  const [deployProcessDefinition, { isLoading }] = useDeployProcessDefinitionMutation();

  return (
    <Modal
      title="Save changes"
      open={isOpen}
      width="500px"
      onClose={() => rejectFn?.()}
      actions={
        <Box width="100%" display="flex" justifyContent="space-evenly">
          <Button onClick={() => resolveFn?.()} variant="contained">
            Leave without saving
          </Button>
          <LoadingButton
            loading={isLoading}
            onClick={async () => {
              const file = await getBpmnDiagramFile();
              if (!file) {
                enqueueSnackbar({
                  variant: 'error',
                  message: translate('An error occured: .bpmn file is missing'),
                });
                return;
              }

              const formData = new FormData();
              formData.append('file', file);
              try {
                await deployProcessDefinition(formData).unwrap();
                resolveFn?.();
              } catch (error) {
                rejectFn?.();
                enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
              }
            }}
            variant="contained"
          >
            Save and leave
          </LoadingButton>
        </Box>
      }
    >
      <Box sx={{ textAlign: 'center' }}>Are you sure you want to leave without saving ?</Box>
    </Modal>
  );
};
