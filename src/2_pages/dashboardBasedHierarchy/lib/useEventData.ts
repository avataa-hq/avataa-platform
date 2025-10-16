import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import {
  ILocalEvent,
  Kpis,
  LevelSettings,
  useConfig,
  useDashboardBasedHierarchy,
  useGetClickhouseMaxValueFromColumns,
  useGetClickhouseValueFromColumns,
} from '6_shared';
import { useGetSpeedometersData } from './useGetSpeedometersData';

const getDateRangeDuration = (dateRange: DateRange<dayjs.Dayjs>) => {
  return dateRange[1]?.diff(dateRange[0]) ?? 0;
};

interface IProps {
  eventType: 'main_kpis' | 'additional_kpis' | 'bottom_kpis';
  objIds: string[];
  dateRange: DateRange<dayjs.Dayjs>;
  withPrevious: boolean;
  granularity?: GranularityType;
  levelID?: number | null;
  withMaxValues?: boolean;
}

export const useEventsData = ({
  eventType,
  objIds,
  dateRange,
  withPrevious,
  granularity,
  levelID,
  withMaxValues = false,
}: IProps) => {
  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const {
    selectedHierarchy,
    kpiData: kpiSettings,
    currentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [previousFromDate, setPreviousFromDate] = useState('');
  const [previousToDate, setPreviousToDate] = useState('');

  const currentLevelSettings = useMemo(() => {
    const hierarchyLvlId = levelID ?? currentHierarchyLevelId;

    let levelSettings: LevelSettings | undefined;

    const kpisKeys = Object.keys(kpiSettings ?? {});

    if (kpisKeys.length && selectedHierarchy && hierarchyLvlId != null) {
      levelSettings = kpiSettings[+selectedHierarchy.hierarchy_id]?.find(
        (s) =>
          String(s.level_id) === String(hierarchyLvlId) ||
          String(s.external_level) === String(hierarchyLvlId - 1000000),
      );
    }

    return levelSettings;
  }, [currentHierarchyLevelId, kpiSettings, levelID, selectedHierarchy]);

  const currentKpisByEventType = useMemo(() => {
    let kpisByEventType: Kpis | undefined;

    if (currentLevelSettings && currentLevelSettings[eventType]) {
      kpisByEventType = currentLevelSettings[eventType];
    }

    return kpisByEventType;
  }, [currentLevelSettings, eventType]);

  const localEvents: ILocalEvent[] = useMemo(() => {
    if (!currentLevelSettings || !Object.keys(currentLevelSettings).length) {
      return [];
    }

    const eventTypes = {
      main_kpis: currentLevelSettings.main_kpis,
      additional_kpis: currentLevelSettings.additional_kpis,
      bottom_kpis: currentLevelSettings.bottom_kpis,
    };

    return Object.entries(eventTypes)
      .filter(([key]) => key === eventType)
      .flatMap(([, kpis]) =>
        Object.values(kpis ?? {}).flatMap((kpi: any) => {
          if (!kpi.ID) return [];
          return {
            eventName: kpi.ID,
            aggregationType: kpi.aggregation ?? 'AVG',
          };
        }),
      );
  }, [currentLevelSettings, eventType]);

  useEffect(() => {
    setDateFrom(dateRange[0]?.format('YYYY-MM-DD') ?? '');
    setDateTo(dateRange[1]?.format('YYYY-MM-DD') ?? '');

    const duration = getDateRangeDuration(dateRange);
    setPreviousFromDate(dateRange[0]?.subtract(duration).format('YYYY-MM-DD') ?? '');
    setPreviousToDate(dateRange[1]?.subtract(duration).format('YYYY-MM-DD') ?? '');
  }, [dateRange]);

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
  } = currentLevelSettings?.clickhouse_settings ?? {};

  const { data: maxValues, isLoading: isLoadingMaxValues } = useGetClickhouseMaxValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    objectKeys: objIds,
    events: localEvents,
    withMaxValues,
  });

  const { data: currentData, isLoading: isCurrentLoading } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys: objIds,
    events: localEvents,
    granularity, // WHEN PROVIDED - returns values aggregated per day / week / month / year
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
    objectKeys: objIds,
    events: localEvents,
    granularity, // WHEN PROVIDED - returns values aggregated per day / week / month / year
    dateFrom: withPrevious ? previousFromDate : undefined,
    dateTo: withPrevious ? previousToDate : undefined,
  });

  const { aggregatedSpeedometersData, speedometersData } = useGetSpeedometersData({
    kpis: currentKpisByEventType,
    currentLevelSettings,
    events: localEvents,
    withMaxValues,
    maxValues,
    objIds,
    currentData,
    previousData,
  });

  return {
    speedometersData,
    aggregatedSpeedometersData,
    currentData,
    previousData,
    loading:
      isCurrentLoading ||
      (withPrevious && isPreviousLoading) ||
      (withMaxValues && isLoadingMaxValues),
  };
};
