import { Events } from '6_shared';
import { AggregationType } from '6_shared/api/clickhouse/constants';

export const getEventsName = (events?: Events, withAggregation?: boolean, withNested?: boolean) => {
  if (!withAggregation) {
    const resSet = new Set<string>();

    Object.entries(events ?? {}).forEach(([key, value]) => {
      resSet.add(key);
      const nestedEvents = value.nestedKpi;
      if (withNested && nestedEvents && nestedEvents.length) {
        nestedEvents.forEach((nestedEvent) => {
          resSet.add(nestedEvent.columnName);
        });
      }
    });

    return Array.from(resSet);
  }

  const resMap: Map<string, { eventName: string; aggregationType: AggregationType }> = new Map();
  const resArray: { eventName: string; aggregationType: AggregationType }[] = [];

  const resSet = new Set<string>();

  Object.entries(events ?? {}).forEach(([key, value]) => {
    resSet.add(key);
    if (!resMap.has(key)) {
      resMap.set(key, { eventName: key, aggregationType: value.aggregation ?? 'AVG' });
    }
    const nestedEvents = value.nestedKpi;
    if (withNested && nestedEvents && nestedEvents.length) {
      nestedEvents.forEach((nestedEvent) => {
        resSet.add(nestedEvent.columnName);
        if (!resMap.has(nestedEvent.columnName)) {
          resMap.set(nestedEvent.columnName, {
            eventName: nestedEvent.columnName,
            aggregationType: nestedEvent.data.aggregation ?? 'AVG',
          });
        }
      });
    }
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const value of resMap.values()) {
    resArray.push(value);
  }

  return resArray;
};
