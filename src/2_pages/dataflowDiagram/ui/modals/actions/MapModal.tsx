import { BaseSyntheticEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { Tab, Button, Typography } from '@mui/material';
import { Compare } from '@mui/icons-material';
import { MapFormInputs, MapForm } from '4_features/ruleManagerDiagram';
import {
  Box,
  Modal,
  useTranslate,
  getErrorMessage,
  Table,
  TabsWrapper,
  transformPreviewApi,
  dataviewActionApi,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';

import { ExportPreviewButton } from '../../buttons';

const { useGetMapTransformationPreviewMutation } = transformPreviewApi;
const { useMapActionMutation } = dataviewActionApi;

const formId = 'rule-manager-diagram__map-form';

export const MapModal = () => {
  const translate = useTranslate();
  const [selectedTab, setSelectedTab] = useState('form');
  const [newSourceId, setNewSourceId] = useState<number | null>(null);

  const { isMapModalOpen, setIsMapModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, addNewLink, removeNewLink } = useDataflowDiagram();

  const [createMapAction, { isLoading: isMapActionLoading }] = useMapActionMutation();

  const [getMapTransformationPreview, { isLoading: isPreviewDataLoading, data: previewData }] =
    useGetMapTransformationPreviewMutation();

  const closeModal = () => {
    setIsMapModalOpen(false);
    setSelectedTab('form');
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const onSubmit = async (data: MapFormInputs, event?: BaseSyntheticEvent<any>) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');
      setNewSourceId(newLinkPromise.value.source.id);

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        const { name, ...body } = data;

        await getMapTransformationPreview({
          sourceId: newLinkPromise.value.source.id,
          body,
        }).unwrap();

        setSelectedTab('data preview');
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (!pipelineId) throw new Error('No pipeline id');

        const response = await createMapAction({
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
      open={isMapModalOpen}
      title={
        <Box display="flex" gap="5px">
          <Compare />
          <Typography variant="h3" alignSelf="center">
            {translate('Map')}
          </Typography>
        </Box>
      }
      onClose={() => cancel()}
      actions={
        <>
          <Button variant="outlined" onClick={() => cancel()}>
            {translate('Cancel')}
          </Button>
          {selectedTab === 'data preview' && <ExportPreviewButton sourceId={newSourceId} />}
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
            variant="contained"
            loading={isMapActionLoading}
            type="submit"
            form={formId}
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
              disabled={!previewData}
              onClick={() => setSelectedTab('data preview')}
            />
          </TabList>
          <Box component="div" sx={{ ...(selectedTab !== 'form' && { display: 'none' }) }}>
            <MapForm id={formId} sourceId={newLinkPromise?.value?.source.id} onSubmit={onSubmit} />
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
