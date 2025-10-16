import { useEffect, useState } from 'react';
import { ClickhouseCreds, EventsResponseType, GetEventValuesType } from './types';
import { getGranularityClause } from './lib';
import { CHUNK_SIZE, CORS, FORMAT_JSON } from './constants';

const getEventValues = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  dateColumn,
  objectKeys,
  events,
  granularity,
  dateFrom,
  dateTo,
}: ClickhouseCreds & GetEventValuesType) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const dateCondition = `WHERE ${dateColumn} >= toDate('${dateFrom}') AND ${dateColumn} <= toDate('${dateTo}')`;

  const kpiSelects = events
    .map(({ eventName, aggregationType }) => {
      const aggregation = aggregationType || 'AVG';
      return `${aggregation}(${eventName}) AS ${aggregation}_${eventName}`;
    })
    .join(', ');

  const fetchBatch = async (batchKeys: string[]) => {
    const { groupByClause, granularityColumn } = getGranularityClause(granularity, dateColumn);

    const selectClause =
      granularity && granularityColumn
        ? `${objectColumn} AS objectColumn, ${groupByClause} AS ${granularityColumn}, ${kpiSelects}`
        : `${objectColumn} AS objectColumn, ${kpiSelects}`;

    const groupByClauseFinal = granularity
      ? `${objectColumn}, ${groupByClause}`
      : `${objectColumn}`;

    const objectFilter =
      batchKeys.length > 0
        ? `AND ${objectColumn} IN (${batchKeys
            .map((id) => `'${id?.replace(/'/g, "\\'")}'`)
            .join(', ')})`
        : '';

    const query = `
      SELECT ${selectClause}
      FROM ${table}
      ${dateCondition} ${objectFilter}
      GROUP BY ${groupByClauseFinal}
      ORDER BY objectColumn ASC, ${granularityColumn || 'objectColumn'}
    `;

    const encodedQuery = encodeURIComponent(query);
    const url = `${_clickhouseUrl}?query=${encodedQuery}${FORMAT_JSON}${
      _clickhouseCorsDisable === 'true' ? CORS : ''
    }`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${encodedCredentials}`,
        },
      });

      if (!response.ok) {
        console.error('ClickHouse query error:', response.statusText);
        return [];
      }

      const json = await response.json();
      return json?.data || [];
    } catch (error) {
      console.error('ClickHouse fetch error:', error);
      return [];
    }
  };

  const batches = [];
  for (let i = 0; i < objectKeys.length; i += CHUNK_SIZE) {
    batches.push(objectKeys.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.all(batches.map(fetchBatch));

  return results.flat();
};

export const useGetClickhouseValueFromColumns = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  dateColumn,
  objectKeys,
  events,
  granularity,
  dateFrom,
  dateTo,
}: ClickhouseCreds & GetEventValuesType) => {
  const [data, setData] = useState<EventsResponseType | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      table,
      objectColumn,
      dateColumn,
      objectKeys,
      events,
      dateFrom,
      dateTo,
    };

    const missingProps = Object.keys(requiredProps).filter(
      (key) =>
        !requiredProps[key] ||
        (Array.isArray(requiredProps[key]) && requiredProps[key].length === 0),
    );

    if (missingProps.length > 0) {
      console.warn('HAS MISSING PROPS in useGetClickhouseValueFromColumns', missingProps);
      setData(null);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getEventValues({
          _clickhouseUrl,
          _clickhouseName,
          _clickhousePass,
          _clickhouseCorsDisable,
          table,
          objectColumn,
          dateColumn,
          objectKeys,
          events,
          granularity,
          dateFrom,
          dateTo,
        });
        setData(res);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table,
    objectColumn,
    dateColumn,
    objectKeys,
    events,
    granularity,
    dateFrom,
    dateTo,
  ]);

  return { isLoading, data };
};
