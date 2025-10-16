import { useMemo } from 'react';
import {
  IColorRangeModel,
  InventoryAndHierarchyObjectTogether,
  IRangeModel,
  LevelSettings,
  MapColumnsSelectData,
  TreeNode,
  useConfig,
  useGetClickhouseValueFromColumns,
  useMapDataDistributor,
} from '6_shared';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { AggregationType } from '../../../6_shared/api/clickhouse/constants';
import { useGetStressData } from './useGetStressData';
import { getLastDayDateRange } from './utilityFunctions';
import { extractEventName } from './extractEventName';

const TREE_MAP_LIMIT = 50;

const getColorByValue = (value: number, ranges?: IRangeModel) => {
  const defaultColor = '#4682b4';
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
  if (val == null) return 0;
  if (typeof val === 'number') return +val;

  return +parseFormattedNumber(val);
};

interface IProps {
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  colorRangesData?: IColorRangeModel[];
  currentHierarchyLevelId?: number | null;
  selectedEventColumn?: MapColumnsSelectData | null;
  maptreeLayersSortOrder?: 'asc' | 'desc';
  objectKeys: string[];
  dateRange: DateRange<Dayjs>;
  currentLevelKpiSettings?: LevelSettings;
  currentHierarchyId?: number | null;
}

