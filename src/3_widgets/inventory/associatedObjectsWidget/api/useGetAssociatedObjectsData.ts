import { useMemo } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { useGetAllChildren, useGetInventoryObjectData } from '5_entites';
import { ITmoModel } from '4_features';
import { AssociatedObjectsType, NavigationData } from '6_shared';
import { useGetChildrenData } from './useGetChildrenData';
import { useGetLinkedData } from './useGetLinkedData';
import { useGetRelatedData } from './useGetRelatedData';

interface IProps {
  associatedObjectType: AssociatedObjectsType;

  selectedObjectData?: NavigationData | null;
  pagination: Record<string, GridPaginationModel>;
  skipFetching?: boolean;
}

export const useGetAssociatedObjectsData = ({
  associatedObjectType,
  selectedObjectData,
  pagination,
  skipFetching,
}: IProps) => {
  const { inventoryObjectData, isInventoryObjectDataFetching } = useGetInventoryObjectData({
    objectId: selectedObjectData?.id,
    skip: skipFetching,
  });

  const { id: inventoryObjectId = null, tmo_id: tmoId = null } = { ...inventoryObjectData };

  // region CHILDREN DATA 🟢

  const { childrenTmoModel, isLoadingChildrenData } = useGetChildrenData({
    tmoId,
    inventoryObjectId,
    skipFetching: skipFetching || associatedObjectType !== 'children',
  });

  const { childObjects, isChildObjectsError } = useGetAllChildren({
    moId: selectedObjectData?.id as number,
  });

  // endregion

  // region LINKED DATA 🔵

  const { linkTotalCount, linkedTmoModel, isLoadingLinkedData, commonViewRows } = useGetLinkedData({
    selectedObjectData,
    tmoId,
    pagination,
    skipFetching: skipFetching || associatedObjectType !== 'linked',
  });

  // endregion

  // region RELATED DATA 🔴

  const { relatedTmoModel, isLoadingRelatedData } = useGetRelatedData({
    selectedObjectData,
    tmoId,
    skipFetching: skipFetching || associatedObjectType !== 'related',
  });

  // endregion

  const currentTMOModel = useMemo<ITmoModel[]>(() => {
    if (associatedObjectType === 'linked') return linkedTmoModel;
    if (associatedObjectType === 'related') return relatedTmoModel;
    if (associatedObjectType === 'children') return childrenTmoModel;
    return [];
  }, [associatedObjectType, linkedTmoModel, relatedTmoModel, childrenTmoModel]);

  return {
    commonViewRows: associatedObjectType === 'linked' ? commonViewRows : undefined,
    currentTMOModel,
    linkTotalCount,
    inventoryObjectData,
    isLoadingData:
      isInventoryObjectDataFetching ||
      isLoadingChildrenData ||
      isLoadingLinkedData ||
      isLoadingRelatedData,
    childObjects,
    isChildObjectsError,
  };
};
