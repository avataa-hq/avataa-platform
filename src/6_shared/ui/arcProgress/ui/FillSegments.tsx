import { describeArc, describeCircle } from '../lib/describeArc';
import { ARC_CENTER, ARC_RADIUS, ARC_STROKE_WIDTH } from '../config';
import { percentToAngle, percentToAngleCircle } from '../lib/percentToAngle';
import { IFillSegment } from '../types';

interface IProps {
  fillSegments?: IFillSegment[];
  arcWidth?: number;
  backgroundColor?: string;
  type?: 'circle' | 'arc';
}

export const FillSegments = ({
  fillSegments,
  arcWidth,
  backgroundColor,
  type = 'circle',
}: IProps) => {
  const sWidth = arcWidth ? arcWidth - 1 : ARC_STROKE_WIDTH - 1;

  return fillSegments?.map(({ from, to, color, strokeWidth }, i) => {
    const correctedFrom = Math.min(from, to);
    const correctedTo = Math.max(from, to);
    const angleStart =
      type === 'circle' ? percentToAngleCircle(correctedFrom) : percentToAngle(correctedFrom);

    const angleEnd =
      type === 'circle' ? percentToAngleCircle(correctedTo) : percentToAngle(correctedTo);

    const path =
      type === 'circle' && Math.abs(correctedTo - correctedFrom) >= 100
        ? describeCircle(ARC_CENTER, ARC_CENTER, ARC_RADIUS)
        : describeArc(ARC_CENTER, ARC_CENTER, ARC_RADIUS, angleStart, angleEnd);

    return (
      <path
        key={i}
        d={path}
        fill="none"
        stroke={backgroundColor ?? color}
        strokeWidth={strokeWidth ?? sWidth}
        strokeLinecap="round"
      />
    );
  });
};
