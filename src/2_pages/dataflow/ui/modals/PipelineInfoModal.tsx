import { Avatar, Box, Typography, Divider, Button } from '@mui/material';
import { OpenInNewRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import {
  LineChart,
  Modal,
  getErrorMessage,
  useTranslate,
  pipelinesManagementApi,
  ActionTypes,
  useDataflowPage,
  useConfig,
} from '6_shared';

const { useSetPipelineActivityMutation, useTriggerPipelineMutation } = pipelinesManagementApi;

const labels = [0, 100, 200, 300, 400, 500];

const datasets = [
  {
    data: labels.map(() => Math.random()),
  },
  {
    data: labels.map(() => Math.random()),
  },
];

export const PipelineInfoModal = ({
  permissions,
}: {
  permissions?: Record<ActionTypes, boolean>;
}) => {
  const translate = useTranslate();

  const { userRoles } = useConfig();

  const {
    isPipelineInfoModalOpen,
    selectedPipeline,
    setDeletePipelineModalOpen,
    setPipelineInfoModalOpen,
  } = useDataflowPage();

  const [setPipelineActivity, { isLoading: isSetPipelineActivityLoading }] =
    useSetPipelineActivityMutation();
  const [triggerPipeline, { isLoading: isTriggerPipelineLoading }] = useTriggerPipelineMutation();

  const handlePipelineDelete = async () => {
    setDeletePipelineModalOpen(true);
  };

  const handlePipelineActivityChange = async () => {
    try {
      if (!selectedPipeline) throw new Error('No selected pipeline');
      if (!selectedPipeline.dag_id) return;

      await setPipelineActivity({
        pipelineId: selectedPipeline.dag_id,
        is_paused: selectedPipeline.status !== 'off',
      }).unwrap();
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  const handlePipelineTrigger = async () => {
    try {
      if (!selectedPipeline) throw new Error('No selected pipeline');
      if (!selectedPipeline.dag_id) return;

      await triggerPipeline(selectedPipeline.dag_id).unwrap();
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      title={selectedPipeline?.name ?? translate('Information')}
      open={isPipelineInfoModalOpen}
      onClose={() => setPipelineInfoModalOpen(false)}
      actions={
        <Box component="div" display="flex" justifyContent="space-between" width="100%">
          <Button
            disabled={!selectedPipeline?.link}
            component="a"
            variant="outlined"
            href={selectedPipeline?.link}
            target="_blank"
          >
            {translate('Details')}
            <OpenInNewRounded />
          </Button>
          <Box component="div" display="flex" gap="5px" alignItems="center">
            <LoadingButton
              loading={isSetPipelineActivityLoading || isTriggerPipelineLoading}
              onClick={handlePipelineTrigger}
              variant="contained"
              disabled={!(permissions?.update ?? true)}
            >
              {translate('Start')}
            </LoadingButton>
            <LoadingButton
              loading={isSetPipelineActivityLoading || isTriggerPipelineLoading}
              onClick={handlePipelineActivityChange}
              variant="contained"
              disabled={!(permissions?.update ?? true)}
            >
              {translate(selectedPipeline?.is_paused === true ? 'Resume' : 'Pause')}
            </LoadingButton>
            {userRoles?.includes('Pages_dataFlow_admin') && (
              <Button
                variant="outlined"
                onClick={handlePipelineDelete}
                disabled={!(permissions?.update ?? true)}
              >
                {translate('Delete')}
              </Button>
            )}
          </Box>
        </Box>
      }
    >
      <Box component="div" display="flex" minWidth="500px">
        <Box component="div" display="flex" flexDirection="column" gap="15px">
          <Box component="div" display="flex" flexDirection="column" gap="10px">
            <Typography lineHeight="17px">{translate('Owner')}</Typography>
            <Avatar />
          </Box>
          <Box component="div" display="flex" flexDirection="column" gap="10px">
            <Typography lineHeight="17px">{translate('Generated')}</Typography>
            <Typography lineHeight="17px">
              26.10.2020 <span style={{ opacity: 0.3, fontWeight: 400 }}>21:08:11</span>
            </Typography>
          </Box>
          <Box component="div" display="flex" flexDirection="column" gap="10px">
            <Typography lineHeight="17px">{translate('Changed')}</Typography>
            <Typography lineHeight="17px">
              27.10.2020 <span style={{ opacity: 0.3, fontWeight: 400 }}>11:08:17</span>
            </Typography>
          </Box>
        </Box>
        <Divider orientation="vertical" sx={{ mx: '0.625rem' }} flexItem />
        <LineChart
          sx={{ minHeight: '230px' }}
          data={{
            labels,
            datasets,
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            elements: {
              line: {
                tension: 0.5,
                borderWidth: 1.5,
              },
              point: {
                radius: 0,
              },
            },
          }}
        />
      </Box>
    </Modal>
  );
};
