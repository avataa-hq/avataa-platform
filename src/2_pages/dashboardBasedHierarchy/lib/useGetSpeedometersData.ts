import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { ILocalEvent, ISpeedometerData, Kpis, LevelSettings } from '6_shared';
import { EventsResponseType } from '../../../6_shared/api/clickhouse/types';

const getCorrectValue = (val: string | undefined | number | null) => {
  if (val != null && !isNaN(+val)) return +val;
  return null;
};
const groupKpis = (events: Kpis): Kpis => {
  const result: Kpis = {};

  // First, we run through ordinary keys and clean the Additional field
  Object.entries(events).forEach(([key, value]) => {
    if (!key.includes('additional')) {
      const { additional, ...rest } = value;
      result[key] = rest;
    }
  });

  // Add additional to ordinary
  Object.entries(events).forEach(([key, value]) => {
    if (key.includes('additional')) {
      const baseKey = key.replace(' additional', '');

      if (result[baseKey]) result[baseKey].additional = value;
    }
  });

  return result;
};

const getEventValue = (
  data: EventsResponseType | null,
  objKey: string,
  eventKey: string,
  numberOfDecimals: number,
) => {
  if (!data) return 0;
  const foundItem = data.find((item) => item?.objectColumn === objKey);
  if (!foundItem) return 0;
  const foundValue = foundItem[eventKey];
  if (!foundValue) return 0;
  const numValue = +foundValue;
  return +numValue.toFixed(numberOfDecimals);
};

const sumSpeedometersValue = (
  speedometerItems: ISpeedometerData[],
  aggregation: 'AVG' | 'SUM',
  totalCount: number,
) => {
  const result = { mainSum: 0, initialSum: 0, additionalSum: 0 };

  speedometerItems.forEach((item) => {
    const mainValue = getCorrectValue(item?.value) ?? 0;
    const initialValue = getCorrectValue(item?.initialValue) ?? 0;
    const additionalValue = getCorrectValue(item?.additionalValue?.value) ?? 0;

    result.mainSum += mainValue;
    result.initialSum += initialValue;
    result.additionalSum += additionalValue;
  });

  const aggregationResult = {
    mainAggregationValue: aggregation === 'AVG' ? result.mainSum / totalCount : result.mainSum,
    initialAggregationValue:
      aggregation === 'AVG' ? result.initialSum / totalCount : result.initialSum,
    additionalAggregationValue:
      aggregation === 'AVG' ? result.additionalSum / totalCount : result.additionalSum,
  };

  return aggregationResult;
};

interface IProps {
  currentData: EventsResponseType | null;
  previousData: EventsResponseType | null;

  kpis?: Kpis | null;
  events: ILocalEvent[];

  maxValues: EventsResponseType | null;
  objIds: string[];
  currentLevelSettings?: LevelSettings;

  withMaxValues?: boolean;
}

