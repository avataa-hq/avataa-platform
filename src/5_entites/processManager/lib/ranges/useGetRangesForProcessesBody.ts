import {
  ColumnFilter,
  ColumnFilterType,
  IHierarchyAndInventoryResultInventoryBodyRangesItemModel,
  IInventoryFilterModel,
  Interval,
  Period,
  SelectedSeverity,
  SeverityType,
  useSeverity,
} from '6_shared';
import { useCallback } from 'react';
import { NamedFilterColumnsList } from '6_shared/graphQL/types/graphqlTypes';

// Хук возвращает две функции, одну - для получения ranges для body в стандартном запросе,
// а вторую - для body в live update.
// Функции принимают параметр "clearedRange", который если true,
// то range с названием Cleared будет передан в результат независимо от того, был он включен или нет,
// если же передать false, то range с названием Cleared будет передан в результат, только если онг был включен пользователем
// По умолчанию параметр "clearedRange" = true;

// Константы для стандартных фильтров
const defaultFilterEquals: ColumnFilter = {
  columnName: 'state',
  rule: 'and',
  filters: [{ operator: 'equals', value: 'ACTIVE' }],
};

const defaultFilterNotEquals: ColumnFilter = {
  columnName: 'state',
  rule: 'and',
  filters: [{ operator: 'notEquals', value: 'ACTIVE' }],
};

// Функция для генерации фильтров из диапазона выбранной severity
const getFiltersFromRanges = (range: SeverityType): ColumnFilterType[] => {
  const { from, to, isEmpty } = range;
  const filters: ColumnFilterType[] = [];
  if (from) filters.push({ operator: 'moreOrEq', value: String(from) });
  if (to) filters.push({ operator: 'less', value: String(to) });
  if ((!from && !to) || isEmpty) filters.push({ operator: 'isEmpty', value: '' });

  return filters;
};

// Функция для генерации диапазонов из выбранной severity
const getRangesFromSelectedSeverity = (
  selectedSeverity: SelectedSeverity,
): Record<string, ColumnFilter[]> =>
  selectedSeverity.reduce((acc, item) => {
    Object.entries(item).forEach(([key, value]) => {
      acc[key] = [
        { columnName: 'severity', rule: 'and', filters: getFiltersFromRanges(value) },
        defaultFilterEquals,
      ];
    });
    return acc;
  }, {} as Record<string, ColumnFilter[]>);

// Функция для генерации фильтров из периода
const getClearedPeriod = (period: Period, clearedInterval: Interval): ColumnFilterType[] => {
  if (period.selected) return [{ operator: 'inPeriod', value: String(period.value) }];
  const filters: ColumnFilterType[] = [];
  if (clearedInterval.from) filters.push({ operator: 'moreOrEq', value: clearedInterval.from });
  if (clearedInterval.to) filters.push({ operator: 'less', value: clearedInterval.to });

  return filters;
};

// Функция для преобразования диапазонов в массив объектов NamedFilterColumnsList
const rangesArrForProcesses = (range: Record<string, ColumnFilter[]>): NamedFilterColumnsList[] => {
  if (!range) return [];
  return Object.entries(range).map(([filterName, filters]) => ({
    filterName,
    filters: filters.map((filter) => ({
      ...filter,
      filters: filter.filters.map((innerFilter) => ({
        ...innerFilter,
        value: Array.isArray(innerFilter.value)
          ? `[${innerFilter.value.join(',')}]`
          : String(innerFilter.value),
      })),
    })),
  }));
};

// Хук для получения функций для работы с фильтрами
export const useGetRangesForProcessesBody = () => {
  const { severityRanges, selectedSeverity, isClearedSelected, period, clearedInterval } =
    useSeverity();

  const getRangesBody = useCallback(
    (severity: any[], clearedRange = true) => {
      const ranges = getRangesFromSelectedSeverity(severity);
      if (!clearedRange && !isClearedSelected) return ranges;

      const clearedFilters = getClearedPeriod(period, clearedInterval);
      return {
        ...ranges,
        Cleared: [
          { columnName: 'endDate', rule: 'and', filters: clearedFilters },
          defaultFilterNotEquals,
        ],
      };
    },
    [clearedInterval, isClearedSelected, period],
  );

  // Function to get ranges for processes
  const getRangesForProcessesBody: GetRangesForProcessesBody = useCallback(
    (clearedRange = true) => getRangesBody(selectedSeverity, clearedRange),
    [getRangesBody, selectedSeverity],
  );

  // Function to get ranges for live processes
  const getRangesForLiveProcessesBody: GetRangesForLiveProcessesBody = useCallback(
    (clearedRange = true) => rangesArrForProcesses(getRangesForProcessesBody(clearedRange)),
    [getRangesForProcessesBody],
  );

  // Function to get ranges for severity
  const getRangesForSeverityBody: GetRangesForProcessesBody = useCallback(
    (clearedRange = true) => getRangesBody(severityRanges, clearedRange),
    [getRangesBody, severityRanges],
  );

  // Function to get ranges for live severity
  const getRangesForLiveSeverityBody: GetRangesForLiveProcessesBody = useCallback(
    (clearedRange = true) => rangesArrForProcesses(getRangesForSeverityBody(clearedRange)),
    [getRangesForSeverityBody],
  );

  // Function to get ranges for hierarchy and inventory data for inventory body
  const getRangesForHierarchyAndInventoryBody: GetRangesForHierarchyAndInventoryBody = useCallback(
    (clearedRange = true) => {
      const rangesObjects = getRangesBody(selectedSeverity, clearedRange);
      return Object.entries(rangesObjects).reduce((acc, [key, value]) => {
        acc.push({ aggr_name: key, aggr_filters: value as IInventoryFilterModel[] });
        return acc;
      }, [] as IHierarchyAndInventoryResultInventoryBodyRangesItemModel[]);
    },
    [getRangesBody, selectedSeverity],
  );

  return {
    getRangesForProcessesBody,
    getRangesForLiveProcessesBody,
    getRangesForSeverityBody,
    getRangesForLiveSeverityBody,
    getRangesForHierarchyAndInventoryBody,
  };
};

// Тип для функции получения диапазонов для процессов
export type GetRangesForProcessesBody = (clearedRange?: boolean) => Record<string, ColumnFilter[]>;

// Тип для функции получения диапазонов для процессов с live update
export type GetRangesForLiveProcessesBody = (clearedRange?: boolean) => NamedFilterColumnsList[];

// Тип для функции получения диапазонов для иерархий и объектов inventory
export type GetRangesForHierarchyAndInventoryBody = (
  clearedRange?: boolean,
) => IHierarchyAndInventoryResultInventoryBodyRangesItemModel[];
