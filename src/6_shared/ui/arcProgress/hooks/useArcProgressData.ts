import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import {
  IArcProgressData,
  IArcProgressValue,
  IArcTooltip,
  IFillSegment,
  ITickMark,
} from '../types';
import { createFormatter } from '../../../lib';
import { valueToPercent } from '../lib/valueToPercen';

const convertValue = (value?: IArcProgressValue): IFillSegment => {
  return {
    from: 0,
    to: valueToPercent(value?.value ?? 0, value?.min ?? 0, value?.max ?? 100),
    color: value?.color,
  };
};

export const useArcProgressData = ({
  value,
  additionalValue,
  numberOfDecimals = 2,
}: IArcProgressData) => {
  const { palette } = useTheme();
  const formatter = createFormatter(numberOfDecimals);

  const fillSegments = useMemo(() => {
    const result: IFillSegment[] = [];

    if (additionalValue) {
      const additionalWithColor = {
        ...additionalValue,
        color: additionalValue.color ?? palette.primary.light,
      };
      result.push(convertValue(additionalWithColor));
    }

    if (value) {
      const mailWithColor = { ...value, color: value.color ?? palette.primary.dark };
      result.push(convertValue(mailWithColor));
    }

    return result;
  }, [additionalValue, palette.primary.dark, palette.primary.light, value]);

  const displayMainValue = useMemo(() => {
    // const clamped = clamp(value?.value ?? 0, value?.min ?? 0, value?.max ?? 100);
    return `${formatter.format(value?.value ?? 0)}`;
  }, [formatter, value]);

  const unit = useMemo(() => value?.valueUnit || '', [value]);

  const displaySecondValue = useMemo(() => {
    return `${formatter.format(additionalValue?.value ?? 0)}${
      additionalValue?.valueUnit != null ? additionalValue?.valueUnit : ''
    }`;
  }, [formatter, additionalValue]);

  const ticksSegments: ITickMark[] = useMemo(() => {
    if (!value?.tickMarks) return [];
    return value.tickMarks.flatMap((t) => {
      if (!t.value) return [];
      const percentValue = valueToPercent(t.value, value?.min ?? 0, value?.max ?? 100);
      return { ...t, value: percentValue };
    });
  }, [value?.tickMarks, value?.max, value?.min]);

  const tooltipData: IArcTooltip = useMemo(() => {
    return {
      mainValue: {
        value: +displayMainValue,
        valueDecimals: value?.valueDecimals,
        prev: value?.prevValue,
        unit: value?.valueUnit,
        color: value?.color,
        label: value?.label,
        marks: value?.tickMarks ?? [],
        description: value?.description ?? '',
      },
      additionalValue: {
        value: +displaySecondValue,
        valueDecimals: value?.valueDecimals,
        prev: additionalValue?.prevValue,
        unit: additionalValue?.valueUnit,
        color: additionalValue?.color,
        label: additionalValue?.label,
        marks: additionalValue?.tickMarks ?? [],
      },
    };
  }, [displayMainValue, value, displaySecondValue, additionalValue]);

  return { fillSegments, displayMainValue, displaySecondValue, ticksSegments, tooltipData, unit };
};
