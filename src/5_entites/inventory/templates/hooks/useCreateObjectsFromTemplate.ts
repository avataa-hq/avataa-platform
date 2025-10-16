import { useState } from 'react';
import { useCreateObject } from '5_entites/inventory/api';
import { createObject } from '5_entites/inventory/lib';
import store from 'store';
import { enqueueSnackbar } from 'notistack';
import { getErrorMessage, useObjectCRUD } from '6_shared';
import { ITemplateParamsFromData } from '../model';

export const useCreateObjectsFromTemplate = () => {
  const [withRequiredParamsStack, setWithRequiredParamsStack] = useState(0);
  const [isCreateObjectModalOpen, setIsCreateObjectModalOpen] = useState(false);

  const {
    setIsObjectCRUDModalOpen,
    setObjectTmoId,
    setTemplateFormData,
    setParentIdFromTemplates,
  } = useObjectCRUD();

  const { createObjectFn } = useCreateObject();

  const openModal = (tmoId: number, params: any) => {
    setObjectTmoId(tmoId);
    setTemplateFormData(params);
    setIsObjectCRUDModalOpen(true);
  };

  const waitForModalClose = () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        setIsCreateObjectModalOpen((prev) => {
          if (state.objectCRUD.objectCRUDComponentUi.isObjectCRUDModalOpen !== prev) return true;
          return prev;
        });
        if (!state.objectCRUD.objectCRUDComponentUi.isObjectCRUDModalOpen) {
          unsubscribe();
          resolve();
        }
      });
    });
  };

  // const handleModalIfNeeded = async (objectTypeId: number, params: any) => {
  //   openModal(objectTypeId, params);
  //   await waitForModalClose();
  //   setWithRequiredParamsStack((prev) => prev - 1);
  // };

  const handleModalIfNeeded = async (
    objectTypeId: number,
    params: any,
    parentId?: number | null,
  ) => {
    setParentIdFromTemplates(parentId ?? null);
    openModal(objectTypeId, params);
    await waitForModalClose();
    setWithRequiredParamsStack((prev) => prev - 1);

    const state = store.getState();
    return state.objectCRUD.lastCreatedObjectId;
  };

  const createNodeRecursive = async (
    node: ITemplateParamsFromData & { children?: ITemplateParamsFromData[] },
    parentId?: number | null,
  ): Promise<void> => {
    let createdObjectId: number | null;

    if (parentId === undefined || node.hasEmptyRequiredParams) {
      createdObjectId = await handleModalIfNeeded(node.objectTypeId, node.params, parentId);
    } else {
      const res = await createObject({
        objectTmoId: node.objectTypeId,
        values: node.params,
        objectParentID: parentId,
        createObjectFn,
      });

      createdObjectId = res.id;
    }

    if (node.children?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of node.children) {
        // eslint-disable-next-line no-await-in-loop
        await createNodeRecursive(child, createdObjectId);
      }
    }
  };

  const runCreationObjectsFromTemplate = async (
    tree: (ITemplateParamsFromData & { children?: ITemplateParamsFromData[] })[],
  ) => {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const rootNode of tree) {
        // eslint-disable-next-line no-await-in-loop
        await createNodeRecursive(rootNode);
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  // const runCreationObjectsFromTemplate = async (
  //   newTemplateParamsFormData: ITemplateParamsFromData[],
  // ) => {
  //   try {
  //     const { nodesForModal, nodesForCreate } = newTemplateParamsFormData.reduce(
  //       (acc, node, index) => {
  //         if (index === 0 || node.hasEmptyRequiredParams) {
  //           acc.nodesForModal.push(node);
  //         } else {
  //           acc.nodesForCreate.push(node);
  //         }
  //         return acc;
  //       },
  //       {
  //         nodesForModal: [] as ITemplateParamsFromData[],
  //         nodesForCreate: [] as ITemplateParamsFromData[],
  //       },
  //     );

  //     await nodesForModal.reduce(async (prevPromise, node) => {
  //       await prevPromise;
  //       return handleModalIfNeeded(node.objectTypeId, node.params);
  //     }, Promise.resolve());

  //     await Promise.all(
  //       nodesForCreate.map((node) =>
  //         createObject({ objectTmoId: node.objectTypeId, values: node.params, createObjectFn }),
  //       ),
  //     );

  //   } catch (error) {
  //     enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  //   }
  // };

  return {
    runCreationObjectsFromTemplate,
    withRequiredParamsStack,
    setWithRequiredParamsStack,
    isCreateObjectModalOpen,
    setIsCreateObjectModalOpen,
  };
};
