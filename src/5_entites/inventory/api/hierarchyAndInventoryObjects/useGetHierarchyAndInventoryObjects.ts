import { hierarchyApi, searchApiV2 } from '6_shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IHierarchyBodyProps, useGetHierarchyBody } from './useGetHierarchyBody';
import { IInventoryBodyProps, useGetInventoryBody } from './useGetInventoryBody';
import { HierarchyObject } from '../../../../6_shared/api/hierarchy/types';

const { useGetHierarchyAndInventoryResultByFiltersQuery } = searchApiV2;
const { useGetHierarchyObjectBreadcrumbsQuery } = hierarchyApi;

interface IProps extends IHierarchyBodyProps, IInventoryBodyProps {
  skipResponse?: boolean;
  selectedParentId?: string;
  showZeroSeverityNodes?: boolean;
  selectedHierarchyItem?: HierarchyObject | null;
}

export const useGetHierarchyAndInventoryObjects = ({
  hierarchyId,
  parentHierarchyNodeId,

  aggregationType,
  aggregationTmoId,
  aggregationTprmId,
  rangesAggregationType,
  rangesAggregationTprmId,

  selectedParentId,
  selectedHierarchyItem,

  limit,
  offset,
  sort,
  withGroups,

  filters,
  rangesList,

  skipResponse,

  showZeroSeverityNodes = true,
}: IProps) => {
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedHierarchyItem) {
      setSelectedObjectId(null);
      setSelectedItemId(null);
      return;
    }

    if (selectedHierarchyItem.object_id) {
      const realObjectIdFromSelectedItem = Number(selectedHierarchyItem.object_id);
      setSelectedItemId(null);
      setSelectedObjectId(realObjectIdFromSelectedItem);
    } else if (selectedHierarchyItem.id) {
      const virtualIdFromSelectedItem = selectedHierarchyItem.id;
      setSelectedObjectId(null);
      setSelectedItemId(virtualIdFromSelectedItem);
    }
  }, [selectedHierarchyItem]);

  const tmoIdBySelectedNonVirtualItem = useMemo(() => {
    if (
      selectedHierarchyItem &&
      selectedHierarchyItem?.object_id &&
      selectedHierarchyItem?.object_type_id
    ) {
      return selectedHierarchyItem.object_type_id;
    }
    return null;
  }, [selectedHierarchyItem]);

  const { hierarchyBody, hierarchyBodyBySelectedNode } = useGetHierarchyBody({
    filters,
    hierarchyId,
    parentHierarchyNodeId,
    selectedHierarchyItemId: selectedItemId,
    selectedHierarchyItemObjectId: selectedObjectId,
    aggregationTprmId,
    aggregationTmoId,
    aggregationType,
    tmoIdBySelectedNonVirtualItem,
  });
  const { inventoryBody } = useGetInventoryBody({
    withGroups,
    limit,
    offset,
    rangesList,
    sort,
    rangesAggregationTprmId,
    rangesAggregationType,
  });

  const {
    data: hierarchyAndInventoryData,
    isError: isErrorHierarchyAndInventoryData,
    isFetching: isFetchingHierarchyAndInventoryData,
    refetch: refetchHierarchyAndInventoryData,
  } = useGetHierarchyAndInventoryResultByFiltersQuery(
    {
      hierarchy_id: hierarchyBody?.hierarchy_id!,
      parent_node_id: hierarchyBody?.parent_node_id!,
      filters: hierarchyBody?.filters,
      aggregation: hierarchyBody?.aggregation,
      ...(inventoryBody && { inventory_res: inventoryBody }),
    },
    {
      skip: !hierarchyBody || skipResponse || !!selectedHierarchyItem,
    },
  );

  const {
    data: hierarchyAndInventoryDataBySelectedNode,
    isError: isErrorHierarchyAndInventoryDataBySelectedNode,
    isFetching: isFetchingHierarchyAndInventoryDataBySelectedNode,
    refetch: refetchHierarchyAndInventoryDataBySelectedNode,
  } = useGetHierarchyAndInventoryResultByFiltersQuery(
    {
      hierarchy_id: hierarchyBodyBySelectedNode?.hierarchy_id!,
      parent_node_id: hierarchyBodyBySelectedNode?.parent_node_id!,
      filters: hierarchyBodyBySelectedNode?.filters,
      aggregation: hierarchyBodyBySelectedNode?.aggregation,
      ...(inventoryBody && { inventory_res: inventoryBody }),
    },
    {
      skip: !hierarchyBodyBySelectedNode || skipResponse || !selectedHierarchyItem,
    },
  );

  const {
    data: breadcrumbs,
    isFetching: isBreadcrumbsFetching,
    isError: isBreadcrumbsError,
  } = useGetHierarchyObjectBreadcrumbsQuery(selectedParentId!, {
    skip: !selectedParentId || selectedParentId === 'root' || skipResponse,
  });

  const hierarchyChildrenData = useMemo(() => {
    const childList = hierarchyAndInventoryData?.hierarchy_results?.objects ?? [];
    return {
      children: showZeroSeverityNodes
        ? childList
        : childList.filter((c) => c.aggregation_doc_count),
      totalCount: hierarchyAndInventoryData?.hierarchy_results?.total_hits ?? 0,
      isLoadingChildren: isFetchingHierarchyAndInventoryData,
      isErrorChildren: isErrorHierarchyAndInventoryData,
    };
  }, [
    hierarchyAndInventoryData?.hierarchy_results?.objects,
    hierarchyAndInventoryData?.hierarchy_results?.total_hits,
    isErrorHierarchyAndInventoryData,
    isFetchingHierarchyAndInventoryData,
    showZeroSeverityNodes,
  ]);

  const hierarchyParentsData = useMemo(() => {
    return {
      parents: breadcrumbs ?? [],
      isLoadingParents: isBreadcrumbsFetching,
      isErrorParents: isBreadcrumbsError,
    };
  }, [breadcrumbs, isBreadcrumbsError, isBreadcrumbsFetching]);

  const inventoryObjectsData = useMemo(() => {
    const actuallyObjects = selectedHierarchyItem
      ? hierarchyAndInventoryDataBySelectedNode?.inventory_results?.objects
      : hierarchyAndInventoryData?.inventory_results?.objects;

    const actuallyTotalCount = selectedHierarchyItem
      ? hierarchyAndInventoryDataBySelectedNode?.inventory_results?.total_hits
      : hierarchyAndInventoryData?.inventory_results?.total_hits;
    return {
      inventoryObjects: actuallyObjects ?? [],
      totalCount: actuallyTotalCount ?? 0,
      isLoadingInventoryObjects:
        isFetchingHierarchyAndInventoryData || isFetchingHierarchyAndInventoryDataBySelectedNode,
      isErrorInventoryObjects:
        isErrorHierarchyAndInventoryData || isErrorHierarchyAndInventoryDataBySelectedNode,
    };
  }, [
    hierarchyAndInventoryData?.inventory_results?.objects,
    hierarchyAndInventoryData?.inventory_results?.total_hits,
    hierarchyAndInventoryDataBySelectedNode?.inventory_results?.objects,
    hierarchyAndInventoryDataBySelectedNode?.inventory_results?.total_hits,
    isErrorHierarchyAndInventoryData,
    isErrorHierarchyAndInventoryDataBySelectedNode,
    isFetchingHierarchyAndInventoryData,
    isFetchingHierarchyAndInventoryDataBySelectedNode,
    selectedHierarchyItem,
  ]);

  const aggregationByRangesData = useMemo(() => {
    const ranges = selectedHierarchyItem
      ? hierarchyAndInventoryDataBySelectedNode?.aggregation_by_ranges
      : hierarchyAndInventoryData?.aggregation_by_ranges;
    return ranges;
  }, [
    hierarchyAndInventoryData?.aggregation_by_ranges,
    hierarchyAndInventoryDataBySelectedNode?.aggregation_by_ranges,
    selectedHierarchyItem,
  ]);

  const correctRefetchFunction = useCallback(() => {
    if (selectedHierarchyItem && hierarchyAndInventoryDataBySelectedNode) {
      refetchHierarchyAndInventoryDataBySelectedNode();
      return;
    }
    if (!selectedHierarchyItem && hierarchyAndInventoryData) {
      refetchHierarchyAndInventoryData();
    }
  }, [
    hierarchyAndInventoryData,
    hierarchyAndInventoryDataBySelectedNode,
    refetchHierarchyAndInventoryData,
    refetchHierarchyAndInventoryDataBySelectedNode,
    selectedHierarchyItem,
  ]);

  return {
    aggregationByRangesData,
    hierarchyChildrenData,
    hierarchyParentsData,
    inventoryObjectsData,
    refetch: correctRefetchFunction,
  };
};
