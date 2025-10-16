import { BaseSyntheticEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TabContext, TabList, LoadingButton } from '@mui/lab';
import { Tab, Button, Typography } from '@mui/material';
import { v4 as uuid } from 'uuid';
import {
  AddSplitForm,
  AddSplitFormInputs,
  isValidFilterFormState,
} from '4_features/ruleManagerDiagram';
import { convertNewTransformationResponseToNode } from '5_entites/dataflowDiagram/lib/convertNewTransformationResponseToNode';
import { setSplitBranchesCoordinates } from '5_entites/dataflowDiagram/lib';
import {
  Box,
  Icons,
  Modal,
  useTranslate,
  getErrorMessage,
  Table,
  sourcesManagementApi,
  transformPreviewApi,
  transformApi,
  INestedFilterForwardRef,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';
import { SplitTransformation } from '6_shared/api/dataview/types';
import { ExportPreviewButton } from '../../buttons';

const { useUpdateSourceLocationMutation } = sourcesManagementApi;
const { useGetSplitTransformationPreviewMutation } = transformPreviewApi;
const { useCreateSplitTransformationMutation } = transformApi;

const formId = 'rule-manager-diagram__split-form';

export const SplitModal = () => {
  const translate = useTranslate();

  const { isSplitModalOpen, setIsSplitModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, addNewLinkToSplit, removeNewLink } = useDataflowDiagram();

  const [selectedTab, setSelectedTab] = useState('form');
  const [newSourceId, setNewSourceId] = useState<number | null>(null);

  const [createSplitTransformation, { isLoading: isCreateSplitTransformationLoading }] =
    useCreateSplitTransformationMutation();
  const [getSplitTransformationPreview, { isLoading: isPreviewDataLoading, data: previewData }] =
    useGetSplitTransformationPreviewMutation();
  const [updateSourceLocation, { isLoading: isUpdateSourceLocationLoading }] =
    useUpdateSourceLocationMutation();

  const closeModal = () => {
    setIsSplitModalOpen(false);
    setSelectedTab('form');
  };

  const onSubmit = async (
    { name, branches }: AddSplitFormInputs,
    event?: BaseSyntheticEvent<any>,
    filterRef?: INestedFilterForwardRef | null,
  ) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');
      setNewSourceId(newLinkPromise.value.source.id);

      const splitNodeLocation = {
        x: newLinkPromise.value.target.x,
        y: newLinkPromise.value.target.y,
      };

      const requestBody: SplitTransformation = {
        name,
        location: splitNodeLocation,
        branches: branches.map((branch) =>
          branch.columnFilters.map(({ column, filters: columnFilters, logicalOperator }) => ({
            column: column.name,
            rule: logicalOperator,
            filters: columnFilters,
          })),
        ) as SplitTransformation['branches'],
      };

      if (event?.nativeEvent.submitter?.name === 'preview-button') {
        await getSplitTransformationPreview({
          sourceId: newLinkPromise.value.source.id,
          body: requestBody.branches,
        }).unwrap();

        setSelectedTab('data preview 0');
      }

      if (event?.nativeEvent.submitter?.name === 'apply-button') {
        if (!pipelineId) throw new Error('No pipeline id');
        const isValidFormState = await isValidFilterFormState(filterRef ?? null);
        if (!isValidFormState) return;

        const response = await createSplitTransformation({
          pipelineId,
          sourceId: newLinkPromise?.value?.source.id,
          body: requestBody,
        }).unwrap();
        const convertedBranches = response.data.map((branch) => ({
          ...convertNewTransformationResponseToNode(branch),
          status: response.status ?? 'accepted',
        }));
        const branchesWithCoordinates = setSplitBranchesCoordinates(
          splitNodeLocation,
          convertedBranches,
        );

        branchesWithCoordinates.forEach((branch) => {
          updateSourceLocation({
            pipelineId,
            sourceId: branch.id,
            body: {
              x: branch.x,
              y: branch.y,
            },
          });
        });

        addNewLinkToSplit({
          splitNode: {
            id: response.id,
            name: response.name,
            rows_count: response.rows_count,
            status: 'waiting',
          },
          branches: branchesWithCoordinates,
        });
        enqueueSnackbar(translate('Success'), { variant: 'success' });
        closeModal();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  return (
    <Modal
      minWidth="700px"
      open={isSplitModalOpen}
      title={
        <Box display="flex" gap="5px">
          <Icons.SplitIcon />
          <Typography variant="h3" alignSelf="center">
            {translate('Split')}
          </Typography>
        </Box>
      }
      onClose={() => cancel()}
      actions={
        <>
          <Button variant="outlined" onClick={() => cancel()}>
            {translate('Cancel')}
          </Button>
          {selectedTab !== 'form' &&
            previewData &&
            previewData.branches.map(
              (_, i) =>
                selectedTab !== `data preview ${i}` && (
                  <ExportPreviewButton key={i} sourceId={newSourceId} />
                ),
            )}
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
            loading={isCreateSplitTransformationLoading || isUpdateSourceLocationLoading}
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
        <TabList
          className="simple"
          onChange={(e, v) => setSelectedTab(v)}
          sx={{ mb: '20px' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab className="simple" value="form" label={translate('Form')} />
          {previewData ? (
            previewData.branches.map((_branch, i) => (
              <Tab
                className="simple"
                key={i}
                value={`data preview ${i}`}
                label={`${translate('Data preview')} (branch ${i + 1})`}
              />
            ))
          ) : (
            <Tab
              className="simple"
              value="data preview"
              label={translate('Data preview')}
              disabled
            />
          )}
        </TabList>
        <Box component="div" sx={{ ...(selectedTab !== 'form' && { display: 'none' }) }}>
          <AddSplitForm
            id={formId}
            onSubmit={onSubmit}
            sourceId={newLinkPromise?.value?.source.id}
          />
        </Box>
        {previewData?.branches.map((branch, i) => (
          <Box
            component="div"
            key={uuid()}
            sx={{
              ...(selectedTab !== `data preview ${i}` && { display: 'none' }),
              height: '500px',
              overflow: 'hidden',
            }}
          >
            <Table tableData={branch.data} />
          </Box>
        ))}
      </TabContext>
    </Modal>
  );
};
