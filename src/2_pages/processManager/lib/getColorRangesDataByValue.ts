import { IRangeModel } from '../../../6_shared';

export const getColorRangesDataByValue = (value: number, ranges?: IRangeModel) => {
  if (!ranges || !ranges.colors?.length || !ranges.values?.length) return null;
  const { colors: rangesColors, values } = ranges;

  let countIdx = 0;

  if (value <= values[0]) countIdx = 0;

  if (value >= values[values.length - 1]) countIdx = values.length;

  for (let i = 0; i < values.length - 1; i++) {
    if (value >= values[i] && value < values[i + 1]) {
      countIdx = i + 1;
    }
  }
  const neededColor = rangesColors?.[countIdx];
  if (!neededColor) return null;
  return neededColor;
};
