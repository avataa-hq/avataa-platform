import { useEffect, useMemo, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { InventoryAndHierarchyObjectTogether, SortValueType } from '6_shared';
import { useEventsData } from './useEventData';

interface IProps {
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  dateRange: DateRange<Dayjs>;
  levelID?: number | null;
}

export const useGetClustersData = ({ hierarchyInventoryObjects, dateRange, levelID }: IProps) => {
  const [selectedClusterSort, setSelectedClusterSort] = useState<SortValueType | null>(null);
  const [sortValues, setSortValues] = useState<SortValueType[] | undefined>();
  const [currentWeek, setCurrentWeek] = useState<DateRange<Dayjs>>([null, null]);
  const [currentMonth, setCurrentMonth] = useState<DateRange<Dayjs>>([null, null]);
  const [currentYear, setCurrentYear] = useState<DateRange<Dayjs>>([null, null]);

  const objectKeys = useMemo(() => {
    if (!hierarchyInventoryObjects?.length) return [];
    const keysResult: string[] = [];
    hierarchyInventoryObjects.forEach((item, idx) => {
      if (keysResult.includes(item.key)) {
        keysResult.push(`${item.key}_${idx}`);
      } else {
        keysResult.push(item.key);
      }
    });
    return keysResult;
  }, [hierarchyInventoryObjects]);

  const { speedometersData, aggregatedSpeedometersData, loading } = useEventsData({
    objIds: objectKeys,
    dateRange,
    withPrevious: true,
    eventType: 'main_kpis',
    levelID,
  });

  useEffect(() => {
    if (speedometersData) {
      const sortingValues = Object.entries(speedometersData).map(([item, values]) => {
        let id = '';
        let direction: 'up' | 'down' = 'up';
        let label = item;
        const firstEntry = Object.entries(values).at(0);

        if (firstEntry) {
          const [, value] = firstEntry;

          id = value?.key?.toString() ?? '';
          direction = value?.directionValue ?? 'up';
          label = value?.name ?? item;
        }
        return {
          label: item,
          value: label,
          id,
          direction,
        };
      });

      if (JSON.stringify(sortingValues) !== JSON.stringify(sortValues)) {
        setSortValues(sortingValues);
      }
    }
  }, [sortValues, speedometersData]);

  useEffect(() => {
    if (
      (!selectedClusterSort || !sortValues?.some((el) => el.label === selectedClusterSort.label)) &&
      sortValues &&
      sortValues.length
    ) {
      const correctSortValues = sortValues.find((sv) => sv.label !== '');
      if (correctSortValues) setSelectedClusterSort(correctSortValues);
    }
  }, [sortValues, selectedClusterSort, speedometersData]);

  useEffect(() => {
    if (dateRange[1]) {
      const startDateOfWeek = dateRange[1].subtract(7, 'day');
      setCurrentWeek([startDateOfWeek, dateRange[1]]);

      const startDateOfMonth = dateRange[1].subtract(1, 'month');
      setCurrentMonth([startDateOfMonth, dateRange[1]]);

      const startDateOfYear = dateRange[1].subtract(1, 'year');
      setCurrentYear([startDateOfYear, dateRange[1]]);
    }
  }, [dateRange]);

  const { speedometersData: tableDataWeek, loading: isTableDataWeekLoading } = useEventsData({
    objIds: objectKeys,
    dateRange: currentWeek,
    withPrevious: true,
    eventType: 'additional_kpis',
  });

  const { speedometersData: tableDataMonth, loading: isTableDataMonthLoading } = useEventsData({
    objIds: objectKeys,
    dateRange: currentMonth,
    withPrevious: true,
    eventType: 'additional_kpis',
  });

  const { speedometersData: tableDataYear, loading: isTableDataYearLoading } = useEventsData({
    objIds: objectKeys,
    dateRange: currentYear,
    withPrevious: true,
    eventType: 'additional_kpis',
  });

  const isDataLoading = useMemo(() => {
    return loading || isTableDataWeekLoading || isTableDataMonthLoading || isTableDataYearLoading;
  }, [loading, isTableDataWeekLoading, isTableDataMonthLoading, isTableDataYearLoading]);

  return {
    clustersData: {
      speedometersData,
      tableDataWeek,
      tableDataMonth,
      tableDataYear,
      clusterData: hierarchyInventoryObjects,
    },
    loading: isDataLoading,
    sortValues,
    selectedClusterSort,
    setSelectedClusterSort,
    rootSpeedometersData: aggregatedSpeedometersData,
  };
};
