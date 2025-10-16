import {
  useGetTableProcessData,
  useCreateBodyForProcessesData,
  useGetSeverityByFilters,
  useGetSeverityByRanges,
  useGetRangesForProcessesBody,
} from '5_entites';

import { useCallback, useMemo } from 'react';
import {
  IColorRangeModel,
  IFilterSetModel,
  IFilterSetModelItem,
  ILeftPanelSelectedTabs,
  INestedMultiFilterForm,
  SeverityCount,
} from '6_shared';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { useLiveUpdate } from './useLiveUpdate';
import { useGetFilterSetFromTableAndMultiFilter } from './useGetFilterSetFromTableAndMultiFilter';
import { useCreateSeverityByFiltersBody } from './bodys/useCreateSeverityByFiltersBody';
import { useCreateSeverityByRangesBody } from './bodys/useCreateSeverityByRangesBody';
import { useHierarchyData } from '../../../../3_widgets/inventory/leftPanel/lib';

interface IProps {
  activePage: string;
  severityDirection: 'asc' | 'desc';
  filterModel?: Record<string, INestedMultiFilterForm>;
  selectedGroup: string | null;
  selectedTabs: ILeftPanelSelectedTabs;
  pmTmoId?: number;
  selectedMultiFilter?: IFilterSetModel | null;
  multiFilterSetList?: IFilterSetModelItem[];
  parentItems: HierarchyObject[];
  childItems: HierarchyObject[];
  hierarchyFilter: IFilterSetModel | null;
  severityId?: number | null;
  selectedColorPalette?: IColorRangeModel;

  skipTableProcessDataResponse?: boolean;
}

