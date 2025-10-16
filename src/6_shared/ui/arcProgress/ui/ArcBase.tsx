import { alpha, useTheme } from '@mui/material';
import { describeArc } from '../lib/describeArc';
import { ARC_CENTER, ARC_FULL_END, ARC_FULL_START, ARC_RADIUS, ARC_STROKE_WIDTH } from '../config';

interface IProps {
  backgroundColor?: string;
  width?: number;

  type?: 'circle' | 'arc';
}

export const ArcBase = ({ backgroundColor, width, type = 'circle' }: IProps) => {
  const { palette } = useTheme();

  const arcBackgroundColor = alpha(palette.secondary.main, 0.1);
  // const arcBackgroundColor = backgroundColor ?? alpha(palette.primary.main, 0.1);
  const arcWidth = width ?? ARC_STROKE_WIDTH;

  if (type === 'arc') {
    return (
      <path
        d={describeArc(ARC_CENTER, ARC_CENTER, ARC_RADIUS, ARC_FULL_START, ARC_FULL_END)}
        fill="none"
        stroke={arcBackgroundColor}
        strokeWidth={arcWidth}
        strokeLinecap="round"
      />
    );
  }

  return (
    <circle
      cx={ARC_CENTER}
      cy={ARC_CENTER}
      r={ARC_RADIUS}
      fill="none"
      stroke={arcBackgroundColor}
      strokeWidth={arcWidth}
    />
  );
};
