import { ColorLineIndicator, RadarChart, RadarChartKPIType } from '3_widgets';
import {
  createFormatter,
  EventType,
  IColoredLineData,
  IColorRange,
  IColorRangeModel,
  MapColumnsSelectData,
  GranularityMenu,
} from '6_shared';
import { Skeleton, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { PriorityBottom, PriorityHeader, PriorityStyled, PriorityBody } from './Priority.styled';
import { useEventsData } from '../../lib/useEventData';
import { EventsResponseType } from '../../../../6_shared/api/clickhouse/types';
import { getTimeField } from '../../lib/chart/getTimeField';

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

interface IProps {
  dateRange: DateRange<Dayjs>;
  colorRangesData?: IColorRangeModel[];
  selectHierarchyNodeObject?: HierarchyObject | null;
  coloredLineColorData?: IColorRangeModel | null;
  selectedEvent?: MapColumnsSelectData | null;

  currentKpiData?: EventsResponseType | null;
  prevKpiData?: EventsResponseType | null;
  selectedKPI?: { columnName: string; kpi: EventType } | null;
  granularity?: string;
}
export const Priority = ({
  dateRange,
  colorRangesData,
  selectHierarchyNodeObject,
  coloredLineColorData,
  selectedEvent,

  currentKpiData,
  prevKpiData,

  selectedKPI,
  granularity,
}: IProps) => {
  const [menuPosition, setMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [selectedGranularity, setSelectedGranularity] = useState<GranularityType>('day');

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleSelectGranularity = (option: GranularityType) => {
    setSelectedGranularity?.(option);
    handleClose();
  };
  const localObjectId = useMemo(() => {
    return selectHierarchyNodeObject ? [selectHierarchyNodeObject.key] : [];
  }, [selectHierarchyNodeObject]);

  const localLevelId = useMemo(() => {
    return selectHierarchyNodeObject?.parent_level_id
      ? +selectHierarchyNodeObject.parent_level_id
      : undefined;
  }, [selectHierarchyNodeObject]);

  const { speedometersData, loading } = useEventsData({
    dateRange,
    objIds: localObjectId,
    withPrevious: false,
    eventType: 'additional_kpis',
    levelID: localLevelId,
    withMaxValues: true,
  });

  const radarChartData = useMemo(() => {
    const kpiNames = Object.keys(speedometersData);

    const calculatePercent = (value: number, min: number, max: number): number => {
      if (max === min) return 0;
      const percentage = ((value - min) / (max - min)) * 10;
      return percentage;
    };

    const radarData: RadarChartKPIType = {};

    kpiNames.forEach((kpiName) => {
      const kpiData = Object.values(speedometersData?.[kpiName ?? ''])?.[0];

      if (!kpiData) return;
      const { format } = createFormatter(kpiData.numberOfDecimals ?? 2);
      const { value, minValue, maxValue, name, key } = kpiData;
      const min = +(minValue ?? 0);
      const max = 10;
      const realVal = +(value ?? 0);
      const realMax = Math.max(realVal, maxValue ?? 10);
      const radarValue = value != null ? Math.min(+value, realMax, max) : null;

      if (radarValue === null) return;
      const percent = calculatePercent(realVal, min, realMax);

      let color = '#2b4dd9';

      const palette = colorRangesData?.find((el) => el.tprmId === key);

      if (palette) color = getColorByValue(realVal, palette.ranges);

      const eventCustomName = name ?? key ?? kpiName;

      radarData[eventCustomName] = {
        value: +format(radarValue),
        realVal: +format(realVal),
        realMax: +format(realMax),
        min,
        max: +format(max),
        percent,
        color,
      };
    });
    return Object.keys(radarData).length ? radarData : null;
  }, [speedometersData, colorRangesData]);

  const kolbasaData = useMemo(() => {
    const res: IColoredLineData[] = [];

    const dateColumnName = getTimeField(granularity ?? 'month');
    const kpiColumnName = `${selectedKPI?.kpi?.aggregation ?? 'AVG'}_${selectedKPI?.columnName}`;
    const decimals = getCorrectDecimal(selectedKPI?.kpi?.decimals);
    [...(prevKpiData ?? []), ...(currentKpiData ?? [])]?.forEach((item) => {
      const value = getCorrectValue(item[kpiColumnName]);
      const color = coloredLineColorData
        ? getColorByValue(value, coloredLineColorData.ranges)
        : '#2b4dd9';

      res.push({
        color,
        value: value.toFixed(decimals),
        date: String(item[dateColumnName]),
      });
    });
    return res;
  }, [
    granularity,
    selectedKPI?.kpi?.aggregation,
    selectedKPI?.kpi?.decimals,
    selectedKPI?.columnName,
    prevKpiData,
    currentKpiData,
    coloredLineColorData,
  ]);

  const generatedHeaderData = useMemo(() => {
    const sum = kolbasaData.reduce((acc, item) => {
      return acc + +item.value;
    }, 0);
    const average = sum / kolbasaData.length;
    const correctAverage = Number.isNaN(average) ? 0 : Math.round(average);
    return correctAverage;
  }, [kolbasaData]);

  return (
    <PriorityStyled>
      <PriorityHeader>
        <Typography>{selectedEvent?.label}</Typography>
        <Typography>{generatedHeaderData}</Typography>
      </PriorityHeader>
      <PriorityBody>
        {loading && <Skeleton variant="rounded" sx={{ width: '80%', height: '85%' }} />}
        {!loading && !radarChartData && (
          <Skeleton animation={false} variant="rounded" sx={{ width: '80%', height: '85%' }} />
        )}
        {!loading && radarChartData && <RadarChart radarChartData={radarChartData} />}
      </PriorityBody>
      <PriorityBottom onContextMenu={handleRightClick}>
        {kolbasaData?.length > 0 && (
          <>
            <ColorLineIndicator data={kolbasaData} dateRange={dateRange} />
            <GranularityMenu
              menuPosition={menuPosition}
              handleClose={handleClose}
              selectedGranularity={selectedGranularity}
              handleSelectGranularity={handleSelectGranularity}
            />
          </>
        )}
      </PriorityBottom>
    </PriorityStyled>
  );
};
