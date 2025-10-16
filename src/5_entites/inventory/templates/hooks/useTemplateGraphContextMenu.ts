import React, { useCallback, useState } from 'react';
import { useDeleteTemplateObject } from '5_entites/inventory/api';
import { useFormContext } from 'react-hook-form';
import { InventoryObjectTypesModel, IObjectTemplateModel } from '6_shared';
import {
  ICreateChildTemplateIds,
  ICustomTemplateGraphNode,
  ITemplateGraphContextMenuItem,
  ITemplateGraphContextMenuPosition,
  TemplateMode,
} from '../model';

interface IProps {
  reactFlowRef: React.RefObject<HTMLDivElement> | null;
  selectedObjectType: InventoryObjectTypesModel | null;
  selectedTemplate: IObjectTemplateModel | null;
  setMode: (mode: TemplateMode) => void;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  setCreateChildTemplateIds: (data: ICreateChildTemplateIds | null) => void;
  setEditTemplateId: (id: number | null) => void;
}

export const useTemplateGraphContextMenu = ({
  reactFlowRef,
  selectedObjectType,
  selectedTemplate,
  setMode,
  setIsTemplateModalOpen,
  setCreateChildTemplateIds,
  setEditTemplateId,
}: IProps) => {
  const { reset } = useFormContext();

  const [nodeContextMenu, setNodeContextMenu] = useState<ITemplateGraphContextMenuPosition | null>(
    null,
  );
  const [selectedNodeObjectTypeChildId, setSelectedNodeObjectTypeId] = useState<number | null>(
    null,
  );

  const { deleteTemplateObjectFn } = useDeleteTemplateObject();

  const onNodeContextMenu = useCallback(
    (event: any, node: ICustomTemplateGraphNode) => {
      event.preventDefault();

      if (reactFlowRef?.current) {
        // const pane = reactFlowRef.current.getBoundingClientRect();
        setSelectedNodeObjectTypeId(node.data.object_type_id as number);
        setNodeContextMenu({
          node,
          top: event.clientY,
          left: event.clientX,
        });
      }
    },
    [reactFlowRef, setSelectedNodeObjectTypeId],
  );

  const onCloseTemplateGraphContextMenu = useCallback(() => {
    setNodeContextMenu(null);
    setSelectedNodeObjectTypeId(null);
  }, []);

  const onTemplateGraphContextMenuItemClick = useCallback(
    async ({ menuType, objType, templateObjectId }: ITemplateGraphContextMenuItem) => {
      switch (menuType) {
        case 'addChild': {
          if (!selectedObjectType || !selectedTemplate || !objType) return;
          if (nodeContextMenu) {
            setMode('createChild');
            setCreateChildTemplateIds({
              object_type_id: objType.id,
              template_id: selectedTemplate.id,
              parent_id: +nodeContextMenu.node.id,
            });
            setIsTemplateModalOpen(true);
          }

          reset();
          onCloseTemplateGraphContextMenu();
          break;
        }

        case 'edit': {
          if (!selectedObjectType || !selectedTemplate || !templateObjectId) return;
          setEditTemplateId(templateObjectId);
          setMode('edit');
          setIsTemplateModalOpen(true);
          onCloseTemplateGraphContextMenu();
          break;
        }

        case 'delete': {
          if (!templateObjectId) return;
          await deleteTemplateObjectFn(templateObjectId);
          onCloseTemplateGraphContextMenu();
          break;
        }

        default: {
          break;
        }
      }
    },
    [
      deleteTemplateObjectFn,
      nodeContextMenu,
      onCloseTemplateGraphContextMenu,
      reset,
      selectedObjectType,
      selectedTemplate,
      setCreateChildTemplateIds,
      setEditTemplateId,
      setIsTemplateModalOpen,
      setMode,
    ],
  );

  return {
    nodeContextMenu,
    onNodeContextMenu,
    onCloseTemplateGraphContextMenu,
    onTemplateGraphContextMenuItemClick,
    selectedNodeObjectTypeChildId,
  };
};