export const useProcessPageResponses = ({
  activePage,
  severityDirection,
  filterModel,
  selectedGroup,
  pmTmoId,
  selectedTabs,
  selectedMultiFilter,
  multiFilterSetList,
  parentItems,
  childItems,
  hierarchyFilter,
  severityId,
  selectedColorPalette,
  skipTableProcessDataResponse,
}: IProps) => {
  const {
    getRangesForProcessesBody,
    getRangesForLiveProcessesBody,
    getRangesForSeverityBody,
    getRangesForLiveSeverityBody,
    getRangesForHierarchyAndInventoryBody,
  } = useGetRangesForProcessesBody();

  const { currentMultiFilter, currentInventoryMultiFilter } =
    useGetFilterSetFromTableAndMultiFilter({
      selectedMultiFilter: selectedTabs[activePage] === 'filters' ? selectedMultiFilter : null,
      hierarchyFilter: selectedTabs[activePage] === 'topology' ? hierarchyFilter : null,
      filterFromDataGrid: filterModel?.[pmTmoId ?? '-1'],
    });

  // ===== get severity processes body
  const { severityProcessesBody } = useCreateBodyForProcessesData({
    selectedMultiFilter: currentMultiFilter,
    currentTmoId: pmTmoId,
    selectedGroup,
  });

  // ===== get severity by filters body
  const { severityByFiltersBody } = useCreateSeverityByFiltersBody({
    filterSets: selectedTabs[activePage] === 'filters' ? multiFilterSetList : undefined,
    childItems: selectedTabs[activePage] === 'topology' ? childItems : [],
    parentItems: selectedTabs[activePage] === 'topology' ? parentItems : [],
    severityDirection,
    selectedGroup: selectedTabs[activePage] === 'filters' ? selectedGroup : null,
  });
  // =====

  // ===== get severity by ranges body

  // =====
  const { severityByRangesBody, setSeverityByRangesBody } = useCreateSeverityByRangesBody({
    tmoId: pmTmoId,
    getRanges: getRangesForSeverityBody,
    currentMultiFilter,
  });
  // ===== live update data logic
  const {
    severityLiveDataByFilters,
    severityLiveDataByRanges,
    isLiveDataLoading,
    isLiveDataError,
    liveSeverityRows,
    setIsLiveUpdate,
    isLiveUpdate,
    liveSeverityRowsTotal,
  } = useLiveUpdate({
    severityDirection,
    filterSet: currentMultiFilter,
    getRanges: getRangesForLiveProcessesBody,
    getSeverityRanges: getRangesForLiveSeverityBody,
    bodyForProcesses: severityProcessesBody,
    bodyForSeverityByFilters: severityByFiltersBody,
  });
  // =====

  const {
    tableProcessData,
    isTableProcessesDataFetching,
    refetchTableProcessData,
    isTableProcessesDataError,
    warningRows,
  } = useGetTableProcessData({
    body: severityProcessesBody,
    liveSeverityProcessesData: liveSeverityRows,
    liveTotalCount: liveSeverityRowsTotal,
    getRanges: getRangesForProcessesBody,
    additionalSkip: selectedTabs[activePage] === 'topology' || skipTableProcessDataResponse,
    severityId,
    selectedColorPalette,
  });

  const {
    severityQuantityDataWithLive,
    isError: isFiltersSeverityCountError,
    isFetching: isFiltersSeverityCountFetching,
    refetch: refetchSeverityByFilters,
  } = useGetSeverityByFilters({
    severityLiveDataByFilters,
    bodyForSeverityByFilters: severityByFiltersBody,
  });

  const severityByRangesData = useGetSeverityByRanges({
    liveSeverityByRangesData: severityLiveDataByRanges,
    severityByRangesBody,
  });

  // Hierarchy and TableData

  const {
    hierarchyChildrenData,
    hierarchyParentsData,
    aggregationByRangesData,
    inventoryObjectsData,
    refetchHierarchyAndInventoryData,
  } = useHierarchyData({
    showZeroSeverity: false,
    getRanges: getRangesForHierarchyAndInventoryBody,
    filters: currentInventoryMultiFilter,
    additionalSkip: selectedTabs[activePage] !== 'topology' || activePage !== 'processManager',
    sort: severityProcessesBody?.sort,
    offset: severityProcessesBody?.limit?.offset,
    limit: severityProcessesBody?.limit?.limit,
    withGroups: severityProcessesBody?.withGroups,
  });

  const severityTableData = useMemo(() => {
    if (selectedTabs[activePage] === 'topology' && inventoryObjectsData) {
      return {
        totalCount: inventoryObjectsData.totalCount,
        rows: inventoryObjectsData.inventoryObjects.flatMap((item: any) => {
          if (!item.parameters) return [];

          const { parameters, ...other } = item;

          return { ...parameters, ...other };
        }),
      };
    }

    return tableProcessData;
  }, [activePage, inventoryObjectsData, selectedTabs, tableProcessData]);

  const severityRangesHierarchyData = useMemo<SeverityCount[]>(() => {
    if (selectedTabs[activePage] === 'topology') {
      const rangesData = aggregationByRangesData ?? {};

      const hierarchyRangesData = Object.entries(rangesData).reduce((acc, [key, { doc_count }]) => {
        acc[key.toLowerCase()] = doc_count;
        return acc;
      }, {} as Record<string, number>);

      return severityByRangesData.severityCountWithLive.map((sev) => {
        const rangeName = sev.filter_name.toLowerCase();
        return { ...sev, count: hierarchyRangesData[rangeName] ?? 0 };
      });
    }
    return severityByRangesData.severityCountWithLive;
  }, [
    activePage,
    aggregationByRangesData,
    selectedTabs,
    severityByRangesData.severityCountWithLive,
  ]);

  const refetchAll = useCallback(() => {
    refetchTableProcessData();
    refetchSeverityByFilters();
    severityByRangesData.refetchSeverityByRanges();
    refetchHierarchyAndInventoryData();
  }, [
    refetchHierarchyAndInventoryData,
    refetchSeverityByFilters,
    refetchTableProcessData,
    severityByRangesData,
  ]);

  const refetchAfterSuccess = useCallback(() => {
    setTimeout(() => {
      refetchAll();
    }, 2345);
  }, [refetchAll]);

  return {
    severityByFiltersData: {
      severityQuantityDataWithLive,
      isFiltersSeverityCountError,
      isFiltersSeverityCountFetching,
    },
    processData: {
      tableProcessData: severityTableData,
      warningRows,
      isTableProcessesDataFetching:
        isTableProcessesDataFetching || inventoryObjectsData?.isLoadingInventoryObjects,
      isTableProcessesDataError:
        isTableProcessesDataError || inventoryObjectsData?.isErrorInventoryObjects,
      refetchTableProcessData,
      refetchSeverityByFilters,
    },
    liveUpdateData: {
      severityLiveDataByRanges,
      isLiveDataLoading,
      isLiveDataError,
      liveSeverityRows,
      setIsLiveUpdate,
      isLiveUpdate,
    },
    hierarchyData: {
      hierarchyParentsData,
      hierarchyChildrenData,
    },
    severityProcessesBody,
    severityByRangesData: {
      severityCountWithLive: severityRangesHierarchyData,
      setSeverityBody: setSeverityByRangesBody,
    },
    refetchAfterSuccess,
    refetchAll,
  };
};
