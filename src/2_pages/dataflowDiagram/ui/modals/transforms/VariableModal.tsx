import { BaseSyntheticEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { Tab, Button, Typography } from '@mui/material';
import { AddVariableForm, AddVariableFormInputs } from '4_features/ruleManagerDiagram';
import {
  Box,
  Icons,
  Modal,
  getErrorMessage,
  useTranslate,
  Table,
  transformPreviewApi,
  transformApi,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';

const { useGetVariableTransformationPreviewMutation } = transformPreviewApi;
const { useCreateVariableTransformationMutation } = transformApi;

const formId = 'rule-manager-diagram__variable-form';

export const VariableModal = () => {
  const translate = useTranslate();

  const { isVariableModalOpen, setIsVariableModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, addNewLink, removeNewLink } = useDataflowDiagram();

  const [selectedTab, setSelectedTab] = useState('form');

  const [createVariableTransformation, { isLoading: isCreateVariableTransformationLoading }] =
    useCreateVariableTransformationMutation();
  const [getVariableTransformationPreview, { isLoading: isPreviewDataLoading, data: previewData }] =
    useGetVariableTransformationPreviewMutation();

  const closeModal = () => {
    setIsVariableModalOpen(false);
    setSelectedTab('form');
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const onSubmit = async (data: AddVariableFormInputs, event?: BaseSyntheticEvent<any>) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        await getVariableTransformationPreview({
          sourceId: newLinkPromise.value.source.id,
          body: data.variable,
        }).unwrap();

        setSelectedTab('data preview');
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (!pipelineId) throw new Error('No pipeline id');

        const response = await createVariableTransformation({
          pipelineId,
          sourceId: newLinkPromise.value.source.id,
          body: {
            ...data,
            location: {
              x: newLinkPromise.value.target.x,
              y: newLinkPromise.value.target.y,
            },
          },
        }).unwrap();

        addNewLink({
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
      minWidth="700px"
      open={isVariableModalOpen}
      title={
        <Box display="flex" gap="5px">
          <Icons.VariableIcon />
          <Typography variant="h3" alignSelf="center">
            {translate('Variable')}
          </Typography>
        </Box>
      }
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
            loading={isCreateVariableTransformationLoading}
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
          <AddVariableForm id={formId} onSubmit={onSubmit} />
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
