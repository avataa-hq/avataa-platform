import { useEffect, useState } from 'react';
import { ClickhouseCreds, GetObjectsByParent } from './types';
import { CHUNK_SIZE, CORS } from './constants';

const getObjectsByParent = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  parentColumn,
  parentKeys,
}: ClickhouseCreds & GetObjectsByParent) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const buildQueryForParents = (batchKeys: string[]) => {
    const objectFilter =
      batchKeys.length > 0
        ? `PREWHERE ${parentColumn} IN (${batchKeys
            .map((id) => `'${id?.replace(/'/g, "\\'")}'`)
            .join(', ')})`
        : '';

    return `
      SELECT ${objectColumn}
      FROM ${table}
      ${objectFilter}
    `;
  };

  const fetchBatch = async (batchKeys: string[]) => {
    const encodedQuery = encodeURIComponent(buildQueryForParents(batchKeys));
    const url = `${_clickhouseUrl}?query=${encodedQuery}%20FORMAT%20JSON${
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

      if (response.ok) {
        const json = await response.json();
        return json?.data?.map((obj: { key: string }) => obj.key) || [];
      }
      console.error('Error querying ClickHouse:', response.statusText);
      return [];
    } catch (error) {
      console.error('Error interacting with ClickHouse:', error);
      return [];
    }
  };

  const batches: string[][] = [];
  for (let i = 0; i < parentKeys.length; i += CHUNK_SIZE) {
    batches.push(parentKeys.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.all(batches.map(fetchBatch));

  return results.flat();
};

export const useGetClickhouseObjectsByParent = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  objectColumn,
  parentColumn,
  parentKeys,
  skip = false,
}: ClickhouseCreds & GetObjectsByParent) => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      table,
      objectColumn,
      parentColumn,
      parentKeys,
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
        const res = await getObjectsByParent({
          _clickhouseUrl,
          _clickhouseName,
          _clickhousePass,
          _clickhouseCorsDisable,
          table,
          objectColumn,
          parentColumn,
          parentKeys,
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
    parentColumn,
    parentKeys,
    skip,
  ]);

  return { isLoading, data };
};
