import { useEffect, useState } from 'react';
import { ClickhouseCreds, ColumnsResponseType } from './types';
import { CORS, FORMAT_JSON } from './constants';

const getClickhouseTableColumns = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
}: ClickhouseCreds & { table: string }): Promise<
  (ColumnsResponseType[number] & { table: string })[]
> => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const query = `DESCRIBE TABLE ${table}`;
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
      const data = jsonData?.data || [];
      // Добавим имя таблицы к каждой колонке
      return data.map((column: any) => ({ ...column, table }));
    }

    console.error('Error querying ClickHouse:', response.statusText);
    return [];
  } catch (error) {
    console.error('Error interacting with ClickHouse:', error);
    return [];
  }
};

export const useGetClickhouseTableColumns = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  tables,
}: ClickhouseCreds & { tables?: string | string[] }) => {
  const [data, setData] = useState<(ColumnsResponseType[number] & { table: string })[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    const tablesArray = Array.isArray(tables) ? tables : tables ? [tables] : [];

    if (!_clickhouseUrl || !_clickhouseName || !_clickhousePass || tablesArray.length === 0) return;

    (async () => {
      try {
        const allData = await Promise.all(
          tablesArray.map((table) =>
            getClickhouseTableColumns({
              _clickhouseUrl,
              _clickhouseName,
              _clickhousePass,
              _clickhouseCorsDisable,
              table,
            }),
          ),
        );
        setData(allData.flat());
      } catch (error) {
        console.error('Error fetching table columns:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [_clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable, tables]);

  return { isLoading, data };
};
