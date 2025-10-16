import { alpha, useTheme } from '@mui/material';
import { ITickMark } from '../types';
import { percentToAngle, percentToAngleCircle } from '../lib/percentToAngle';
import { ARC_CENTER, ARC_RADIUS } from '../config';
import { polarToCartesian } from '../lib/describeArc';
import { getCroppedTextByLength } from '../lib/getCroppedTextByLength';

interface IProps {
  ticks?: ITickMark[];
  type?: 'circle' | 'arc';
}

export const TickMarks = ({ ticks, type = 'circle' }: IProps) => {
  const { palette } = useTheme();

  return ticks?.map(({ value, color, width = 2, length = 9, offset = 3, label }, index) => {
    if (!value) return null;
    // Выбираем функцию вычисления угла в зависимости от типа
    const angle = type === 'circle' ? percentToAngleCircle(value) : percentToAngle(value);

    const baseRadius = ARC_RADIUS + offset;

    const outer = polarToCartesian(ARC_CENTER, ARC_CENTER, baseRadius, angle);
    const inner = polarToCartesian(ARC_CENTER, ARC_CENTER, baseRadius - length, angle);

    const croppedText = getCroppedTextByLength(label ?? '', 10);

    return (
      <g key={index}>
        <line
          x1={outer.x}
          y1={outer.y}
          x2={inner.x}
          y2={inner.y}
          stroke={color ?? alpha(palette.primary.main, 0.8)}
          strokeWidth={width}
          strokeLinecap="round"
        />
        {label && (
          <text
            x={inner.x}
            y={inner.y + length / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="4"
            fontFamily="Monospace"
            fill={alpha(palette.text.primary, 0.5)}
            // Чтобы текст не был наклонен "вверх ногами", вращаем по-другому для circle
            transform={
              type === 'circle'
                ? `rotate(${angle - 90}, ${inner.x}, ${inner.y})`
                : `rotate(${angle}, ${inner.x}, ${inner.y})`
            }
          >
            {croppedText}
          </text>
        )}
      </g>
    );
  });
};
