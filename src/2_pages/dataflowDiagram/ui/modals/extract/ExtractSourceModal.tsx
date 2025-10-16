import { enqueueSnackbar } from 'notistack';
import { BaseSyntheticEvent, useState } from 'react';
import { Tab, Button, Typography } from '@mui/material';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { ExtractSourceForm, isValidFilterFormState } from '4_features/ruleManagerDiagram';
import {
  Box,
  Icons,
  Modal,
  useTranslate,
  Table,
  TabsWrapper,
  getErrorMessage,
  dataviewExtractApi,
  transformPreviewApi,
  INestedFilterForwardRef,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';
import { ExtractSource } from '6_shared/api/dataview/types';
import { ExportPreviewButton } from '../../buttons';

const { useExtractSourceMutation } = dataviewExtractApi;
const { useGetExtractTransformationPreviewMutation } = transformPreviewApi;

const formId = 'rule-manager-diagram__source-form';

export const SourceModal = () => {
  const translate = useTranslate();
  const { isSourceModalOpen, setIsSourceModalOpen } = useDataflowDiagramPage();
  const { newNodePromise, pipelineId, addNewNode, removeNewNode, setIsDiagramChanged } =
    useDataflowDiagram();

  const [selectedTab, setSelectedTab] = useState<'form' | 'data preview'>('form');
  const [newSourceId, setNewSourceId] = useState<number | null>(null);

  const [extractSource, { isLoading: isExtractSourceLoading }] = useExtractSourceMutation();
  const [getExtractTransformationPreview, { isLoading: isDataPreviewFetching, data: previewData }] =
    useGetExtractTransformationPreviewMutation();

  const closeModal = () => {
    setIsSourceModalOpen(false);
    setSelectedTab('form');
  };

  const onSubmit = async (
    { sourceId, ...source }: Omit<ExtractSource, 'location'> & { sourceId: number },
    event?: BaseSyntheticEvent<any>,
    filterRef?: INestedFilterForwardRef | null,
  ) => {
    try {
      setNewSourceId(sourceId);
      if (newNodePromise === null) throw new Error('New node promise is null');

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        await getExtractTransformationPreview({
          sourceId,
          body: {
            columns: source.columns,
            filters: source.filters,
          },
        });

        setSelectedTab('data preview');
        // await getSourceData(sourceId).unwrap();
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (!pipelineId) throw new Error('No pipeline id');
        const isValidFormState = await isValidFilterFormState(filterRef ?? null);
        if (!isValidFormState) return;

        const extractedSource = await extractSource({
          pipelineId,
          sourceId,
          body: {
            ...source,
            location: { x: newNodePromise.value.x, y: newNodePromise.value.y },
          },
        }).unwrap();

        addNewNode({
          ...extractedSource,
          // TODO: Check if the status corresponds to the real one
          // status: 'accepted'
        });

        closeModal();
        setIsDiagramChanged(true);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const cancel = () => {
    removeNewNode();
    closeModal();
  };

  return (
    <Modal
      minWidth="700px"
      open={isSourceModalOpen}
      title={
        <Box display="flex" gap="5px">
          <Icons.DataIcon />
          <Typography variant="h3" alignSelf="center">
            {translate('Source')}
          </Typography>
        </Box>
      }
      onClose={closeModal}
      actions={
        <>
          <Button variant="outlined" onClick={cancel}>
            {translate('Cancel')}
          </Button>
          {selectedTab === 'data preview' && <ExportPreviewButton sourceId={newSourceId} />}
          <LoadingButton
            variant="contained"
            type="submit"
            form={formId}
            loading={isDataPreviewFetching}
            name="preview-button"
          >
            {translate('Preview')}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            type="submit"
            form={formId}
            loading={isExtractSourceLoading}
            name="apply-button"
          >
            {translate('Apply')}
          </LoadingButton>
        </>
      }
    >
      <TabsWrapper>
        <TabContext value={selectedTab}>
          <TabList className="simple" sx={{ mb: '20px' }}>
            <Tab
              className="simple"
              value="form"
              label={translate('Form')}
              onClick={() => setSelectedTab('form')}
            />
            <Tab
              className="simple"
              value="data preview"
              label={translate('Data preview')}
              disabled={!previewData || isDataPreviewFetching}
              onClick={() => setSelectedTab('data preview')}
            />
          </TabList>
          <Box component="div" sx={{ ...(selectedTab !== 'form' && { display: 'none' }) }}>
            <ExtractSourceForm id={formId} onSubmit={onSubmit} />
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
      </TabsWrapper>
    </Modal>
  );
};
