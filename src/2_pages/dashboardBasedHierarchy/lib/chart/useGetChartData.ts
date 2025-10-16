import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  MapColumnsSelectData,
  useConfig,
  useGetClickhouseValueFromColumns,
  LineChartData,
} from '6_shared';
import { DateRange } from '@mui/x-date-pickers-pro';
import { getTimeField } from './getTimeField';

const currentDate = new Date();
const currenYear = currentDate.getFullYear();
const prevYear = currenYear - 1;

const currentDateRange = {
  dateFrom: dayjs(currentDate).startOf('year').format('YYYY-MM-DD'),
  dateTo: dayjs(currentDate).endOf('year').format('YYYY-MM-DD'),
};

const previousDateRange = {
  dateFrom: dayjs(currentDate).subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
  dateTo: dayjs(currentDate).subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
};

const parseFormattedNumber = (input: string): number => {
  // Удалим пробелы и приведем к нормальной строке
  const cleaned = input.trim().replace(/\s/g, '');

  // 🇪🇺 Если есть "," как десятичный разделитель
  if (/,\d{1,2}$/.test(cleaned)) {
    // Убираем точки как разделители тысяч, заменяем запятую на точку
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  }

  // 🇺🇸 Если есть "." как десятичный, а "," как тысячный
  if (/\.\d{1,2}$/.test(cleaned) && cleaned.includes(',')) {
    const normalized = cleaned.replace(/,/g, '');
    return parseFloat(normalized);
  }

  // 🧼 В остальных случаях просто убираем все точки и запятые
  const normalized = cleaned.replace(/[.,]/g, '');
  return Number(normalized);
};

const getCorrectDecimal = (decimals: number | string | undefined) => {
  if (decimals == null || decimals === '' || Number.isNaN(+decimals)) return 10;
  return +decimals;
};
const getCorrectValue = (val: string | undefined | number | null): number => {
  if (val == null) return NaN;
  if (typeof val === 'number') return +val;

  return +parseFormattedNumber(val);
};

const allMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// const prevKpiData: Record<string, any>[] = [
//   { objectColumn: 'Region 2', month_start: '2024-01-01', AVG_fault: 5.4454845454548 },
//   { objectColumn: 'Region 2', month_start: '2024-01-15', AVG_fault: 3.4 },
//   { objectColumn: 'Region 2', month_start: '2024-01-30', AVG_fault: 1.9 },
//
//   // { objectColumn: 'Region 2', month_start: '2024-02-01', AVG_fault: 2.8 },
//   // { objectColumn: 'Region 2', month_start: '2024-02-14', AVG_fault: 3.1 },
//   // { objectColumn: 'Region 2', month_start: '2024-02-18', AVG_fault: 3.1 },
//   // { objectColumn: 'Region 2', month_start: '2024-02-25', AVG_fault: 3.1 },
//   // { objectColumn: 'Region 2', month_start: '2024-02-28', AVG_fault: 2.3 },
//
//   { objectColumn: 'Region 2', month_start: '2024-03-01', AVG_fault: 4.0 },
//   { objectColumn: 'Region 2', month_start: '2024-03-15', AVG_fault: 3.6 },
//   { objectColumn: 'Region 2', month_start: '2024-03-31', AVG_fault: 4.5 },
//
//   // { objectColumn: 'Region 2', month_start: '2024-04-01', AVG_fault: 3.9 },
//   // { objectColumn: 'Region 2', month_start: '2024-04-15', AVG_fault: 4.1 },
//   // { objectColumn: 'Region 2', month_start: '2024-04-30', AVG_fault: 3.8 },
//   //
//   // { objectColumn: 'Region 2', month_start: '2024-05-01', AVG_fault: 5.2 },
//   // { objectColumn: 'Region 2', month_start: '2024-05-15', AVG_fault: 4.7 },
//   // { objectColumn: 'Region 2', month_start: '2024-05-31', AVG_fault: 6.0 },
//
//   { objectColumn: 'Region 2', month_start: '2024-06-01', AVG_fault: 6.3 },
//   { objectColumn: 'Region 2', month_start: '2024-06-15', AVG_fault: 5.5 },
//   { objectColumn: 'Region 2', month_start: '2024-06-30', AVG_fault: 5.9 },
//
//   // { objectColumn: 'Region 2', month_start: '2024-07-01', AVG_fault: 5.8 },
//   // { objectColumn: 'Region 2', month_start: '2024-07-15', AVG_fault: 4.8 },
//   // { objectColumn: 'Region 2', month_start: '2024-07-31', AVG_fault: 5.4 },
//   //
//   // { objectColumn: 'Region 2', month_start: '2024-08-01', AVG_fault: 4.6 },
//   // { objectColumn: 'Region 2', month_start: '2024-08-15', AVG_fault: 4.9 },
//   // { objectColumn: 'Region 2', month_start: '2024-08-31', AVG_fault: 5.0 },
//
//   { objectColumn: 'Region 2', month_start: '2024-09-01', AVG_fault: 7.0 },
//   { objectColumn: 'Region 2', month_start: '2024-09-15', AVG_fault: 6.3 },
//   { objectColumn: 'Region 2', month_start: '2024-09-30', AVG_fault: 6.7 },
//
//   { objectColumn: 'Region 2', month_start: '2024-10-01', AVG_fault: 5.0 },
//   { objectColumn: 'Region 2', month_start: '2024-10-15', AVG_fault: 5.5 },
//   { objectColumn: 'Region 2', month_start: '2024-10-31', AVG_fault: 5.3 },
//
//   { objectColumn: 'Region 2', month_start: '2024-11-01', AVG_fault: 2.7 },
//   { objectColumn: 'Region 2', month_start: '2024-11-15', AVG_fault: 3.2 },
//   { objectColumn: 'Region 2', month_start: '2024-11-30', AVG_fault: 2.5 },
//
//   { objectColumn: 'Region 2', month_start: '2024-12-01', AVG_fault: 5.6 },
//   { objectColumn: 'Region 2', month_start: '2024-12-15', AVG_fault: 4.9 },
//   { objectColumn: 'Region 2', month_start: '2024-12-31', AVG_fault: 6.1 },
// ];
//
// const currentKpiData: Record<string, any>[] = [
//   // { objectColumn: 'Region 2', month_start: '2025-01-01', AVG_fault: 4.2 },
//   // { objectColumn: 'Region 2', month_start: '2025-01-15', AVG_fault: 3.7 },
//   // { objectColumn: 'Region 2', month_start: '2025-01-31', AVG_fault: 4.0 },
//
//   { objectColumn: 'Region 2', month_start: '2025-02-01', AVG_fault: 3.9 },
//   { objectColumn: 'Region 2', month_start: '2025-02-14', AVG_fault: 4.1 },
//   { objectColumn: 'Region 2', month_start: '2025-02-18', AVG_fault: 4.1 },
//   { objectColumn: 'Region 2', month_start: '2025-02-23', AVG_fault: 4.1 },
//   { objectColumn: 'Region 2', month_start: '2025-02-28', AVG_fault: 3.5 },
//
//   { objectColumn: 'Region 2', month_start: '2025-03-01', AVG_fault: 5.1 },
//   { objectColumn: 'Region 2', month_start: '2025-03-15', AVG_fault: 4.9 },
//   { objectColumn: 'Region 2', month_start: '2025-03-31', AVG_fault: 5.0 },
//
//   // { objectColumn: 'Region 2', month_start: '2025-04-01', AVG_fault: 4.7 },
//   // { objectColumn: 'Region 2', month_start: '2025-04-15', AVG_fault: 4.4 },
//   // { objectColumn: 'Region 2', month_start: '2025-04-30', AVG_fault: 4.2 },
//
//   { objectColumn: 'Region 2', month_start: '2025-05-01', AVG_fault: 6.0 },
//   { objectColumn: 'Region 2', month_start: '2025-05-15', AVG_fault: 5.8 },
//   { objectColumn: 'Region 2', month_start: '2025-05-31', AVG_fault: 5.9 },
//
//   { objectColumn: 'Region 2', month_start: '2025-06-01', AVG_fault: 5.5 },
//   { objectColumn: 'Region 2', month_start: '2025-06-15', AVG_fault: 5.2 },
//   { objectColumn: 'Region 2', month_start: '2025-06-30', AVG_fault: 5.6 },
//
//   // { objectColumn: 'Region 2', month_start: '2025-07-01', AVG_fault: 4.9 },
//   // { objectColumn: 'Region 2', month_start: '2025-07-15', AVG_fault: 4.3 },
//   // { objectColumn: 'Region 2', month_start: '2025-07-31', AVG_fault: 4.7 },
//
//   { objectColumn: 'Region 2', month_start: '2025-08-01', AVG_fault: 3.8 },
//   { objectColumn: 'Region 2', month_start: '2025-08-15', AVG_fault: 4.1 },
//   { objectColumn: 'Region 2', month_start: '2025-08-31', AVG_fault: 4.0 },
//
//   // { objectColumn: 'Region 2', month_start: '2025-09-01', AVG_fault: 6.2 },
//   // { objectColumn: 'Region 2', month_start: '2025-09-15', AVG_fault: 5.8 },
//   // { objectColumn: 'Region 2', month_start: '2025-09-30', AVG_fault: 6.1 },
//
//   // { objectColumn: 'Region 2', month_start: '2025-10-01', AVG_fault: 5.3 },
//   // { objectColumn: 'Region 2', month_start: '2025-10-15', AVG_fault: 5.0 },
//   // { objectColumn: 'Region 2', month_start: '2025-10-31', AVG_fault: 5.2 },
//
//   { objectColumn: 'Region 2', month_start: '2025-11-01', AVG_fault: 3.1 },
//   { objectColumn: 'Region 2', month_start: '2025-11-15', AVG_fault: 2.9 },
//   { objectColumn: 'Region 2', month_start: '2025-11-30', AVG_fault: 3.3 },
//
//   // { objectColumn: 'Region 2', month_start: '2025-12-01', AVG_fault: 4.4 },
//   // { objectColumn: 'Region 2', month_start: '2025-12-15', AVG_fault: 4.6 },
//   // { objectColumn: 'Region 2', month_start: '2025-12-31', AVG_fault: 4.9 },
// ];

