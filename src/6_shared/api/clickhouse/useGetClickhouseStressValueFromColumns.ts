import { useEffect, useState } from 'react';
import { ClickhouseCreds, EventDataType, GetEventValuesType, StressPerDataModel } from './types';
import { AggregationType, GranularityType, CHUNK_SIZE } from './constants';
import { buildQueryForEvent, calculateResidualStress, formatEventData } from './lib';

const getStressValues = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  eventData,
  events,
  objectColumn,
  dateColumn,
  table,
  objectKeys,
  dateFrom,
  dateTo,
  granularity,
}: {
  _clickhouseUrl: string;
  _clickhouseName: string;
  _clickhousePass: string;
  eventData: EventDataType;
  events: { eventName: string; aggregationType: AggregationType }[];
  objectColumn: string;
  dateColumn: string;
  table: string;
  objectKeys: string[];
  dateFrom: string;
  dateTo: string;
  granularity: GranularityType;
}) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const maxRelaxationPeriod = Math.max(
    ...Object.values(eventData).map((event) => event.relaxationPeriod),
  );

  const eventColumns = events
    .map(({ eventName, aggregationType }) => {
      const aggregation = aggregationType ?? 'AVG';
      return `${aggregation}(${eventName}) AS ${eventName}_value`;
    })
    .join(',\n');

  const granularityColumn = {
    hour: `toStartOfHour(${dateColumn})`,
    day: `toDate(${dateColumn})`,
    week: `toStartOfWeek(${dateColumn})`,
    month: `toStartOfMonth(${dateColumn})`,
    year: `toStartOfYear(${dateColumn})`,
  }[granularity];

  const fetchBatch = async (batchKeys: string[]) => {
    const query = `
      SELECT
        ${granularityColumn} AS event_date,
        ${objectColumn} AS key,
        ${eventColumns}
      FROM ${table}
      WHERE
        ${objectColumn} IN (${batchKeys.map((id) => `'${id?.replace(/'/g, "\\'")}'`).join(', ')})
        AND ${dateColumn} >= toDate('${dateFrom}') - ${maxRelaxationPeriod}
        AND ${dateColumn} <= toDate('${dateTo}')
      GROUP BY event_date, ${objectColumn}
      ORDER BY event_date ASC, ${objectColumn} ASC
    `;

    const encodedQuery = encodeURIComponent(query);
    const url = `${_clickhouseUrl}?query=${encodedQuery}%20FORMAT%20JSON`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${encodedCredentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      console.error('Error querying ClickHouse:', response.statusText);
      return [];
    } catch (error) {
      console.error('Error interacting with ClickHouse:', error);
      return [];
    }
  };

  const batches = [];
  for (let i = 0; i < objectKeys.length; i += CHUNK_SIZE) {
    batches.push(objectKeys.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.all(batches.map(fetchBatch));

  const residualStress = calculateResidualStress({
    objectColumn,
    eventData,
    records: results.flat(),
    events,
    dateFrom,
    dateTo,
    granularity,
  });

  return residualStress;
};

export const useGetClickhouseStressValueFromColumns = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  table,
  objectColumn,
  dateColumn,
  eventData,
  events,
  objectKeys,
  dateFrom,
  dateTo,
  granularity,
  selectedEvent,
}: ClickhouseCreds &
  GetEventValuesType & {
    eventData: EventDataType | null;
    granularity: GranularityType;
    selectedEvent?: string;
  }) => {
  const [data, setData] = useState<StressPerDataModel[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      table,
      objectColumn,
      dateColumn,
      eventData,
      events,
      objectKeys,
      dateFrom,
      dateTo,
      granularity,
    };

    const missingProps = Object.keys(requiredProps).filter(
      (key) =>
        !requiredProps[key] ||
        (Array.isArray(requiredProps[key]) && requiredProps[key].length === 0),
    );

    if (missingProps.length > 0) {
      return;
    }

    if (!eventData || !dateFrom || !dateTo || !objectKeys) {
      return;
    }

    if (selectedEvent !== 'Stress') {
      const eventDetails = events.find((event) => event.eventName === selectedEvent);
      if (!eventDetails) {
        console.error(`Event not found: ${selectedEvent}`);
        return;
      }

      const fetchData = async () => {
        const query = buildQueryForEvent(eventDetails, {
          table,
          objectColumn,
          dateColumn,
          objectKeys,
          dateFrom,
          dateTo,
          granularity,
          _clickhouseUrl,
        });

        try {
          const response = await fetch(query.url, {
            method: 'GET',
            headers: {
              'Content-Type': 'text/plain',
              Authorization: `Basic ${btoa(`${_clickhouseName}:${_clickhousePass}`)}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            const formattedData = formatEventData(result.data, objectKeys, selectedEvent);
            setData(formattedData);
          } else {
            console.error('Error querying ClickHouse:', response.statusText);
          }
        } catch (error) {
          console.error('Error interacting with ClickHouse:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      const fetchData = async () => {
        try {
          const res = await getStressValues({
            _clickhouseUrl,
            _clickhouseName,
            _clickhousePass,
            eventData,
            events,
            objectColumn,
            dateColumn,
            table,
            objectKeys,
            dateFrom,
            dateTo,
            granularity,
          });
          setData(res ?? []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    eventData,
    events,
    objectColumn,
    dateColumn,
    table,
    objectKeys,
    dateFrom,
    dateTo,
    granularity,
    selectedEvent,
  ]);

  return { isLoading, data };
};
