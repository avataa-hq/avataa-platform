import { useEffect, useMemo, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import {
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  MapColumnsSelectData,
  useConfig,
  useGetClickhouseValueFromColumns,
  LineChartData,
  LineChartDatasets,
} from '6_shared';
import { getTimeField } from './getTimeField';

const currentDate = new Date();
const currenYear = currentDate.getFullYear();

const currentDateRange = {
  dateFrom: dayjs(currentDate).startOf('year').format('YYYY-MM-DD'),
  dateTo: dayjs(currentDate).endOf('year').format('YYYY-MM-DD'),
};

const previousDateRange = {
  dateFrom: dayjs(currentDate).subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
  dateTo: dayjs(currentDate).subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
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
        const isSameYear = dayjs(d[dateColumnName]).get('year') === currenYear;
        let correctDate = '';
        if (isSameYear) {
          correctDate = d[dateColumnName];
        } else {
          correctDate = `${currenYear}-${dayjs(d[dateColumnName]).format('MM-DD')}`;
        }

        const value = getCorrectValue(d[kpiColumnName]);
        res.push({
          x: new Date(addYear ? moreYear : correctDate),
          y: +value.toFixed(decimal),
        });
      });
    }
  });
  return res;
};

interface IProps {
  // selectedHierarchy?: DBHHierarchyModel | null;
  selectedKPI?: MapColumnsSelectData | null;
  currentLevelKpiSettings?: LevelSettings;

  dateRange?: DateRange<Dayjs> | [null, null];
  selectedObjects?: InventoryAndHierarchyObjectTogether[];
}

export const useMultipleChartData = ({
  currentLevelKpiSettings,
  selectedKPI,
  // selectedHierarchy,
  dateRange,
  selectedObjects,
}: IProps) => {
  const { config } = useConfig();
  const { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable } = config;

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
    granularity = 'month',
  } = currentLevelKpiSettings?.clickhouse_settings || {};

  // const eventsColumnsList: MapColumnsSelectData[] = useMemo(() => {
  //   if (!currentLevelKpiSettings || !selectedHierarchy) return [];

  //   const clickSettingsEvents = currentLevelKpiSettings?.clickhouse_settings?.events;
  //   if (!clickSettingsEvents) return [];

  //   const events = Object.entries(clickSettingsEvents).reduce((acc, [key, value]) => {
  //     const obj = {
  //       label: (value.name ?? '') as string,
  //       value: key,
  //       aggregation: value.aggregation ?? 'AVG',
  //     };
  //     acc.push(obj);
  //     return acc;
  //   }, [] as MapColumnsSelectData[]);

  //   const calculateStress = !!currentLevelKpiSettings?.clickhouse_settings?.calculate_stress;

  //   if (calculateStress) {
  //     return [{ label: 'Stress', value: 'Stress', aggregation: 'AVG' }, ...events];
  //   }
  //   return events;
  // }, [currentLevelKpiSettings, selectedHierarchy]);

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
    return selectedObjects?.map(({ key }) => key) ?? [];
  }, [selectedObjects]);

  const selectedKpi = useMemo(() => {
    const kpi = Object.entries(currentLevelKpiSettings?.clickhouse_settings?.events ?? {})?.find(
      ([key, _]) => key === selectedKPI?.value,
    );

    if (!kpi) return null;

    return { columnName: kpi[0], kpi: kpi[1] };
  }, [currentLevelKpiSettings?.clickhouse_settings?.events, selectedKPI]);

  const events = useMemo(() => {
    if (!selectedKpi) return [];
    return [
      { eventName: selectedKpi.columnName, aggregationType: selectedKpi?.kpi.aggregation ?? 'AVG' },
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
      dateFrom: previousDateRange.dateFrom,
      dateTo: currentDateRange.dateTo,
      granularity,
    });

  const [chartData, setChartData] = useState<
    (LineChartData & { unit?: string | undefined }) | null
  >(null);
  useEffect(() => {
    const dateColumnName = getTimeField(granularity);
    const kpiColumnName = `${selectedKpi?.kpi?.aggregation ?? 'AVG'}_${selectedKpi?.columnName}`;
    const decimals = getCorrectDecimal(selectedKpi?.kpi?.decimals);

    const groupedKpiDataByObject = currentKpiData?.reduce((acc, item) => {
      const { objectColumn: key, ...rest } = item;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rest);
      return acc;
    }, {} as Record<string, typeof currentKpiData>);

    const res: LineChartDatasets[] = [];
    selectedObjects?.forEach(({ key, label }) => {
      const dataByObject = groupedKpiDataByObject?.[key ?? ''] ?? [];
      const gen = generateDataset(
        dataByObject,
        currentMonth,
        dateColumnName,
        kpiColumnName,
        false,
        decimals,
      );
      const objectLabel = label ?? key;

      // @ts-ignore
      res.push({ label: objectLabel, data: gen });
    });

    setChartData({
      decimals,
      datasets: res,
      unit: selectedKpi?.kpi?.unit,
      labels: [],
    });
  }, [currentKpiData, currentMonth, granularity, selectedKpi, selectedObjects]);

  return { chartData };
};