export const useGetDataForMaps = ({
  hierarchyInventoryObjects,
  currentHierarchyLevelId,
  colorRangesData,
  selectedEventColumn,
  maptreeLayersSortOrder,
  objectKeys,
  dateRange,
  currentLevelKpiSettings,
  currentHierarchyId,
}: IProps) => {
  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const dateFrom = dateRange[0]?.format('YYYY-MM-DD') ?? '';
  const dateTo = dateRange[1]?.format('YYYY-MM-DD') ?? '';

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
    events: rawEvents,
    calculate_stress = false,
  } = currentLevelKpiSettings?.clickhouse_settings || {};

  const currentColorRanges = useMemo(() => {
    if (!colorRangesData || !currentHierarchyId) return undefined;
    return colorRangesData?.find((d) => {
      const [hierarchyId, levelId] = d.tmoId.split('-');
      if (!hierarchyId || !levelId) return false;
      return +hierarchyId === +currentHierarchyId && +levelId === currentHierarchyLevelId;
    })?.ranges as IRangeModel | undefined;
  }, [colorRangesData, currentHierarchyId, currentHierarchyLevelId]);

  const events = useMemo(() => {
    const eve: {
      eventName: string;
      aggregationType: AggregationType;
    }[] = [];
    Object.entries(rawEvents ?? {}).forEach(([key, value]) =>
      eve.push({ eventName: key, aggregationType: value?.aggregation ?? 'AVG' }),
    );
    return eve;
  }, [rawEvents]);

  const { data: currentData, isLoading: isLoadingCurrentData } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys,
    events,
    dateFrom,
    dateTo,
  });

  const keysForStress = useMemo(() => {
    return calculate_stress ? objectKeys : [];
  }, [calculate_stress, objectKeys]);

  const { stressData, isLoadingStressData } = useGetStressData({
    dateRange: getLastDayDateRange(dateRange),
    objectKeys: keysForStress,
    granularity: 'day',
  });

  const groupedCurrentDataByObjectName = useMemo(() => {
    return currentData?.reduce((acc, item) => {
      const { objectColumn: objectColumnKey, ...rest } = item;

      return {
        ...acc,
        [objectColumnKey]: [
          ...(acc[objectColumnKey] || []),
          {
            ...rest,
            ...(calculate_stress && {
              AVG_Stress: stressData?.find((stressItem) => stressItem.key === objectColumnKey)
                ?.stressData?.[0]?.stress,
            }),
          },
        ],
      };
    }, {} as Record<string, any>);
  }, [calculate_stress, currentData, stressData]);

  const selectedEventKPIData = useMemo(() => {
    return rawEvents?.[selectedEventColumn?.value ?? ''];
  }, [rawEvents, selectedEventColumn?.value]);

  const objectsWithKPIData = useMemo(() => {
    const resForMap: InventoryAndHierarchyObjectTogether[] = [];
    const resultForTreemap: TreeNode<InventoryAndHierarchyObjectTogether>[] = [];

    const currentSettings = currentLevelKpiSettings?.clickhouse_settings;

    const eventNameForSize = extractEventName(currentSettings?.sizeKpi?.name ?? '');
    const eventNameBySelectedKPI = extractEventName(selectedEventColumn?.label ?? '');

    const decimalsByKPINameBySelectedKPI = getCorrectDecimal(selectedEventKPIData?.decimals);

    hierarchyInventoryObjects?.forEach((obj) => {
      const item = { ...obj };
      const eventsData = groupedCurrentDataByObjectName?.[item.key]?.[0];

      const eventValues: Record<string, any> = {};
      let selectedEventValue = 0;
      let eventValueForSize: number | undefined;

      Object.entries(rawEvents ?? {}).forEach(([key, kpi]) => {
        const eventKey = `${kpi?.aggregation ?? 'AVG'}_${key}`;
        const eventDataValue = eventsData?.[eventKey];

        const correctName = kpi?.name || key;
        const decimalsByKPIName = getCorrectDecimal(kpi?.decimals);
        const value = +getCorrectValue(eventDataValue as string | number);
        const unit = kpi?.unit;

        eventValues[correctName] = {
          value,
          unit,
          valueDecimals: decimalsByKPIName,
        };

        if (correctName === eventNameForSize) {
          eventValueForSize = value;
        }
        if (correctName === eventNameBySelectedKPI) {
          selectedEventValue = value;
          if (!eventValueForSize) eventValueForSize = value;
        }
      });

      item.eventValues = eventValues;
      item.color = getColorByValue(selectedEventValue, currentColorRanges);
      item.unitValue = selectedEventKPIData?.unit;
      const itemName = item?.label || item.key;

      resultForTreemap.push({
        name: itemName,
        value: selectedEventValue,
        valueDecimals: decimalsByKPINameBySelectedKPI,
        properties: item,
        sizeValue: eventValueForSize,
      });
      resForMap.push(item);
    });
    return { resForMap, resultForTreemap };
  }, [
    currentColorRanges,
    currentLevelKpiSettings?.clickhouse_settings,
    groupedCurrentDataByObjectName,
    hierarchyInventoryObjects,
    rawEvents,
    selectedEventColumn?.label,
    selectedEventKPIData,
  ]);

  const treemapSortedData = useMemo(() => {
    const currentAggregationKpiKey = selectedEventKPIData?.name ?? '';
    const direction = selectedEventKPIData?.direction || 'down';
    const copy = [...objectsWithKPIData.resultForTreemap];

    return copy
      .sort((a, b) => {
        const valueA = Number(
          // @ts-ignore
          a.properties?.eventValues?.[currentAggregationKpiKey ?? '']?.value ?? 0,
        );
        const valueB = Number(
          // @ts-ignore
          b.properties?.eventValues?.[currentAggregationKpiKey ?? '']?.value ?? 0,
        );
        if (direction === 'up') {
          if (maptreeLayersSortOrder === 'asc') return valueA - valueB;
          return valueB - valueA;
        }

        if (maptreeLayersSortOrder === 'asc') return valueB - valueA;
        return valueA - valueB;
      })
      .slice(0, TREE_MAP_LIMIT);
  }, [maptreeLayersSortOrder, objectsWithKPIData.resultForTreemap, selectedEventKPIData]);

  const { distributorData, isLoadingDistributorData } = useMapDataDistributor({
    data: objectsWithKPIData.resForMap,
  });

  return {
    dataForMap: distributorData,
    dataForTreeMap: treemapSortedData,
    isLoadingDistributorData,
  };
};
