import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  IColoredLineData,
  IColorRange,
  IColorRangeModel,
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  MapColumnsSelectData,
  useConfig,
  useGetClickhouseValueFromColumns,
} from '6_shared';
import { DateRange } from '@mui/x-date-pickers-pro';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import { getTimeField } from './chart/getTimeField';

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
const getDateRangeDuration = (dateRange: DateRange<dayjs.Dayjs>) => {
  return dateRange[1]?.diff(dateRange[0]) ?? 0;
};
const getColorByValue = (value: number, ranges?: IColorRange) => {
  const defaultColor = 'rgba(15,110,206,0.09)';
  if (!ranges || !ranges.colors?.length || !ranges.values?.length) return defaultColor;
  const { colors: rangesColors, values } = ranges;

  let countIdx = 0;

  if (value <= values[0]) countIdx = 0;

  if (value >= values[values.length - 1]) countIdx = values.length;

  for (let i = 0; i < values.length - 1; i++) {
    if (value >= values[i] && value < values[i + 1]) {
      countIdx = i + 1;
    }
  }
  const neededColor = rangesColors?.[countIdx]?.hex;
  if (!neededColor) return defaultColor;
  return neededColor;
};

interface IProps {
  dateRange: DateRange<Dayjs>;
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  colorRangesData?: IColorRangeModel | null;
  granularity: GranularityType;
  selectedEvent?: MapColumnsSelectData;

  currentLevelSettings?: LevelSettings;
}
export const useGetColoredLineChartData = ({
  hierarchyInventoryObjects,
  dateRange,
  colorRangesData,
  granularity,
  selectedEvent,
  currentLevelSettings,
}: IProps) => {
  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const [coloredLineData, setColoredLineData] = useState<Record<string, IColoredLineData[]>>({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [previousFromDate, setPreviousFromDate] = useState('');
  const [previousToDate, setPreviousToDate] = useState('');

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
  } = currentLevelSettings?.clickhouse_settings ?? {};
  useEffect(() => {
    setDateFrom(dateRange[0]?.format('YYYY-MM-DD') ?? '');
    setDateTo(dateRange[1]?.format('YYYY-MM-DD') ?? '');

    const duration = getDateRangeDuration(dateRange);
    setPreviousFromDate(dateRange[0]?.subtract(duration).format('YYYY-MM-DD') ?? '');
    setPreviousToDate(dateRange[1]?.subtract(duration).format('YYYY-MM-DD') ?? '');
  }, [dateRange]);

  const selectedKpi = useMemo(() => {
    const kpi = Object.entries(currentLevelSettings?.clickhouse_settings?.events ?? {})?.find(
      ([key, _]) => key === selectedEvent?.value,
    );

    if (!kpi) return null;

    return { columnName: kpi[0], kpi: kpi[1] };
  }, [currentLevelSettings?.clickhouse_settings?.events, selectedEvent]);

  const objectKeys = useMemo(() => {
    return hierarchyInventoryObjects?.map((item) => item.key) ?? [];
  }, [hierarchyInventoryObjects]);

  const events = useMemo(() => {
    if (!selectedKpi) return [];
    return [
      { eventName: selectedKpi.columnName, aggregationType: selectedKpi?.kpi.aggregation ?? 'AVG' },
    ];
  }, [selectedKpi]);

  const { data: currentData, isLoading: isCurrentLoading } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys,
    events,
    granularity,
    dateFrom,
    dateTo,
  });

  const { data: previousData, isLoading: isPreviousLoading } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys,
    events,
    granularity, // WHEN PROVIDED - returns values aggregated per day / week / month / year
    dateFrom: previousFromDate,
    dateTo: previousToDate,
  });

  const dataGrpupedByObjectName = useMemo(() => {
    const data = [...(previousData ?? []), ...(currentData ?? [])];
    return data.reduce((acc, item) => {
      if (!item) return acc;
      if (!acc[item.objectColumn]) {
        acc[item.objectColumn] = [];
      }
      acc[item.objectColumn].push(item);
      return acc;
    }, {} as Record<string, Record<string, any>[]>);
  }, [currentData, previousData]);

  useEffect(() => {
    const res: Record<string, IColoredLineData[]> = {};
    const dateColumnName = getTimeField(granularity);
    const kpiColumnName = `${selectedKpi?.kpi?.aggregation ?? 'AVG'}_${selectedKpi?.columnName}`;
    const decimals = getCorrectDecimal(selectedKpi?.kpi?.decimals);
    hierarchyInventoryObjects?.forEach(({ key }) => {
      const kpiDataItem = dataGrpupedByObjectName[key];
      if (kpiDataItem) {
        res[key] = kpiDataItem.map((kpiItem) => {
          const value = getCorrectValue(kpiItem[kpiColumnName]);
          const color = colorRangesData
            ? getColorByValue(value, colorRangesData.ranges)
            : '#164b9d';

          return { date: kpiItem[dateColumnName], value: +value.toFixed(decimals), color };
        });
      }
    });
    setColoredLineData(res);
  }, [
    colorRangesData,
    dataGrpupedByObjectName,
    granularity,
    hierarchyInventoryObjects,
    selectedKpi?.columnName,
    selectedKpi?.kpi?.aggregation,
    selectedKpi?.kpi?.decimals,
  ]);

  return { coloredLineData };
};
