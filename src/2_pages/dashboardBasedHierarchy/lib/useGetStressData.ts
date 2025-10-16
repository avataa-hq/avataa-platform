import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { AggregationType, GranularityType } from '6_shared/api/clickhouse/constants';
import { EventDataType } from '6_shared/api/clickhouse/types';
import {
  ClickhouseSettings,
  useConfig,
  useDashboardBasedHierarchy,
  useGetClickhouseStressValueFromColumns,
} from '6_shared';

interface IProps {
  objectKeys: string[];
  dateRange: DateRange<dayjs.Dayjs>;
  granularity: GranularityType;
  levelID?: number | null;
  selectedEvent?: string;
}

export const useGetStressData = ({
  objectKeys,
  levelID,
  dateRange,
  granularity,
  selectedEvent = 'Stress',
}: IProps) => {
  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const {
    selectedHierarchy,
    kpiData: kpiSettings,
    currentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const hierarchyLvlId = levelID ?? currentHierarchyLevelId;

  const [clickhouseSettings, setClickhouseSettings] = useState<ClickhouseSettings | null>(null);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [events, setEvents] = useState<{ eventName: string; aggregationType: AggregationType }[]>(
    [],
  );

  const dateFrom = dateRange[0]?.format('YYYY-MM-DD') ?? '';
  const dateTo = dateRange[1]?.format('YYYY-MM-DD') ?? '';

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
    calculate_stress = false,
  } = clickhouseSettings || {};

  const { data, isLoading } = useGetClickhouseStressValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    dateTo,
    dateFrom,
    table,
    objectColumn,
    objectKeys,
    granularity,
    dateColumn,
    events,
    eventData,
    selectedEvent,
  });

  useEffect(() => {
    if (!kpiSettings || !selectedHierarchy || hierarchyLvlId == null) return;
    const currentKpiSettings = kpiSettings[+selectedHierarchy.hierarchy_id];
    const currentLevelKpiSettings = currentKpiSettings?.find(
      (el) =>
        String(el.level_id) === String(hierarchyLvlId) ||
        String(el?.external_level) === String(hierarchyLvlId - 1000000),
    );
    const clickSettings = currentLevelKpiSettings?.clickhouse_settings;

    if (clickSettings) {
      const evData = Object.entries(clickSettings.events).reduce<EventDataType>(
        (acc, [key, event]) => {
          const [alpha, beta] = event.relaxation_function.split('/').map(Number);
          const relaxationPeriod = parseInt(event.relaxation_period.replace('d', ''), 10);

          acc[key] = {
            weight: event.weight,
            relaxationPeriod,
            alpha,
            beta,
          };

          return acc;
        },
        {},
      );
      const ev = Object.entries(clickSettings.events).map(([key, value]) => ({
        eventName: key,
        aggregationType: value.aggregation || ('AVG' as const),
      }));

      setEvents(ev);
      setEventData(evData);
      setClickhouseSettings(clickSettings);
    }
  }, [hierarchyLvlId, kpiSettings, selectedHierarchy]);

  return { stressData: data, isLoadingStressData: isLoading };
};
