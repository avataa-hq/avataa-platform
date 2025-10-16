import { useEffect, useMemo, useState } from 'react';
import {
  GetRangesForHierarchyAndInventoryBody,
  useGetHierarchyAndInventoryObjects,
} from '5_entites';
import {
  hierarchyLevels,
  IHierarchyAndInventoryResultFilters,
  IHierarchyAndInventoryResultInventoryBodyRangesItemModel,
  IInventoryFilterModel,
  ISortColumn,
  parameterTypesApi,
  useHierarchy,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_ID_COLUMN_ID,
  OBJECT_PARENT_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  HAS_FILES_COLUMN_ID,
  POINT_A_NAME,
  POINT_B_NAME,
  OBJECT_NAME,
  getErrorMessage,
  objectTypesApi,
} from '6_shared';

const activeFilter: IInventoryFilterModel = {
  columnName: 'state',
  rule: 'and',
  filters: [{ operator: 'equals', value: 'ACTIVE' }],
};

const { useGetLevelsQuery } = hierarchyLevels;
const { useGetObjectTypesQuery } = objectTypesApi;

interface IProps {
  showZeroSeverity?: boolean;

  withGroups?: boolean;
  limit?: number;
  offset?: number;
  sort?: ISortColumn[];
  filters?: IInventoryFilterModel[];
  currentTmoIdsList?: number[];

  getRanges?: GetRangesForHierarchyAndInventoryBody;

  additionalSkip?: boolean;

  removeActiveFilter?: boolean;
  disabledAggregation?: boolean;
}

const sortExcludion = [
  OBJECT_ID_COLUMN_ID,
  OBJECT_PARENT_COLUMN_ID,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  HAS_FILES_COLUMN_ID,
  POINT_A_NAME,
  POINT_B_NAME,
  OBJECT_NAME,
];

export const useHierarchyData = ({
  showZeroSeverity = true,

  limit,
  offset,
  sort,
  withGroups,
  getRanges,
  filters,

  additionalSkip,

  removeActiveFilter,
  disabledAggregation,
}: IProps) => {
  const [errorMessageChildrenItems, setErrorMessageChildrenItems] = useState<string | undefined>();
  const {
    parentItems,
    selectedParentId,
    activeHierarchy,
    globalSearchValue,
    selectedHierarchyItem,

    setHierarchyTmoId,
  } = useHierarchy();

  // ====== Retrieving all object types that participate in the selected hierarchy
  const { data: hierarchyLevelData, error: hierarchyLevelError } = useGetLevelsQuery(
    activeHierarchy?.id!!,
    {
      skip: !activeHierarchy?.id! || activeHierarchy?.id === null || additionalSkip,
    },
  );

  useEffect(() => {
    if (hierarchyLevelError) {
      setErrorMessageChildrenItems(getErrorMessage(hierarchyLevelError));
    } else {
      setErrorMessageChildrenItems(undefined);
    }
  }, [hierarchyLevelError]);

  const firstNotVirtualLevelObjectTypeId = useMemo(() => {
    if (!hierarchyLevelData) return null;
    return hierarchyLevelData.find((item) => !item.is_virtual)?.object_type_id ?? null;
  }, [hierarchyLevelData]);

  const { data: tmoData, error: tmoError } = useGetObjectTypesQuery(
    {
      object_types_ids: firstNotVirtualLevelObjectTypeId ? [firstNotVirtualLevelObjectTypeId] : [],
      with_tprms: true,
    },
    {
      skip: !firstNotVirtualLevelObjectTypeId || additionalSkip,
    },
  );

  useEffect(() => {
    if (tmoError) {
      setErrorMessageChildrenItems(getErrorMessage(tmoError));
    } else {
      setErrorMessageChildrenItems(undefined);
    }
  }, [tmoError]);

  const severityTPRMId = useMemo(() => {
    return tmoData?.[0]?.severity_id ?? null;
  }, [tmoData]);

  useEffect(() => {
    if (!severityTPRMId) {
      setErrorMessageChildrenItems('There is no Severity parameter id');
    } else {
      setErrorMessageChildrenItems(undefined);
    }
  }, [severityTPRMId]);

  const hierarchyAndInventoryRangesList = useMemo<
    IHierarchyAndInventoryResultInventoryBodyRangesItemModel[] | undefined
  >(() => {
    const ranges = getRanges?.(false);
    if (!ranges || !severityTPRMId) return undefined;

    return ranges.map((range) => {
      return {
        aggr_name: range.aggr_name,
        aggr_filters: range.aggr_filters.map((f) => {
          if (f.columnName.toLowerCase() === 'severity') {
            return { ...f, columnName: String(severityTPRMId) };
          }
          return f;
        }),
      };
    });
  }, [getRanges, severityTPRMId]);

  const hierarchyAndInventoryFilters = useMemo<
    IHierarchyAndInventoryResultFilters[] | undefined
  >(() => {
    return firstNotVirtualLevelObjectTypeId
      ? [
          {
            tmo_id: firstNotVirtualLevelObjectTypeId,
            filter_columns: removeActiveFilter ? filters : [activeFilter, ...(filters ?? [])],
            search_by_value: globalSearchValue,
          },
        ]
      : undefined;
  }, [firstNotVirtualLevelObjectTypeId, removeActiveFilter, filters, globalSearchValue]);

  const hierarchyAndInventorySorting = useMemo(() => {
    if (!sort) return [];
    return sort.filter((item) => {
      const { columnName } = item;
      const isNumberColumnName = !isNaN(+columnName);
      return isNumberColumnName || sortExcludion.includes(columnName);
    });
  }, [sort]);

  useEffect(() => {
    if (selectedHierarchyItem && selectedHierarchyItem.object_type_id) {
      setHierarchyTmoId(selectedHierarchyItem.object_type_id);
    }
    if (!selectedHierarchyItem && firstNotVirtualLevelObjectTypeId) {
      setHierarchyTmoId(firstNotVirtualLevelObjectTypeId);
    }
  }, [firstNotVirtualLevelObjectTypeId, selectedHierarchyItem]);

  const {
    inventoryObjectsData,
    aggregationByRangesData,
    hierarchyChildrenData,
    hierarchyParentsData,
    refetch,
  } = useGetHierarchyAndInventoryObjects({
    aggregationType: disabledAggregation ? undefined : 'max',
    aggregationTmoId: disabledAggregation ? undefined : firstNotVirtualLevelObjectTypeId,
    aggregationTprmId: disabledAggregation ? undefined : severityTPRMId,
    rangesList: hierarchyAndInventoryRangesList,
    hierarchyId: activeHierarchy?.id,
    parentHierarchyNodeId: parentItems?.at(-1)?.id,
    sort: hierarchyAndInventorySorting,
    limit,
    withGroups,
    offset,
    skipResponse: additionalSkip,
    filters: hierarchyAndInventoryFilters,
    selectedParentId,
    showZeroSeverityNodes: showZeroSeverity,
    selectedHierarchyItem,
  });

  // =====

  return {
    hierarchyChildrenData: { ...hierarchyChildrenData, errorMessageChildrenItems },
    hierarchyParentsData,
    inventoryObjectsData,
    aggregationByRangesData,
    refetchHierarchyAndInventoryData: refetch,
  };
};
