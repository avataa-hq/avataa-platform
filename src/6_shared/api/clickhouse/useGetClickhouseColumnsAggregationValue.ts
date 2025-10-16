import { useEffect, useState } from 'react';
import {
  ClickhouseCreds,
  ClickhouseLevelsSettings,
  EventsResponseType,
  GetEventValuesForAll,
} from './types';
import { CORS, FORMAT_JSON } from './constants';

const getEventValuesForAll = async ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  table,
  dateColumn,
  events,
  granularity,
  aggregationType,
  dateFrom,
  dateTo,
}: ClickhouseCreds & GetEventValuesForAll) => {
  const credentials = `${_clickhouseName}:${_clickhousePass}`;
  const encodedCredentials = btoa(credentials);

  const dateCondition = `WHERE ${dateColumn} >= toDate('${dateFrom}') AND ${dateColumn} <= toDate('${dateTo}')`;

  const dailyKpiSelects = events
    .map(({ eventName }) => {
      return `SUM(${eventName}) AS daily_${eventName}`;
    })
    .join(', ');

  const finalKpiSelects = events
    .map(({ eventName }) => {
      const aggregation = aggregationType || 'AVG';
      return `${aggregation}(daily_${eventName}) AS ${aggregation}_${eventName}`;
    })
    .join(', ');

  const buildQueryForEvents = () => {
    const innerQuery = `
      SELECT
        toDate(${dateColumn}) AS day,
        ${dailyKpiSelects}
      FROM ${table}
      ${dateCondition}
      GROUP BY day
    `;

    const outerQuery = `
      SELECT
        ${finalKpiSelects}
      FROM (
        ${innerQuery}
      ) AS daily_aggregates
    `;

    return outerQuery;
  };

  const encodedQuery = encodeURIComponent(buildQueryForEvents());
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
      const json = await response.json();
      return json?.data || [];
    }
    console.error('Error querying ClickHouse:', response.statusText);
    return [];
  } catch (error) {
    console.error('Error interacting with ClickHouse:', error);
    return [];
  }
};

export const useGetClickhouseColumnsAggregationValue = ({
  _clickhouseUrl,
  _clickhouseName,
  _clickhousePass,
  _clickhouseCorsDisable,
  clickhouseLevelsSettings,
  granularity,
  aggregationType,
  dateFrom,
  dateTo,
}: ClickhouseCreds & GetEventValuesForAll & any) => {
  const [data, setData] = useState<{ [key: string]: EventsResponseType | null }>({});
  const [isLoading, setLoading] = useState(true);

  // useEffect(() => {
  //   setData({});
  // }, [clickhouseLevelsSettings]);

  useEffect(() => {
    const requiredProps: { [key: string]: any } = {
      _clickhouseUrl,
      _clickhouseName,
      _clickhousePass,
      clickhouseLevelsSettings,
      dateFrom,
      dateTo,
    };

    const missingProps = Object.keys(requiredProps).filter(
      (key) =>
        !requiredProps[key] ||
        (Array.isArray(requiredProps[key]) && requiredProps[key].length === 0),
    );

    if (missingProps.length > 0) {
      return;
    }

    const fetchDataForAllLevels = async () => {
      const levelPromises = Object.entries(
        (clickhouseLevelsSettings as unknown as ClickhouseLevelsSettings) ?? {},
      ).map(async ([levelKey, levelSettings]) => {
        const { table_name: table = '', datetime_column: dateColumn = '' } = levelSettings || {};

        if (!dateColumn) {
          console.warn(`Skipping level ${levelKey} due to missing dateColumn.`);
          return;
        }

        const events = Object.entries(levelSettings.events ?? {})
          .filter(([_, kpi]) => +kpi.weight !== 0)
          .flatMap(([key, kpi]) => ({
            eventName: key,
            aggregationType: kpi.aggregation ?? 'AVG',
          }));

        try {
          const res = await getEventValuesForAll({
            _clickhouseUrl,
            _clickhouseName,
            _clickhousePass,
            _clickhouseCorsDisable,
            table,
            dateColumn,
            events,
            granularity,
            aggregationType,
            dateFrom,
            dateTo,
          });

          setData((prevData) => ({
            ...prevData,
            [levelKey]: res,
          }));
        } catch (error) {
          console.error(`Error fetching data for level ${levelKey}:`, error);
        }
      });

      await Promise.all(levelPromises);
      setLoading(false);
    };

    fetchDataForAllLevels();
  }, [
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    granularity,
    aggregationType,
    dateFrom,
    dateTo,
    clickhouseLevelsSettings,
  ]);

  return { isLoading, data };
};
