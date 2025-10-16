import { useEffect, useState } from 'react';
import { CORS, FORMAT_JSON } from './constants';
import { ClickhouseCreds } from './types';

const getMaxDateFromClickhouse = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  dateColumn,
}: ClickhouseCreds & { dateColumn: string; table: string }) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const query = `SELECT max(${dateColumn}) AS max_date FROM ${table}`;
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
      return null;
    }

    const json = await response.json();
    return json?.data?.[0]?.max_date ?? null;
  } catch (error) {
    console.error('ClickHouse fetch error:', error);
    return null;
  }
};

export const useGetClickhouseMaxDate = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  dateColumn,
}: ClickhouseCreds & {
  dateColumn: string;
  table: string;
}) => {
  const [maxDate, setMaxDate] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      table,
      dateColumn,
    };

    const missingProps = Object.keys(requiredProps).filter(
      (key) =>
        !requiredProps[key] ||
        (Array.isArray(requiredProps[key]) && requiredProps[key].length === 0),
    );

    if (missingProps.length > 0) {
      console.warn('HAS MISSING PROPS in useGetClickhouseMaxDate', missingProps);
      setMaxDate(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const clMaxDate = await getMaxDateFromClickhouse({
        _clickhouseUrl,
        _clickhouseName,
        _clickhousePass,
        _clickhouseCorsDisable,
        table,
        dateColumn,
      });

      setMaxDate(clMaxDate);
      setLoading(false);
    })();
  }, [_clickhouseCorsDisable, _clickhouseName, _clickhousePass, _clickhouseUrl, dateColumn, table]);

  return { maxDate, isLoading };
};
