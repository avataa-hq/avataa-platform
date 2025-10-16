import { IRangeModel } from '6_shared';

export const getColorByValue = (value: number, ranges?: IRangeModel) => {
  const defaultColor = 'rgb(91, 95, 109)';
  if (!ranges || !ranges.colors?.length || !ranges.values?.length) return defaultColor;
  const { colors: rangesColors, values } = ranges;

  let countIdx = 0;

  if (value <= values[0]) countIdx = 0;

  if (value >= values[values.length - 1]) countIdx = values.length;

  for (let i = 0; i < values.length - 1; i++) {
    if (value >= values[i] && value < values[i + 1]) {
      countIdx = i + 1;
    }
  }
  const neededColor = rangesColors?.[countIdx]?.hex;
  if (!neededColor) return defaultColor;
  return neededColor;
};
