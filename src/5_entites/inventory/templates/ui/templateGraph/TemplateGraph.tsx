import { useEffect, useRef, useState } from 'react';
import { Background, ReactFlow, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Box,
  ActionTypes,
  InventoryObjectTypesModel,
  IObjectTemplateModel,
  IObjectTemplateObjectModel,
  LoadingAvataa,
} from '6_shared';
import { useTheme } from '@mui/material';
import { useLazyGetObjectTypesChild } from '5_entites/inventory/api';
import { ICreateChildTemplateIds, TemplateMode } from '../../model';
import { TemplateGraphContextMenu } from '../templateGraphContextMenu/TemplateGraphContextMenu';
import {
  useGetTemplateChildOptions,
  useTemplateGraphConfig,
  useTemplateGraphContextMenu,
} from '../../hooks';

interface IProps {
  templateObjectsData: IObjectTemplateObjectModel[] | undefined;
  selectedTemplate: IObjectTemplateModel | null;
  setMode: (mode: TemplateMode) => void;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  selectedObjectType: InventoryObjectTypesModel | null;
  setCreateChildTemplateIds: (data: ICreateChildTemplateIds | null) => void;
  onGraphNotValidNodeClick: (objectTypeId: number) => void;
  setEditTemplateId: (id: number | null) => void;
  objectTypeHashNames: Record<number, string>;
  isLoading: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const TemplateGraph = ({
  templateObjectsData,
  selectedTemplate,
  setMode,
  setIsTemplateModalOpen,
  selectedObjectType,
  setCreateChildTemplateIds,
  onGraphNotValidNodeClick,
  setEditTemplateId,
  objectTypeHashNames,
  isLoading,
  permissions,
}: IProps) => {
  const theme = useTheme();

  const reactFlowRef = useRef<HTMLDivElement | null>(null);

  const { nodes, edges, onNodesChange, nodeTypes } = useTemplateGraphConfig({
    templateObjectsData,
    selectedTemplate,
    objectTypeHashNames,
  });

  const {
    nodeContextMenu,
    onNodeContextMenu,
    onCloseTemplateGraphContextMenu,
    onTemplateGraphContextMenuItemClick,
    selectedNodeObjectTypeChildId,
  } = useTemplateGraphContextMenu({
    reactFlowRef,
    selectedObjectType,
    setMode,
    setIsTemplateModalOpen,
    setCreateChildTemplateIds,
    selectedTemplate,
    setEditTemplateId,
  });

  const { templateChildOptions, isGetObjectTypesChildFetching } = useGetTemplateChildOptions({
    selectedNodeObjectTypeChildId,
  });

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      sx={{
        '.react-flow__attribution': {
          display: 'none',
        },
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        >
          <LoadingAvataa />
        </Box>
      )}
      <ReactFlow
        fitView
        colorMode={theme.palette.mode}
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onCloseTemplateGraphContextMenu}
        onNodeClick={(e, node) => {
          if (!node.data.isValid) {
            onGraphNotValidNodeClick(node.data.object_type_id);
          }
        }}
        nodesConnectable={false}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <Controls position="center-right" />
        <Background />

        <TemplateGraphContextMenu
          nodeContextMenu={nodeContextMenu}
          onCloseTemplateGraphContextMenu={onCloseTemplateGraphContextMenu}
          templateChildOptions={templateChildOptions}
          onTemplateGraphContextMenuItemClick={onTemplateGraphContextMenuItemClick}
          isGetObjectTypesChildFetching={isGetObjectTypesChildFetching}
          permissions={permissions}
        />
      </ReactFlow>
    </Box>
  );
};
