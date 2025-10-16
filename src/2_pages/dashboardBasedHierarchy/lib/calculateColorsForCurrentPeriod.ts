import dayjs from 'dayjs';
import { ICalculateForCurrentPeriodData } from '6_shared';
import { groupedDataByDate } from './groupedDataByDate';

function getDeltaFromLastHistory(
  historyData: ICalculateForCurrentPeriodData[],
  historySameGranularity: ICalculateForCurrentPeriodData[],
  zeroPoint: number,
): number {
  const data = historyData.length ? historyData : historySameGranularity;

  if (!data.length) return 0;
  const maxDate = new Date(data[0].date).getTime();

  const lastDate = data.reduce((latest, item) => {
    return Math.max(latest, new Date(item.date).getTime());
  }, maxDate);

  const lastValue = data.find((item) => new Date(item.date).getTime() === lastDate)?.value ?? 0;

  return zeroPoint - lastValue;
}

export function calculateColorsForCurrentPeriod(
  deltaHistory: ICalculateForCurrentPeriodData[],
  currentData: ICalculateForCurrentPeriodData[],
  historySameGranularity: ICalculateForCurrentPeriodData[],
  zeroPoint: number,
) {
  const delta = getDeltaFromLastHistory(deltaHistory, historySameGranularity, zeroPoint);
  const groupedHistoryData = groupedDataByDate(historySameGranularity);

  const result: { value: number; date: string; historyDate: string }[] = [];

  for (let i = 0; i < currentData.length; i++) {
    const yearAgoTime = dayjs(currentData[i].date).subtract(1, 'year').toISOString();

    const historyValueData = groupedHistoryData.get(yearAgoTime);

    if (historyValueData) {
      const targetValue = (historyValueData?.value ?? -1) + delta; // Целевое значение по плану
      const diff = targetValue - currentData[i].value; // Разница между целевым значением и текущим показателем
      const expectedValue = zeroPoint + diff; // Значение, с которым ищем цвет: zeroPoint + diff (diff может быть +/-, учитывая прирост/падение)

      result.push({
        value: expectedValue,
        historyDate: historyValueData?.date ?? '',
        date: currentData[i].date,
      });
    }
  }

  return result;
}
