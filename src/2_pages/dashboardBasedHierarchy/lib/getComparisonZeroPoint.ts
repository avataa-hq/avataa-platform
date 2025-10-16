import { IRangeModel } from '6_shared';

export const getComparisonZeroPoint = (ranges?: IRangeModel) => {
  if (!ranges || !ranges.comparisonZeroPoint) return 0;
  const { active, value } = ranges.comparisonZeroPoint;
  if (value == null || !active) return +ranges.values[ranges.values.length - 1];
  return +value;
};
