import { useMemo } from 'react';
import { IColorRangeModel } from '6_shared';

interface IProps {
  tprm_id: string;
  tmo_id: string;
  colorRanges: Partial<Record<string, { [key: string]: IColorRangeModel }>> | null;
}

export const useSetColorRanges = (
  { colorRanges, tprm_id, tmo_id }: IProps,
  useMemoFn = useMemo,
) => {
  return useMemoFn(() => {
    let colors: string[] = [];
    let values: number[] = [];

    if (colorRanges) {
      const colorRange = colorRanges[tmo_id]?.[tprm_id];

      if (colorRange && colorRange.ranges?.colors && colorRange.ranges?.values) {
        colors = colorRange.ranges.colors.map((color: { hex: string }) => color.hex);
        values = colorRange.ranges.values;
      }
    }
    return { colors, values };
  }, [colorRanges, tmo_id, tprm_id, useMemoFn]);
};
