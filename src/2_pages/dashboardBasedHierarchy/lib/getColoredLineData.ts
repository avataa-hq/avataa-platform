import { EventType, ICalculateForCurrentPeriodData, IColoredLineData, IRangeModel } from '6_shared';
import dayjs from 'dayjs';
import { calculateColorsForCurrentPeriod } from './calculateColorsForCurrentPeriod';
import { getComparisonZeroPoint } from './getComparisonZeroPoint';
import { groupedDataByDate } from './groupedDataByDate';
import { getColorByValue } from './getColorByValue';

interface IProps {
  currentData?: Record<string, any>[] | null;
  historyData?: Record<string, any>[] | null;
  targetHistoryData?: Record<string, any>[] | null;

  kpi?: EventType | null;

  kpiName?: string;
  dateColumnName?: string;

  colorRanges?: IRangeModel;
}

export const getColoredLineData = ({
  currentData,
  historyData,
  targetHistoryData,
  colorRanges,
  dateColumnName,
  kpiName,
  kpi,
}: IProps) => {
  const valueDecimals = kpi?.decimals ? +kpi.decimals : undefined;

  const currenValues: ICalculateForCurrentPeriodData[] =
    currentData?.map((item) => {
      return {
        value: +(item[kpiName ?? ''] || 0),
        date: item[dateColumnName ?? ''],
      };
    }) ?? [];

  const historyValues: ICalculateForCurrentPeriodData[] =
    historyData?.map((item) => {
      return {
        value: +(item[kpiName || ''] ?? 0),
        date: item[dateColumnName ?? ''],
      };
    }) ?? [];
  const targetHistoryValues: ICalculateForCurrentPeriodData[] =
    targetHistoryData?.map((item) => {
      return {
        value: +(item[kpiName || ''] ?? 0),
        date: item.year_start,
      };
    }) ?? [];

  const comparisonZeroPoint = getComparisonZeroPoint(colorRanges);

  const expectedValues = calculateColorsForCurrentPeriod(
    targetHistoryValues,
    currenValues,
    historyValues,
    comparisonZeroPoint,
  );
  const coloredLineData: IColoredLineData[] = [];
  const values: number[] = [];
  const expectedValueList: number[] = [];

  const groupedExpectedValues = groupedDataByDate(expectedValues);

  const currentDataList = currentData ?? [];

  for (let i = 0; i < currentDataList.length; i++) {
    const item = currentDataList[i];
    const rawValue = +item[kpiName ?? ''];
    const value = rawValue == null || Number.isNaN(+rawValue) ? 0 : +rawValue;

    const currentItemTime = dayjs(item[dateColumnName ?? '']).toISOString();
    const historyDataItem = groupedExpectedValues.get(currentItemTime);

    const historyValuesNumber = historyDataItem?.value;
    const historyDate = historyDataItem?.historyDate;

    const valueForColor =
      historyValuesNumber != null && historyValuesNumber !== -1 ? historyValuesNumber : +value;
    const color = getColorByValue(valueForColor, colorRanges);

    const date = item[dateColumnName ?? ''] ? String(item[dateColumnName ?? '']) : '';

    if (historyValuesNumber) expectedValueList.push(historyValuesNumber);

    values.push(value);

    coloredLineData.push({
      value,
      date,
      color,
      comparisonZeroPoint,
      expectedValue: historyValuesNumber,
      prevPeriodDate: historyDate,
      valueDecimals,
    });
  }

  return { coloredLineData, values, expectedValues: expectedValueList, comparisonZeroPoint };
};
