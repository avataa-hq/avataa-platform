import { useEffect, useState } from 'react';
import { ClickhouseCreds, TablesResponseType } from './types';
import { CORS, FORMAT_JSON } from './constants';

const getClickhouseTables = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
}: ClickhouseCreds): Promise<TablesResponseType> => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const query = `
    SELECT name 
    FROM system.tables 
    WHERE database NOT IN ('system', 'information_schema') 
    AND engine IS NOT NULL
    AND name NOT IN (
    'COLUMNS', 'TABLES', 'VIEWS', 'STATISTICS', 'SCHEMATA',
    'KEY_COLUMN_USAGE', 'REFERENTIAL_CONSTRAINTS',
    'columns', 'tables', 'views', 'statistics', 'schemata',
    'key_column_usage', 'referential_constraints'
  )
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

    if (response.ok) {
      const jsonData = await response.json();
      const data = jsonData?.data;
      return data || [];
    }

    console.error('Error querying ClickHouse:', response.statusText);
    return [];
  } catch (error) {
    console.error('Error interacting with ClickHouse:', error);
    return [];
  }
};

export const useGetClickhouseTableNames = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
}: ClickhouseCreds) => {
  const [data, setData] = useState<TablesResponseType | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!_clickhouseUrl || !_clickhouseName || !_clickhousePass) return;
    (async function fetchData() {
      try {
        const res = await getClickhouseTables({
          _clickhouseUrl,
          _clickhouseName,
          _clickhousePass,
          _clickhouseCorsDisable,
        });
        setData(res);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [_clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable]);

  return { isLoading, data };
};
