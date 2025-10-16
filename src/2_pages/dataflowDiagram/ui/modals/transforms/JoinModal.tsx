import { BaseSyntheticEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { JoinFullRounded } from '@mui/icons-material';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { Tab, Button, Typography } from '@mui/material';
import { AddJoinForm, AddJoinFormInputs } from '4_features/ruleManagerDiagram';
import {
  Box,
  Modal,
  getErrorMessage,
  useTranslate,
  Table,
  transformPreviewApi,
  transformApi,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';
import { JoinTransformation } from '6_shared/api/dataview/types';

const { useGetJoinTransformationPreviewMutation } = transformPreviewApi;
const { useCreateJoinTransformationMutation } = transformApi;

const formId = 'rule-manager-diagram__filter-form';

export const JoinModal = () => {
  const translate = useTranslate();

  const { isJoinModalOpen, setIsJoinModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, removeNewLink, addNewLinkToJoin } = useDataflowDiagram();

  const [selectedTab, setSelectedTab] = useState('form');

  const [createJoinTransformation, { isLoading: isCreateJoinTransformationLoading }] =
    useCreateJoinTransformationMutation();
  const [getJoinTransformationPreview, { isLoading: isPreviewDataLoading, data: previewData }] =
    useGetJoinTransformationPreviewMutation();

  const closeModal = () => {
    setIsJoinModalOpen(false);
    setSelectedTab('form');
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const onSubmit = async ({ name, join }: AddJoinFormInputs, event?: BaseSyntheticEvent<any>) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');

      const requestBody: JoinTransformation = {
        name,
        location: {
          x: newLinkPromise.value.target.x,
          y: newLinkPromise.value.target.y,
        },
        join: { ...join, target: newLinkPromise?.value?.source.id },
      };

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        await getJoinTransformationPreview({
          sourceId: newLinkPromise.value.source.id,
          body: requestBody.join,
        }).unwrap();

        setSelectedTab('data preview');
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (pipelineId === null) throw new Error('No pipeline id');

        const response = await createJoinTransformation({
          pipelineId,
          sourceId: newLinkPromise?.value?.target.connections.from[0] ?? 0,
          body: requestBody,
        }).unwrap();

        addNewLinkToJoin({
          id: response.id,
          name: response.name,
          rows_count: response.rows_count,
          status: 'waiting',
        });
        enqueueSnackbar(translate('Success'), { variant: 'success' });
        closeModal();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Modal
      open={isJoinModalOpen}
      title={
        <Box display="flex" gap="5px">
          <JoinFullRounded />
          <Typography variant="h3" alignSelf="center">
            {translate('Join')}
          </Typography>
        </Box>
      }
      minWidth="700px"
      onClose={() => cancel()}
      actions={
        <>
          <Button variant="outlined" onClick={() => cancel()}>
            {translate('Cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isPreviewDataLoading}
            type="submit"
            form={formId}
            name="preview-button"
          >
            {translate('Preview')}
          </LoadingButton>
          <LoadingButton
            loading={isCreateJoinTransformationLoading}
            variant="contained"
            type="submit"
            form={formId}
            name="apply-button"
          >
            {translate('Apply')}
          </LoadingButton>
        </>
      }
    >
      <TabContext value={selectedTab}>
        <TabList className="simple" onChange={(e, v) => setSelectedTab(v)} sx={{ mb: '20px' }}>
          <Tab className="simple" value="form" label={translate('Form')} />
          <Tab
            className="simple"
            value="data preview"
            label={translate('Data preview')}
            disabled={!previewData}
          />
        </TabList>
        <Box component="div" sx={{ ...(selectedTab !== 'form' && { display: 'none' }) }}>
          <AddJoinForm
            id={formId}
            rootSourceId={newLinkPromise?.value?.target.connections.from[0]}
            targetSourceId={newLinkPromise?.value?.source.id}
            onSubmit={onSubmit}
          />
        </Box>
        <Box
          component="div"
          sx={{
            ...(selectedTab !== 'data preview' && { display: 'none' }),
            height: '500px',
            overflow: 'hidden',
          }}
        >
          <Table tableData={previewData?.data} />
        </Box>
      </TabContext>
    </Modal>
  );
};
