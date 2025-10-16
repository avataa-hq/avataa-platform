import { useEffect, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import {
  ClickhouseSettings,
  EventType,
  ISpeedometerData,
  useConfig,
  useDashboardBasedHierarchy,
  useGetClickhouseColumnsAggregationValue,
} from '6_shared';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import { ClickhouseLevelsSettings, EventsResponseType } from '6_shared/api/clickhouse/types';

interface IProps {
  dateRange: DateRange<Dayjs>;
}

interface SPDData {
  [c: string]: { [k: string]: ISpeedometerData };
}

const getDateRangeDuration = (dateRange: DateRange<dayjs.Dayjs>) => {
  return dateRange[1]?.diff(dateRange[0]) ?? 0;
};

interface IEventsProps {
  dateRange: DateRange<dayjs.Dayjs>;
  withPrevious: boolean;
  granularity?: GranularityType;
  levelID?: number | null;
}

export interface TooltipData {
  currentData: { [key: string]: EventsResponseType | null };
  previousData: { [key: string]: EventsResponseType | null };
}

const useEventsData = ({
  dateRange,
  withPrevious,
  granularity,
  levelID,
}: IEventsProps): {
  speedometersData: SPDData;
  loading: boolean;
  tooltipData: TooltipData;
  eventCustomNames: Record<string, string>;
} => {
  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const {
    selectedHierarchy,
    kpiData: kpiSettings,
    currentHierarchyLevelId,
    mainSpeedometerAggregationType,
  } = useDashboardBasedHierarchy();

  const [hierarchyLvlId, setHierarchyLvlId] = useState<number | null>(null);

  // const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [clickhouseLevelsSettings, setClickhouseLevelsSettings] =
    useState<ClickhouseLevelsSettings | null>(null);
  const [speedometersData, setSpeedometersData] = useState<SPDData>({});
  const [eventCustomNames, setEventCustomNames] = useState<Record<string, string>>({});

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [previousFromDate, setPreviousFromDate] = useState('');
  const [previousToDate, setPreviousToDate] = useState('');

  useEffect(() => {
    setHierarchyLvlId(levelID ?? currentHierarchyLevelId);
  }, [levelID, currentHierarchyLevelId]);

  useEffect(() => {
    setDateFrom(dateRange[0]?.format('YYYY-MM-DD') ?? '');
    setDateTo(dateRange[1]?.format('YYYY-MM-DD') ?? '');

    const duration = getDateRangeDuration(dateRange);
    setPreviousFromDate(dateRange[0]?.subtract(duration).format('YYYY-MM-DD') ?? '');
    setPreviousToDate(dateRange[1]?.subtract(duration).format('YYYY-MM-DD') ?? '');
  }, [dateRange]);

  useEffect(() => {
    if (!Object.keys(kpiSettings).length || !selectedHierarchy || hierarchyLvlId == null) {
      return;
    }
    const currentKpiSettings = kpiSettings[+selectedHierarchy.hierarchy_id];

    const settingsByLevel = currentKpiSettings?.reduce<{ [key: string]: ClickhouseSettings }>(
      (acc, item) => {
        const filteredEvents =
          item.clickhouse_settings?.events &&
          Object.entries(item?.clickhouse_settings?.events ?? {})
            .filter(([_, event]) => +event.weight !== 0)
            .reduce<Record<string, EventType>>((obj, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});

        if (filteredEvents && Object.keys(filteredEvents).length > 0) {
          acc[item.level_id] = {
            ...item.clickhouse_settings,
            level_id: +item.level_id,
            events: filteredEvents,
          };
        }

        return acc;
      },
      {},
    );
    setClickhouseLevelsSettings(settingsByLevel || null);
  }, [hierarchyLvlId, kpiSettings, selectedHierarchy]);

  const { data: currentData, isLoading: isCurrentLoading } =
    useGetClickhouseColumnsAggregationValue({
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      _clickhouseCorsDisable,
      clickhouseLevelsSettings,
      aggregationType: mainSpeedometerAggregationType,
      granularity, // WHEN PROVIDED - returns values aggregated per day / week / month / year
      dateFrom,
      dateTo,
    });

  const { data: previousData, isLoading: isPreviousLoading } =
    useGetClickhouseColumnsAggregationValue({
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      _clickhouseCorsDisable,
      clickhouseLevelsSettings,
      aggregationType: mainSpeedometerAggregationType,
      granularity, // WHEN PROVIDED - returns values aggregated per day / week / month / year
      dateFrom: withPrevious ? previousFromDate : undefined,
      dateTo: withPrevious ? previousToDate : undefined,
    });

  useEffect(() => {
    if (!Object.keys(kpiSettings).length || !selectedHierarchy || hierarchyLvlId == null) return;

    const levelSettings = kpiSettings[+selectedHierarchy.hierarchy_id]?.find(
      (s) => String(s.level_id) === String(hierarchyLvlId),
    );

    if (!levelSettings || !currentData) {
      return;
    }

    const eventCustomNameList: Record<string, string> = {};
    Object.entries(levelSettings?.clickhouse_settings?.events ?? {}).forEach(([key, value]) => {
      eventCustomNameList[key] = value?.name ?? key;
    });
    setEventCustomNames(eventCustomNameList);
  }, [kpiSettings, currentData, previousData, selectedHierarchy, hierarchyLvlId]);

  useEffect(() => {
    if (!Object.keys(kpiSettings).length || !selectedHierarchy || hierarchyLvlId == null) {
      setSpeedometersData({});
      return;
    }

    const aggregatedData = Object.keys(currentData).reduce((acc, dataKey) => {
      if (!acc[dataKey]) {
        acc[dataKey] = {
          root: {
            key: dataKey,
            name: dataKey,
            initialValue: 0,
            value: 0,
            minValue: 0,
            maxValue: 0,
            directionValue: 'up',
            numberOfDecimals: 0,
            icon: 'stable',
          },
        };
      }

      // @ts-ignore
      const currentKeyData = currentData?.[dataKey]?.[0];
      // @ts-ignore
      const previousKeyData = previousData?.[dataKey]?.[0];

      if (currentKeyData && previousKeyData) {
        let sumCurrentValue = 0;
        let sumPreviousValue = 0;
        let maxCurrentValue = 0;

        Object.keys(currentKeyData).forEach((kpiKey) => {
          const previousValue = parseFloat(String(previousKeyData[kpiKey] ?? 0));
          const currentValue = parseFloat(String(currentKeyData[kpiKey] ?? 0));

          sumCurrentValue += currentValue;
          sumPreviousValue += previousValue;

          maxCurrentValue = Math.max(maxCurrentValue, currentValue, previousValue);
        });

        acc[dataKey].root.initialValue += sumPreviousValue;
        acc[dataKey].root.value += sumCurrentValue;
        acc[dataKey].root.maxValue = maxCurrentValue;
      }

      return acc;
    }, {} as { [key: string]: Record<string, any> });

    setSpeedometersData(aggregatedData);
  }, [kpiSettings, selectedHierarchy, hierarchyLvlId, currentData, previousData]);

  return {
    speedometersData,
    tooltipData: { currentData, previousData },
    eventCustomNames,
    loading: isCurrentLoading || (withPrevious && isPreviousLoading),
  };
};

export const useGetMainSpeedometersData = ({ dateRange }: IProps) => {
  const { speedometersData, loading, tooltipData, eventCustomNames } = useEventsData({
    dateRange,
    withPrevious: true,
  });

  return {
    rootSpeedometersData: speedometersData,
    rootSpeedometersLoading: loading,
    tooltipData,
    eventCustomNames,
  };
};
