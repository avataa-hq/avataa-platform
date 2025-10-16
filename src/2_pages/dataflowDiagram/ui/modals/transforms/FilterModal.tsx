import { BaseSyntheticEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { Tab, Button, Typography } from '@mui/material';
import { FilterAltRounded } from '@mui/icons-material';
import {
  AddFilterForm,
  AddFilterFormInputs,
  isValidFilterFormState,
} from '4_features/ruleManagerDiagram';
import {
  transformPreviewApi,
  Box,
  Modal,
  getErrorMessage,
  useTranslate,
  Table,
  transformApi,
  INestedFilterForwardRef,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';
import { FilterTransformation } from '6_shared/api/dataview/types';

import { ExportPreviewButton } from '../../buttons';

const { useGetFilterTransformationPreviewMutation } = transformPreviewApi;
const { useCreateFilterTransformationMutation } = transformApi;

const formId = 'rule-manager-diagram__filter-form';

export const FilterModal = () => {
  const translate = useTranslate();

  const { isFilterModalOpen, setIsFilterModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, addNewLink, removeNewLink } = useDataflowDiagram();

  const [selectedTab, setSelectedTab] = useState('form');
  const [newSourceId, setNewSourceId] = useState<number | null>(null);

  const closeModal = () => {
    setIsFilterModalOpen(false);
    setSelectedTab('form');
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const [createFilterTransformation, { isLoading: isCreateFilterTransformationLoading }] =
    useCreateFilterTransformationMutation();
  const [getFilterTransformationPreview, { data: previewData, isLoading: isPreviewDataLoading }] =
    useGetFilterTransformationPreviewMutation();

  const onSubmit = async (
    { name, filter }: AddFilterFormInputs,
    event?: BaseSyntheticEvent<any>,
    filterRef?: INestedFilterForwardRef | null,
  ) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');
      setNewSourceId(newLinkPromise.value.source.id);

      const requestBody: FilterTransformation = {
        name,
        location: {
          x: newLinkPromise.value.target.x,
          y: newLinkPromise.value.target.y,
        },
        filters: filter.columnFilters.map(({ column, filters, logicalOperator }) => ({
          column: column.name,
          rule: logicalOperator,
          filters,
        })) as FilterTransformation['filters'],
      };

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        await getFilterTransformationPreview({
          sourceId: newLinkPromise.value.source.id,
          body: requestBody.filters,
        }).unwrap();

        setSelectedTab('data preview');
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (!pipelineId) throw new Error('No pipeline id');
        const isValidFormState = await isValidFilterFormState(filterRef ?? null);
        if (!isValidFormState) return;

        const response = await createFilterTransformation({
          pipelineId,
          sourceId: newLinkPromise.value.source.id,
          body: requestBody,
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
      open={isFilterModalOpen}
      title={
        <Box display="flex" gap="5px">
          <FilterAltRounded />
          <Typography variant="h3" alignSelf="center">
            {translate('Filter')}
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
            loading={isCreateFilterTransformationLoading}
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
            disabled={!previewData?.data}
          />
        </TabList>
        <Box component="div" sx={{ ...(selectedTab !== 'form' && { display: 'none' }) }}>
          <AddFilterForm
            id={formId}
            sourceId={newLinkPromise?.value?.source.id}
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
