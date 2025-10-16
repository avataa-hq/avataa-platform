import { useGetColorRanges } from '5_entites/inventory/api';
import { NodeByMoIdModel } from '6_shared/api/graph/types';
import { useCallback } from 'react';

interface IProps {
  tmo_ids: string[] | undefined;
  tprm_ids: string[] | undefined;
}

export const useGetRangeColor = ({ tmo_ids, tprm_ids }: IProps) => {
  const { colorRangesData } = useGetColorRanges({
    tmo_ids,
    tprm_ids,
  });

  const getRangeColor = useCallback(
    (node: NodeByMoIdModel) => {
      if (colorRangesData) {
        const colorRange = colorRangesData.find((range) => range.tmoId === node.tmo.toString());
        if (!colorRange) return undefined;

        if (colorRange.valType === 'string' && node.data) {
          const paramColor = colorRange.ranges.colors.find((col: any) =>
            node.data?.params?.some((param) => col.name === param.value),
          );

          return paramColor?.hex as string;
        }

        if (colorRange.valType === 'number' && node.data) {
          const paramColor = node.data?.params?.find(
            (param) => param.tprm_id.toString() === colorRange.tprmId,
          );

          if (paramColor) {
            const foundColor = colorRange.ranges.colors.find((color: any, idx: number) => {
              if (idx === 0 && paramColor.value < colorRange.ranges.values[0]) {
                return color;
              }

              if (
                idx !== 0 &&
                idx !== colorRange.ranges.values.length &&
                paramColor.value >= colorRange.ranges.values[idx - 1] &&
                paramColor.value <= colorRange.ranges.values[idx]
              ) {
                return color;
              }

              if (
                idx === colorRange.ranges.values.length &&
                typeof paramColor.value === 'number' &&
                paramColor.value > colorRange.ranges.values.length - 1
              ) {
                return color;
              }

              return undefined;
            });

            return foundColor.hex as string;
          }
        }
      }
      return undefined;
    },
    [colorRangesData],
  );

  return { getRangeColor };
};
