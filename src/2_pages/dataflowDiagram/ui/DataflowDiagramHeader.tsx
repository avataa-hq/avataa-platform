import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackRounded } from '@mui/icons-material';
import {
  CronExpressionInput,
  pipelinesManagementApi,
  useDataflowDiagram,
  useDataflowDiagramPage,
  useTranslate,
} from '6_shared';

import { LoadingIndicator } from './LoadingIndicator';
import { ApplyButton } from './buttons';

const { useCancelPipelineChangesMutation } = pipelinesManagementApi;

export const DataflowDiagramPageHeader = () => {
  const translate = useTranslate();
  const theme = useTheme();

  const { setIsDataflowDiagramOpen } = useDataflowDiagramPage();

  const {
    pipelineId,
    pipelineSchedule,
    isDiagramChanged,
    nodes,
    resetDiagramState,
    setPipelineSchedule,
  } = useDataflowDiagram();

  const [cancelPipelineChanges, { isLoading: isCancelPipelineChangesLoading }] =
    useCancelPipelineChangesMutation();

  const undoChanges = async () => {
    if (pipelineId !== null) await cancelPipelineChanges(pipelineId);
    resetDiagramState();
    setIsDataflowDiagramOpen(false);
  };

  const returnToDataflowPage = async () => {
    if (pipelineId !== null && nodes.length < 1) await cancelPipelineChanges(pipelineId);
    resetDiagramState();
    setIsDataflowDiagramOpen(false);
  };

  return (
    <Box
      component="div"
      padding="20px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      position="relative"
      zIndex={100}
    >
      <Box
        component="div"
        display="flex"
        alignItems="center"
        gap="10px"
        // position="relative"
        // zIndex={100}
      >
        <IconButton
          onClick={returnToDataflowPage}
          data-testid="dataflow-add-rule__raturn-button"
          sx={{
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <ArrowBackRounded />
        </IconButton>
        <Box component="div">
          <Typography sx={{ mb: '5px' }}>{translate('Schedule')}</Typography>
          <CronExpressionInput
            initialValue={pipelineSchedule}
            onChange={(value) => setPipelineSchedule(value)}
          />
        </Box>
      </Box>
      <Box component="div" display="flex" gap="5px" alignItems="center">
        <LoadingIndicator />
        <LoadingButton
          loading={isCancelPipelineChangesLoading}
          disabled={!isDiagramChanged}
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
          onClick={undoChanges}
        >
          {translate('Undo changes')}
        </LoadingButton>
        <ApplyButton />
      </Box>
    </Box>
  );
};
