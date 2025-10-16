import { useEffect, useState } from 'react';
import { ClickhouseCreds, EventsResponseType, GetEventMaxValuesType } from './types';
import { CHUNK_SIZE, CORS, FORMAT_JSON } from './constants';

const getEventMaxValues = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  objectKeys,
  events,
}: ClickhouseCreds & GetEventMaxValuesType) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const kpiSelects = events
    .map(({ eventName }) => `MAX(${eventName}) AS MAX_${eventName}`)
    .join(', ');

  const fetchBatch = async (batchKeys: string[]) => {
    const objectFilter =
      batchKeys.length > 0
        ? `WHERE ${objectColumn} IN (${batchKeys
            .map((id) => `'${id?.replace(/'/g, "\\'")}'`)
            .join(', ')})`
        : '';

    const query = `SELECT ${kpiSelects} FROM ${table} ${objectFilter}`;
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

  const batches: string[][] = [];
  for (let i = 0; i < objectKeys.length; i += CHUNK_SIZE) {
    batches.push(objectKeys.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.all(batches.map(fetchBatch));

  return results.flat();
};

export const useGetClickhouseMaxValueFromColumns = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  objectKeys,
  events,
  withMaxValues = false,
}: ClickhouseCreds & GetEventMaxValuesType & { withMaxValues?: boolean }) => {
  const [data, setData] = useState<EventsResponseType | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!withMaxValues) return;

    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      table,
      objectColumn,
      objectKeys,
      events,
    };

    const missingProps = Object.keys(requiredProps).filter(
      (key) =>
        !requiredProps[key] ||
        (Array.isArray(requiredProps[key]) && requiredProps[key].length === 0),
    );

    if (missingProps.length > 0) {
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getEventMaxValues({
          _clickhouseUrl,
          _clickhouseName,
          _clickhousePass,
          _clickhouseCorsDisable,
          table,
          objectColumn,
          objectKeys,
          events,
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
    objectKeys,
    events,
    withMaxValues,
  ]);

  return { isLoading, data };
};
