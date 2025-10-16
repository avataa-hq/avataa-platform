import {
  add,
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  parseISO,
} from 'date-fns';
import { EventDataType, StressDataModel, StressPerDataModel } from './types';
import { AggregationType, GranularityType } from './constants';

export const getGranularityClause = (granularity: string | undefined, dateColumn: string) => {
  let groupByClause = null;
  let granularityColumn = null;

  switch (granularity) {
    case 'minute':
      groupByClause = `toStartOfMinute(${dateColumn})`;
      granularityColumn = 'minute_start';
      break;
    case 'hour':
      groupByClause = `toStartOfHour(${dateColumn})`;
      granularityColumn = 'hour_start';
      break;
    case 'day':
      groupByClause = `toDate(${dateColumn})`;
      granularityColumn = 'day_start';
      break;
    case 'week':
      groupByClause = `toStartOfWeek(${dateColumn}, 1)`;
      granularityColumn = 'week_start';
      break;
    case 'month':
      groupByClause = `toStartOfMonth(${dateColumn})`;
      granularityColumn = 'month_start';
      break;
    case 'year':
      groupByClause = `toStartOfYear(${dateColumn})`;
      granularityColumn = 'year_start';
      break;
    default:
      groupByClause = null;
      granularityColumn = null;
  }

  return { groupByClause, granularityColumn };
};

export const calculateResidualStress = ({
  records,
  objectColumn,
  events,
  dateFrom,
  dateTo,
  eventData,
  granularity,
}: {
  records: Array<
    {
      blocking_value: number;
      drop_value: number;
      event_date: string;
      fault_value: number;
      key: string;
    } & Record<string, number | string>
  >;
  objectColumn: string;
  events: { eventName: string; aggregationType: AggregationType }[];
  eventData: EventDataType;
  dateFrom: string;
  dateTo: string;
  granularity: GranularityType;
}) => {
  const startDate = parseISO(dateFrom);
  const endDate = parseISO(dateTo);

  const getIntervals = (start: Date, end: Date) => {
    switch (granularity) {
      case 'hour':
        return eachHourOfInterval({ start, end });
      case 'day':
        return eachDayOfInterval({ start, end });
      case 'week':
        return eachWeekOfInterval({ start, end });
      case 'month':
        return eachMonthOfInterval({ start, end });
      case 'year':
        return eachYearOfInterval({ start, end });
      default:
        throw new Error(`Unsupported granularity: ${granularity}`);
    }
  };

  const intervals = getIntervals(startDate, endDate);

  const groupedByObjectKey = records.reduce((acc, record) => {
    const { key } = record;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(record);
    return acc;
  }, {} as Record<string, typeof records>);

  return Object.keys(groupedByObjectKey).map((objKey) => {
    const objKeyRecords = groupedByObjectKey[objKey];

    const stressData = intervals.map((currentDate) => {
      const stressPerInterval: { [eventName: string]: number } = {};

      events.forEach(({ eventName, aggregationType }) => {
        const { weight, relaxationPeriod, alpha, beta } = eventData[eventName] || {};
        let totalStress: number;

        switch (aggregationType) {
          case 'MIN':
            totalStress = Infinity;
            break;
          case 'MAX':
            totalStress = -Infinity;
            break;
          default:
            totalStress = 0;
        }
        let count = 0;

        objKeyRecords.forEach((record) => {
          const eventDate = parseISO(record.event_date as string);
          const daysDiff = differenceInDays(currentDate, eventDate);

          if (daysDiff >= 0 && daysDiff < relaxationPeriod) {
            const eventValue = record[`${eventName}_value`] as number;
            const decay = (1 - daysDiff / relaxationPeriod) ** (alpha / beta);
            const stressValue = eventValue * weight * decay;

            if (aggregationType === 'SUM' || aggregationType === 'AVG') {
              totalStress += stressValue;
              if (aggregationType === 'AVG') count++;
            } else if (aggregationType === 'MIN') {
              totalStress = Math.min(totalStress, stressValue);
            } else if (aggregationType === 'MAX') {
              totalStress = Math.max(totalStress, stressValue || 0);
            }
          }
        });

        if (aggregationType === 'AVG' && count > 0) {
          totalStress /= count;
        } else if (aggregationType === 'AVG' && count === 0) {
          totalStress = 0;
        }

        if (totalStress === Infinity || totalStress === -Infinity || Number.isNaN(totalStress)) {
          totalStress = 0;
        }

        stressPerInterval[eventName] = totalStress;
      });

      const totalStressSum = Object.values(stressPerInterval).reduce(
        (sum, value) => sum + value,
        0,
      );

      return {
        date: currentDate.toISOString().split('T')[0],
        stress: totalStressSum,
      } as StressDataModel;
    });

    return {
      key: objKey,
      stressData,
    } as StressPerDataModel;
  });
};

export const buildQueryForEvent = (
  event: { eventName: string; aggregationType: AggregationType },
  {
    table,
    objectColumn,
    dateColumn,
    objectKeys,
    dateFrom,
    dateTo,
    granularity,
    _clickhouseUrl,
  }: {
    table: string;
    objectColumn: string;
    dateColumn: string;
    objectKeys: string[];
    dateFrom: string;
    dateTo: string;
    granularity: GranularityType;
    _clickhouseUrl: string;
  },
) => {
  const granularityColumn = {
    hour: `toStartOfHour(${dateColumn})`,
    day: `toDate(${dateColumn})`,
    week: `toStartOfWeek(${dateColumn})`,
    month: `toStartOfMonth(${dateColumn})`,
    year: `toStartOfYear(${dateColumn})`,
  }[granularity];

  const aggregation = event.aggregationType ?? 'AVG';

  const query = `
    SELECT
        ${granularityColumn} AS event_date,
        ${objectColumn} AS key,
        ${aggregation}(${event.eventName}) AS ${event.eventName}_value
    FROM ${table}
    WHERE
        ${objectColumn} IN (${objectKeys
    .map((id: any) => `'${id.replace(/'/g, "\\'")}'`)
    .join(', ')})
        AND ${dateColumn} >= toDate('${dateFrom}')
        AND ${dateColumn} <= toDate('${dateTo}')
    GROUP BY event_date, ${objectColumn}
    ORDER BY event_date ASC, ${objectColumn} ASC
  `;

  return { url: `${_clickhouseUrl}?query=${encodeURIComponent(query)}%20FORMAT%20JSON` };
};

export const formatEventData = (
  data: any[],
  objectKeys: string[],
  selectedEvent?: string,
): StressPerDataModel[] => {
  const groupedByObjectKey = objectKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as Record<string, { date: string; stress: number }[]>);

  data.forEach((row) => {
    if (groupedByObjectKey[row.key]) {
      groupedByObjectKey[row.key].push({
        date: row.event_date,
        stress: Number(row[`${selectedEvent}_value`]) || 0,
      });
    }
  });

  return Object.entries(groupedByObjectKey).map(([key, stressData]) => ({
    key,
    stressData,
  }));
};
