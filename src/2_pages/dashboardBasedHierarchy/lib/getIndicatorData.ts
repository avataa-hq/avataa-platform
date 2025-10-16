import { EventType, IRangeModel } from '6_shared';
import { getProgressData } from './getProgressData';
import { getColoredLineData } from './getColoredLineData';

interface IProps {
  currentData?: Record<string, any>[] | null;
  historyData?: Record<string, any>[] | null;
  targetHistoryData?: Record<string, any>[] | null;

  kpi?: EventType | null;

  kpiName?: string;
  dateColumnName?: string;

  colorRanges?: IRangeModel;
}

export const getIndicatorData = ({
  colorRanges,
  currentData,
  dateColumnName,
  historyData,
  kpi,
  kpiName,
  targetHistoryData,
}: IProps) => {
  const { expectedValues, coloredLineData, values, comparisonZeroPoint } = getColoredLineData({
    historyData,
    currentData,
    targetHistoryData,
    kpiName,
    dateColumnName,
    colorRanges,
    kpi,
  });

  const progressData = getProgressData({
    mainValueList: values,
    additionalValueList: expectedValues,
    comparisonZeroPoint,
    colorRanges,
    kpi,
  });

  return {
    coloredLineData,
    progressData,
  };
};