export const useGetSpeedometersData = ({
  currentData,
  previousData,

  kpis,
  events,

  maxValues,
  objIds,
  currentLevelSettings,

  withMaxValues,
}: IProps) => {
  const { palette } = useTheme();

  const eventCustomNames = useMemo(() => {
    if (!currentLevelSettings) return {};

    const eventCustomNameList: Record<string, string> = {};
    Object.entries(currentLevelSettings.clickhouse_settings?.events ?? {}).forEach(
      ([key, value]) => {
        eventCustomNameList[key] = value?.name ?? key;
      },
    );

    return eventCustomNameList;
  }, [currentLevelSettings]);

  const speedometersData = useMemo(() => {
    if (!kpis || !Object.keys(kpis).length) return {};

    const groupedEventsList = groupKpis(kpis);

    const speedData: Record<string, Record<string, ISpeedometerData>> = {};

    Object.values(groupedEventsList).forEach((event) => {
      const { additional, max, aggregation, decimals, direction, min, ID, Direction } = event;
      const evenData = currentLevelSettings?.clickhouse_settings?.events?.[ID];

      const unit = evenData?.unit || '';
      const description = evenData?.description || '';

      const composedEventKey = `${aggregation ?? 'AVG'}_${ID}`;
      const sourceKey = ID;

      const minValue = +min || 0;
      const directionValue = Direction ?? direction ?? 'up';
      const numberOfDecimals = decimals !== null ? +decimals : 10;

      const eventAgg = events?.find((ev) => ev.eventName === sourceKey)?.aggregationType || 'AVG';

      let maxValue = +max || 100;
      if (withMaxValues && eventAgg !== 'SUM' && maxValues?.length) {
        maxValue = Number(maxValues[0]?.[`MAX_${sourceKey}`] || maxValue);
      }

      const additionalEventName = additional
        ? `${additional?.aggregation ?? 'AVG'}_${additional.ID}`
        : null;

      let icon: 'down' | 'up' | 'stable' = 'stable';

      speedData[composedEventKey] = objIds.reduce((acc, objKey) => {
        const prevValue = getEventValue(previousData, objKey, composedEventKey, numberOfDecimals);

        const prevAdditionalValue = additionalEventName
          ? getEventValue(previousData, objKey, additionalEventName, numberOfDecimals)
          : null;

        const value = getEventValue(currentData, objKey, composedEventKey, numberOfDecimals);

        const additionalValue = additionalEventName
          ? getEventValue(currentData, objKey, additionalEventName, numberOfDecimals)
          : null;

        if (prevValue < value) icon = 'up';
        if (prevValue > value) icon = 'down';

        const getIconColor = () => {
          if (icon === 'up') {
            if (directionValue === 'up') return palette.success.main;
            if (directionValue === 'down') return palette.error.main;
          }
          if (icon === 'down') {
            if (directionValue === 'up') return palette.error.main;
            if (directionValue === 'down') return palette.success.main;
          }
          return undefined;
        };

        acc[objKey] = {
          key: sourceKey,
          name: eventCustomNames?.[sourceKey] ?? sourceKey,
          initialValue: prevValue,
          value,
          minValue,
          maxValue,
          directionValue,
          numberOfDecimals,
          icon,
          iconColor: getIconColor(),
          description,
          unit,
          valueUnit: unit,
          additionalValue: {
            min: getCorrectValue(additional?.min) ?? minValue ?? 0,
            max: getCorrectValue(additional?.max) ?? maxValue ?? 100,
            value: getCorrectValue(additionalValue) ?? prevValue ?? 0,
            label: eventCustomNames?.[additional?.ID ?? ''] ?? 'Initial value',
            prevValue: prevAdditionalValue ?? prevValue ?? 0,
          },
        } as ISpeedometerData;
        return acc;
      }, {} as Record<string, ISpeedometerData>);
    }, []);

    return speedData;
  }, [
    currentData,
    currentLevelSettings?.clickhouse_settings?.events,
    eventCustomNames,
    events,
    kpis,
    maxValues,
    objIds,
    palette.error.main,
    palette.success.main,
    previousData,
    withMaxValues,
  ]);

  const aggregatedSpeedometersData = useMemo(() => {
    if (!Object.keys(speedometersData)?.length) return null;

    const result: { [event: string]: { [nodeKey: string]: ISpeedometerData } } = {};

    const aggregationType: 'AVG' | 'SUM' = 'AVG';

    Object.entries(speedometersData).forEach(([key, values]) => {
      const speedometerItems = Object.values(values);
      const speedometerItemsLength = Object.values(values)?.length;

      const { additionalAggregationValue, initialAggregationValue, mainAggregationValue } =
        sumSpeedometersValue(speedometerItems, aggregationType, speedometerItemsLength);

      let icon: 'up' | 'down' | 'stable' = 'stable';

      if (initialAggregationValue < mainAggregationValue) icon = 'up';
      if (initialAggregationValue > mainAggregationValue) icon = 'down';

      const getIconColor = (direction: 'up' | 'down') => {
        if (icon === 'up') {
          if (direction === 'up') return palette.success.main;
          if (direction === 'down') return palette.error.main;
        }
        if (icon === 'down') {
          if (direction === 'up') return palette.error.main;
          if (direction === 'down') return palette.success.main;
        }
        return undefined;
      };

      if (Object.values(values)?.[0]) {
        result[key] = {
          // @ts-ignore
          root: {
            ...Object.values(values)[0],
            value: mainAggregationValue,
            icon,
            iconColor: getIconColor(Object.values(values)?.[0].directionValue ?? 'up'),
            initialValue: initialAggregationValue,
            ...(Object.values(values)?.[0].additionalValue && {
              additionalValue: {
                ...Object.values(values)?.[0].additionalValue,
                value: additionalAggregationValue,
              },
            }),
          },
        };
      }
    });

    return result;
  }, [palette.error.main, palette.success.main, speedometersData]);

  return { speedometersData, aggregatedSpeedometersData };
};
