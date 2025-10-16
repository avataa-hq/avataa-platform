import { useCallback } from 'react';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import {
  DataflowDiagramNode,
  getErrorMessage,
  sourcesManagementApi,
  useDataflowDiagram,
  useDataflowDiagramPage,
} from '6_shared';
import { DataflowDiagram, DataflowDiagramProps } from '5_entites/dataflowDiagram/ui';
// import { DataflowDiagramNode } from '5_entites/dataflowDiagram/model';
import { DataflowDiagramContainer } from './DataflowDiagramPage.styled';
import { GeneralInformationCard, TransformsCard, ActionsCard, ExtractCard } from './cards';
import {
  // CreateModal,
  GroupModal,
  LoadModal,
  MapModal,
  // PublishModal,
  // TriggerModal,
} from './modals/actions';
import { FilterModal, SplitModal, VariableModal, JoinModal } from './modals/transforms';
import { SourceModal } from './modals/extract';
import { AggregateModal } from './modals/transforms/AggregateModal';
import { DataPreviewModal } from './modals/DataPreviewModal';
import { DataflowDiagramPageHeader } from './DataflowDiagramHeader';

const { useDeleteSourceMutation, useUpdateSourceLocationMutation } = sourcesManagementApi;

// const emptyDiagram = `
//   <?xml version="1.0" encoding="UTF-8"?>
//   <definitions
//     xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
//     id="definitions_09sxnw4"
//     name="definitions"
//     namespace="http://camunda.org/schema/1.0/dmn"
//     exporter="dmn-js (https://demo.bpmn.io/dmn)"
//     exporterVersion="14.1.1"
//   >
//      <decision id="decision_0e6nu1e" name="">
//        <decisionTable id="decisionTable_0pmgcgk">
//          <input id="input1" label="">
//            <inputExpression id="inputExpression1" typeRef="string">
//                <text></text>
//            </inputExpression>
//          </input>
//          <output id="output1" label="" name="" typeRef="string" />
//        </decisionTable>
//      </decision>
//   </definitions>
// `;

export const DataflowDiagramPage = () => {
  const {
    setIsAggregateModalOpen,
    setIsDataPreviewModalOpen,
    setIsFilterModalOpen,
    setIsGroupModalOpen,
    setIsJoinModalOpen,
    setIsLoadModalOpen,
    setIsSourceModalOpen,
    setIsSplitModalOpen,
    setIsVariableModalOpen,
    setIsMapModalOpen,
  } = useDataflowDiagramPage();

  const { pipelineId, removeNode, setIsLoading } = useDataflowDiagram();

  const openModalActions: Record<string, (payload: boolean) => void> = {
    // Transformations
    source: setIsSourceModalOpen,
    filter: setIsFilterModalOpen,
    variable: setIsVariableModalOpen,
    split: setIsSplitModalOpen,
    join: setIsJoinModalOpen,
    aggregate: setIsAggregateModalOpen,
    // Actions
    load: setIsLoadModalOpen,
    group: setIsGroupModalOpen,
    map: setIsMapModalOpen,
  };

  const [updateSourceLocation] = useUpdateSourceLocationMutation();
  const [deleteSource] = useDeleteSourceMutation();

  const onNewLink = useCallback<NonNullable<DataflowDiagramProps['onNewLink']>>((link) => {
    if (link.target.transform_type === 'join' && link.target.connections.from.length < 1) return;

    const openModalAction = openModalActions[link.target.transform_type];
    if (!openModalAction) return;

    openModalAction(true);
  }, []);

  const onNewNode = useCallback<NonNullable<DataflowDiagramProps['onNewNode']>>((node) => {
    if (node.transform_type === 'extract') {
      setIsSourceModalOpen(true);
    }
  }, []);

  const onNodeDelete = useCallback(
    async (node: DataflowDiagramNode) => {
      if (node.connections.from.length > 0 || node.transform_type === 'extract') {
        try {
          if (!pipelineId) throw new Error('No pipeline id');
          await deleteSource({ sourceId: node.id, pipelineId }).unwrap();

          if (node.transform_type === 'split') {
            node.connections.to.forEach((branchId) => removeNode(branchId));
          }

          removeNode(node.id);
        } catch (error) {
          console.error(error);
          enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
        }
      } else {
        removeNode(node.id);
      }
    },
    [deleteSource, pipelineId],
  );

  const onPreviewClick = useCallback(() => {
    setIsDataPreviewModalOpen(true);
  }, []);

  const onNodeDragEnd = useCallback<NonNullable<DataflowDiagramProps['onNodeDragEnd']>>(
    async (node) => {
      if (node.status === 'draft') return;

      try {
        if (pipelineId === null) throw new Error('No pipeline id');
        setIsLoading(true);
        await updateSourceLocation({
          sourceId: node.id,
          pipelineId,
          body: {
            x: node.x,
            y: node.y,
          },
        }).unwrap();
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
        setIsLoading(false);
      }
    },
    [pipelineId, updateSourceLocation],
  );

  return (
    <DataflowDiagramContainer>
      <Box component="div" display="flex" height="100%" position="relative">
        <Box
          component="div"
          width={320}
          zIndex={10}
          display="flex"
          flexDirection="column"
          gap="10px"
          overflow="auto"
          height="100%"
          padding="20px"
        >
          <GeneralInformationCard />
          <ExtractCard />
          <TransformsCard />
          <ActionsCard />
        </Box>
        <Box component="div" flex={1}>
          <DataflowDiagramPageHeader />
          <DataflowDiagram
            onNewLink={onNewLink}
            onNewNode={onNewNode}
            onNodeDelete={onNodeDelete}
            onNodeDragEnd={onNodeDragEnd}
            onPreviewClick={onPreviewClick}
          />
        </Box>
      </Box>

      {/* Extract Modals */}
      <SourceModal />

      {/* Transforms Modals */}
      <FilterModal />
      <SplitModal />
      <VariableModal />
      <JoinModal />
      <AggregateModal />

      {/* Actions Modals */}
      <GroupModal />
      <LoadModal />
      <MapModal />
      {/* <CreateModal /> */}
      {/* <PublishModal /> */}
      {/* <TriggerModal /> */}
      {/* <DmnModal xml={emptyDiagram} /> */}

      <DataPreviewModal />
    </DataflowDiagramContainer>
  );
};