const getGroupedDataByMonth = <T extends Record<string, any>>(
  data: T[],
  dateColumnName: string,
) => {
  return data?.reduce((acc, curr) => {
    const month = dayjs(curr[dateColumnName]).format('MMM');
    if (acc[month]) acc[month].push(curr);
    else acc[month] = [curr];
    return acc;
  }, {} as Record<string, typeof data>);
};

const generateDataset = <T extends Record<string, any>>(
  data: T[],
  monthsNames: string[],
  dateColumnName: string,
  kpiColumnName: string,

  addYear: boolean = false,
  decimal: number = 10,
) => {
  const groupedDataByMonth = getGroupedDataByMonth(data, dateColumnName);

  const res: { x: Date; y: number }[] = [];
  monthsNames.forEach((mon) => {
    const monthData = Object.entries(groupedDataByMonth).find(([d, _]) => {
      return d === mon;
    })?.[1];
    if (!monthData || monthData.length === 0) {
      const monthIndex = allMonthNames.indexOf(mon) + 1;
      const monthCount = monthIndex < 10 ? `0${monthIndex}` : String(monthIndex);
      res.push({ x: new Date(`${currenYear}-${monthCount}-01`), y: NaN });
    } else {
      monthData.forEach((d: T) => {
        const moreYear = dayjs(d[dateColumnName]).add(1, 'year').format('YYYY-MM-DD');
        const value = getCorrectValue(d[kpiColumnName]);
        res.push({
          x: new Date(addYear ? moreYear : d[dateColumnName]),
          y: +value.toFixed(decimal),
        });
      });
    }
  });
  return res;
};

interface IProps {
  levelKpiSettings?: LevelSettings;
  selectedEvent?: MapColumnsSelectData;
  selectHierarchyNodeObject?: InventoryAndHierarchyObjectTogether | null;
  dateRange?: DateRange<Dayjs> | [null, null];
}

