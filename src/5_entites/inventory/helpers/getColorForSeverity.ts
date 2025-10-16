import type { Color, IColorRangeModel } from '6_shared';

export const getColorForSeverity = (
  severityCount: number,
  colorRanges?: IColorRangeModel | null,
) => {
  let severityColor = '#696969' as unknown as Color;
  if (!colorRanges) return '#696969';

  const {
    ranges: { values, colors },
  } = colorRanges;

  if (severityCount < values[0]) {
    [severityColor] = colors;
  } else if (severityCount >= values[values.length - 1]) {
    severityColor = colors[values.length];
  } else {
    values.forEach((value: number, i: number) => {
      if (severityCount >= value && value < values[i + 1]) {
        severityColor = colors[i + 1];
      }
    });
  }

  return severityColor.hex;
};
