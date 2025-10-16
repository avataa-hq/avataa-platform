import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { useGetMainSpeedometersData } from '2_pages/dashboardBasedHierarchy/lib/useGetMainSpeedometersData';
import { ColoredLineChart } from '3_widgets';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import {
  DBHHierarchyModel,
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  MapColumnsSelectData,
  SortValueType,
  useDashboardBasedHierarchy,
  useDebounceValue,
} from '6_shared';
import { Body, Footer, Header, MainPageStyled } from './MainPage.styled';
import { OperatorsSpeedometers } from '../operatorsSpeedometers/OperatorsSpeedometers';
import { ClustersParent } from '../clusters/ClustersParent';
import { useGetColoredLineChartData } from '../../lib/useGetColoredLineChartData';
import { useGetClustersData } from '../../lib/useGetClustersData';
import { useGetPalettesQuery } from '../../lib/useGetPalettesQuery';
import { FilterAndSort } from './FilterAndSort';
import { dispatchNewHierarchyAndChangeLeftAreaType } from '../../lib/dispatchNewHierarchyAndChangeLeftAreaType';

interface IProps {
  dateRange: DateRange<Dayjs>;
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  selectedEventColumn?: MapColumnsSelectData;
  hierarchyLevels: HierarchyLevel[];
  selectedHierarchy?: DBHHierarchyModel | null;
  currentHierarchyLevelId?: number | null;
  currentLevelKpiSettings?: LevelSettings;

  isFullScreen?: boolean;
}

export const MainPage = ({
  hierarchyInventoryObjects,
  dateRange,
  selectedEventColumn,
  hierarchyLevels,
  currentHierarchyLevelId,
  selectedHierarchy,
  currentLevelKpiSettings,

  isFullScreen,
}: IProps) => {
  const {
    selectedClusterSort,
    setSelectedClusterSort,
    setTopLevelAggregationKPIData,
    setHierarchyBreadcrumbs,
    setLeftAreaType,
    setCurrentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const [selectedGranularity, setSelectedGranularity] = useState<GranularityType>('day');
  const [sortValue, setSortValue] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const debounceFilterValue = useDebounceValue(filterValue);

  const { colorRangesData } = useGetPalettesQuery({
    tmo_ids:
      selectedHierarchy?.hierarchy_id && currentHierarchyLevelId
        ? [`${selectedHierarchy.hierarchy_id}-${currentHierarchyLevelId}`]
        : undefined,
    tprm_ids: [selectedEventColumn?.value ?? 'Stress'],
    is_default: true,
  });

  const currentColorRangesData = useMemo(() => {
    if (!selectedHierarchy?.hierarchy_id || currentHierarchyLevelId == null) return null;
    const key = `${selectedHierarchy.hierarchy_id}-${currentHierarchyLevelId}`;

    const res = colorRangesData?.find((cd) => cd.tmoId === key) ?? null;
    return res;
  }, [colorRangesData, currentHierarchyLevelId, selectedHierarchy]);

  const { coloredLineData } = useGetColoredLineChartData({
    hierarchyInventoryObjects,
    dateRange,
    colorRangesData: currentColorRangesData,
    granularity: selectedGranularity,
    selectedEvent: selectedEventColumn,
    currentLevelSettings: currentLevelKpiSettings,
  });

  const sortedColoredLineData = useMemo(() => {
    return Object.entries(coloredLineData)
      .sort((a, b) => {
        if (sortValue === 'asc') return a[0].localeCompare(b[0]);
        return b[0].localeCompare(a[0]);
      })
      .filter(
        ([key, _]) =>
          debounceFilterValue === '' ||
          key.toLowerCase().includes(debounceFilterValue.toLowerCase()),
      )
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as typeof coloredLineData);
  }, [coloredLineData, sortValue, debounceFilterValue]);

  // DATA FOR HEADER SPEEDOMETERS
  const { rootSpeedometersLoading, eventCustomNames } = useGetMainSpeedometersData({
    dateRange,
  });

  // DATA FOR CLUSTERS
  const { clustersData, loading, sortValues, rootSpeedometersData } = useGetClustersData({
    hierarchyInventoryObjects,
    dateRange,
    levelID: currentHierarchyLevelId,
  });

  useEffect(() => {
    const aggregationData = Object.values(rootSpeedometersData ?? {}).reduce((acc, kpiRoot) => {
      const kpiItem = kpiRoot?.root;
      if (!kpiItem) return acc;
      const { key, minValue, maxValue, value } = kpiItem;

      if (!key || minValue == null || maxValue == null || value == null) return acc;

      acc[key] = {
        min: +minValue,
        max: +maxValue,
        value: +value,
      };
      return acc;
    }, {} as Record<string, { min: number; max: number; value: number }>);

    setTopLevelAggregationKPIData(aggregationData);
  }, [rootSpeedometersData]);

  useEffect(() => {
    if (
      sortValues &&
      sortValues.length > 0 &&
      !sortValues.some((s) => s.label === selectedClusterSort?.label)
    ) {
      setSelectedClusterSort(sortValues[0]);
    }
  }, [sortValues, selectedClusterSort]);

  const handleSortChange = (sort: SortValueType | null) => {
    setSelectedClusterSort(sort);
  };

  const onColoredLineClick = useCallback(
    (objectName?: string) => {
      if (!objectName || !hierarchyInventoryObjects?.length) return;
      const neededObject = hierarchyInventoryObjects.find((o) => o.key === objectName);
      if (!neededObject) return;
      dispatchNewHierarchyAndChangeLeftAreaType(
        setHierarchyBreadcrumbs,
        setLeftAreaType,
        setCurrentHierarchyLevelId,
        neededObject,
        hierarchyLevels,
      );
    },
    [hierarchyLevels, hierarchyInventoryObjects],
  );

  return (
    <MainPageStyled>
      <Header>
        <OperatorsSpeedometers
          rootSpeedometersData={rootSpeedometersData}
          loading={rootSpeedometersLoading}
          hierarchyLevels={hierarchyLevels}
          eventCustomNames={eventCustomNames}
          currentHierarchyLevelId={currentHierarchyLevelId}
          currentColorRangesData={currentColorRangesData}
        />
      </Header>
      <Body>
        <ClustersParent
          clustersData={clustersData}
          loading={loading}
          sortValues={sortValues}
          selectedClusterSort={selectedClusterSort}
          setSelectedClusterSort={handleSortChange}
          hierarchyLevels={hierarchyLevels}
          isFullScreen={isFullScreen}
        />
      </Body>
      {Object.keys(coloredLineData || {}).length > 0 && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', height: '30px' }}>
          <FilterAndSort
            sort={sortValue}
            setSort={setSortValue}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        </div>
      )}
      <Footer>
        <ColoredLineChart
          hierarchyInventoryObjects={hierarchyInventoryObjects}
          coloredLineChartData={sortedColoredLineData}
          // isLoading={isLoadingStressData}
          selectedGranularity={selectedGranularity}
          setSelectedGranularity={setSelectedGranularity}
          onColoredLineClick={onColoredLineClick}
          dateRange={dateRange}
        />
      </Footer>
    </MainPageStyled>
  );
};