export const useGetChartData = ({
  levelKpiSettings,
  selectedEvent,
  selectHierarchyNodeObject,
  dateRange,
}: IProps) => {
  const { config } = useConfig();
  const { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable } = config;

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
    granularity = 'month',
  } = levelKpiSettings?.clickhouse_settings || {};

  const currentMonth = useMemo(() => {
    if (!dateRange) return allMonthNames;
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    if (!startDate || !endDate) return allMonthNames;

    const minMonth = startDate.startOf('month');
    const maxMonth = endDate.startOf('month');

    const isDifferentYears = minMonth.year() !== maxMonth.year();

    if (isDifferentYears) return allMonthNames;

    const startMonth = startDate.month();
    const endMonth = endDate.month();
    const res: string[] = [];
    for (let i = startMonth; i <= endMonth; i++) {
      res.push(allMonthNames[i]);
    }
    return res;
  }, [dateRange]);

  const objectKeys = useMemo(() => {
    return [selectHierarchyNodeObject?.key || ''];
  }, [selectHierarchyNodeObject]);

  const selectedKpi = useMemo(() => {
    const kpi = Object.entries(levelKpiSettings?.clickhouse_settings?.events ?? {})?.find(
      ([key, _]) => key === selectedEvent?.value,
    );

    if (!kpi) return null;

    return { columnName: kpi[0], kpi: kpi[1] };
  }, [levelKpiSettings?.clickhouse_settings?.events, selectedEvent]);

  const events = useMemo(() => {
    if (!selectedKpi) return [];
    const sameUnitNestedData = (selectedKpi?.kpi?.nestedKpi ?? []).filter(
      (d) => d.data.unit === selectedKpi?.kpi?.unit || '%',
    );
    return [
      { eventName: selectedKpi.columnName, aggregationType: selectedKpi?.kpi.aggregation ?? 'AVG' },
      ...(sameUnitNestedData.length > 0
        ? sameUnitNestedData.map((d) => ({
            eventName: d.columnName,
            aggregationType: d?.data.aggregation ?? 'AVG',
          }))
        : []),
    ];
  }, [selectedKpi]);

  const { data: currentKpiData, isLoading: isLoadingCurrentData } =
    useGetClickhouseValueFromColumns({
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      _clickhouseCorsDisable,
      table,
      objectColumn,
      dateColumn,
      objectKeys,
      events,
      dateFrom: currentDateRange.dateFrom,
      dateTo: currentDateRange.dateTo,
      granularity,
    });

  const { data: prevKpiData, isLoading: isPrevLoadingCurrentData } =
    useGetClickhouseValueFromColumns({
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      _clickhouseCorsDisable,
      table,
      objectColumn,
      dateColumn,
      objectKeys,
      events,
      dateFrom: previousDateRange.dateFrom,
      dateTo: previousDateRange.dateTo,
      granularity,
    });

  const objectLabel = useMemo(() => {
    return selectHierarchyNodeObject?.label || selectHierarchyNodeObject?.key;
  }, [selectHierarchyNodeObject]);

  const previousDateDataSets = useMemo(() => {
    const result: { label: string; data: { x: Date; y: number }[] }[] = [];

    const label = `${objectLabel ?? ''}-${prevYear}`;

    const dateColumnName = getTimeField(granularity);
    const kpiColumnName = `${selectedKpi?.kpi?.aggregation ?? 'AVG'}_${selectedKpi?.columnName}`;
    const decimals = getCorrectDecimal(selectedKpi?.kpi?.decimals);
    const unit = selectedKpi?.kpi?.unit || '%';

    const parentDataSet = generateDataset(
      prevKpiData ?? [],
      currentMonth,
      dateColumnName,
      kpiColumnName,
      true,
      decimals,
    );

    const sameUnitNestedData = (selectedKpi?.kpi?.nestedKpi ?? []).filter(
      (d) => d.data.unit === unit,
    );
    result.push({
      label: `${label} - ${selectedKpi?.kpi?.name}`,
      data: parentDataSet,
    });

    sameUnitNestedData.forEach((d) => {
      const childKpiColumnName = `${d?.data?.aggregation ?? 'AVG'}_${d?.columnName}`;

      const nestedDataset = generateDataset(
        prevKpiData ?? [],
        currentMonth,
        dateColumnName,
        childKpiColumnName,
        true,
        decimals,
      );
      result.push({
        label: `${label} - ${d?.data?.name}`,
        data: nestedDataset,
      });
    });

    return result;
  }, [
    currentMonth,
    granularity,
    prevKpiData,
    selectHierarchyNodeObject?.key,
    selectedKpi,
    objectLabel,
  ]);

  const currentDateDataSets = useMemo(() => {
    const result: { label: string; data: { x: Date; y: number }[] }[] = [];
    const label = `${objectLabel ?? ''}-${currenYear}`;

    const dateColumnName = getTimeField(granularity);
    const kpiColumnName = `${selectedKpi?.kpi?.aggregation ?? 'AVG'}_${selectedKpi?.columnName}`;
    const decimals = getCorrectDecimal(selectedKpi?.kpi?.decimals);
    const unit = selectedKpi?.kpi?.unit || '%';

    const parentDataSet = generateDataset(
      currentKpiData ?? [],
      currentMonth,
      dateColumnName,
      kpiColumnName,
      false,
      decimals,
    );

    const sameUnitNestedData = (selectedKpi?.kpi?.nestedKpi ?? []).filter(
      (d) => d.data.unit === unit,
    );
    result.push({
      label: `${label} - ${selectedKpi?.kpi?.name}`,
      data: parentDataSet,
    });

    sameUnitNestedData.forEach((d) => {
      const childKpiColumnName = `${d?.data?.aggregation ?? 'AVG'}_${d?.columnName}`;

      const nestedDataset = generateDataset(
        currentKpiData ?? [],
        currentMonth,
        dateColumnName,
        childKpiColumnName,
        false,
        decimals,
      );
      result.push({
        label: `${label} - ${d?.data?.name}`,
        data: nestedDataset,
      });
    });

    return result;
  }, [
    selectHierarchyNodeObject?.key,
    granularity,
    selectedKpi,
    currentKpiData,
    currentMonth,
    objectLabel,
  ]);

  const chartData = useMemo(() => {
    const decimals = getCorrectDecimal(selectedKpi?.kpi?.decimals);
    const res: (LineChartData & { unit?: string }) | null = {
      unit: selectedKpi?.kpi?.unit || '%',
      decimals,
      // @ts-ignore
      datasets: [...currentDateDataSets, ...previousDateDataSets],
    };
    return res;
  }, [selectedKpi, currentDateDataSets, previousDateDataSets]);

  return { chartData, currentKpiData, prevKpiData, selectedKpi };
};
