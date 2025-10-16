import { useEffect, useMemo, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import {
  IColorRangeModel,
  IRangeModel,
  ITopViewDashboardIndicatorData,
  LevelSettings,
  useConfig,
  useGetClickhouseValueFromColumns,
} from '6_shared';
import { AggregationType } from '../../../../6_shared/api/clickhouse/constants';
import { getIndicatorData } from '../getIndicatorData';
import { getEventsName } from '../getEventsName';

interface IGroupByName {
  group: string;
  indicatorData: ITopViewDashboardIndicatorData[];
}
interface IProps {
  levelKpiSettings?: LevelSettings;
  dateRange: DateRange<dayjs.Dayjs>;
  objectKeys?: string[];
  colorRangesData?: IColorRangeModel[];
  hierarchyId?: number | null;
  levelId?: number;
}

export const useKpiGroupData = ({
  levelKpiSettings,
  dateRange,
  objectKeys,
  colorRangesData,
  hierarchyId,
  levelId,
}: IProps) => {
  const { config } = useConfig();
  const { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable } = config;

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [previousFromDate, setPreviousFromDate] = useState('');
  const [previousToDate, setPreviousToDate] = useState('');

  const [groupingByKpiName, setGroupingByKpiName] = useState<IGroupByName[]>([]);
  const [defaultKpiData, setDefaultKpiData] = useState<ITopViewDashboardIndicatorData | null>(null);

  useEffect(() => {
    setDateFrom(dateRange[0]?.format('YYYY-MM-DD') ?? '');
    setDateTo(dateRange[1]?.format('YYYY-MM-DD') ?? '');

    const duration = dateRange[1]?.diff(dateRange[0]) ?? 0;
    setPreviousFromDate(dateRange[0]?.subtract(duration).format('YYYY-MM-DD') ?? '');
    setPreviousToDate(dateRange[1]?.subtract(duration).format('YYYY-MM-DD') ?? '');
  }, [dateRange]);

  const {
    table_name: table = '',
    object_key: objectColumn = '',
    datetime_column: dateColumn = '',
    granularity = 'month',
    events,
    defaultKpi,
  } = levelKpiSettings?.clickhouse_settings || {};

  const eventsList = useMemo(() => {
    const names = getEventsName(events, false, true) as string[];
    const namesWithAggregation = getEventsName(events, true, true) as {
      eventName: string;
      aggregationType: AggregationType;
    }[];

    return { names, namesWithAggregation };
  }, [events]);

  const { data: currentData, isLoading: isCurrentLoading } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys: objectKeys || [],
    events: eventsList.namesWithAggregation,
    granularity,
    dateFrom,
    dateTo,
  });
  const { data: prevData, isLoading: isPrevLoading } = useGetClickhouseValueFromColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys: objectKeys || [],
    events: eventsList.namesWithAggregation,
    granularity,
    dateFrom: previousFromDate,
    dateTo: previousToDate,
  });

  useEffect(() => {
    if (Object.keys(events ?? {}).length === 0) return;
    const colorKey = `${hierarchyId}-${levelId}`;

    const nameDateColumn = `${granularity}_start`;
    const dataByKpiName: ITopViewDashboardIndicatorData[] = Object.entries(events ?? {}).map(
      ([key, value]) => {
        const aggregationKpiName = `${value.aggregation ?? 'AVG'}_${key}`;

        const colorRanges = colorRangesData?.find(({ tmoId, tprmId }) => {
          return tprmId === key && tmoId === colorKey;
        })?.ranges as IRangeModel | undefined;

        const { progressData: parentProgressData, coloredLineData: parentColoredLineData } =
          getIndicatorData({
            currentData,
            historyData: prevData,
            targetHistoryData: [],
            dateColumnName: nameDateColumn,
            colorRanges,
            kpiName: aggregationKpiName,
            kpi: value,
          });

        let nestedData: ITopViewDashboardIndicatorData[] = [];
        if (value.nestedKpi?.length) {
          nestedData = value.nestedKpi?.map((el) => {
            const nestedKpiAggregationKey = `${el.data.aggregation ?? 'AVG'}_${el.columnName}`;

            const { progressData: nestedProgressData, coloredLineData: nestedColoredLineData } =
              getIndicatorData({
                kpiName: nestedKpiAggregationKey,
                dateColumnName: nameDateColumn,
                currentData,
                historyData: [],
                targetHistoryData: [],
                colorRanges,
                kpi: el.data,
              });

            return {
              title: el.data.name ?? 'Unnamed KPI',
              coloredLineData: { title: el.data.name ?? '', data: nestedColoredLineData },
              progressData: nestedProgressData,
            };
          });
        }
        //

        return {
          title: value.group ?? 'Unnamed Group',
          coloredLineData: { title: value.name ?? '', data: parentColoredLineData },
          progressData: parentProgressData,
          nestedData,
        };
      },
    );

    const dataKpiWithoutDefault: ITopViewDashboardIndicatorData[] = [];
    let dataKpiDefault: ITopViewDashboardIndicatorData | null = null;

    dataByKpiName.forEach((data) => {
      if (data.coloredLineData.title === defaultKpi?.name) {
        dataKpiDefault = data;
      } else {
        dataKpiWithoutDefault.push(data);
      }
    });

    setDefaultKpiData(dataKpiDefault);

    if (dataKpiWithoutDefault.length) {
      const group = dataKpiWithoutDefault.reduce((acc, item) => {
        if (!acc[item.title]) acc[item.title] = [];
        acc[item.title].push(item);
        return acc;
      }, {} as Record<string, ITopViewDashboardIndicatorData[]>);

      const resGroup = Object.entries(group).reduce((acc, [key, value]) => {
        const correctValue = value.map((el) => {
          return { ...el, title: '' };
        });
        acc.push({ group: key, indicatorData: correctValue });

        return acc;
      }, [] as { group: string; indicatorData: ITopViewDashboardIndicatorData[] }[]);

      setGroupingByKpiName(resGroup);
    }
  }, [
    colorRangesData,
    currentData,
    defaultKpi?.name,
    events,
    granularity,
    hierarchyId,
    levelId,
    prevData,
  ]);

  return { groupData: groupingByKpiName, defaultKpiData };
};
