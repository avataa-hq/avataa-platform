import { useTheme } from '@mui/material';
import { IArcProgressIcon } from '../types';

interface IProps extends IArcProgressIcon {
  x?: number;
  y?: number;
  size?: number;
}

export const InsideIcon = ({ color, type, x, y, size }: IProps) => {
  const shapeX = x ?? 50;
  const shapeY = y ?? 70;
  const shapeSize = size ?? 4;

  const { palette } = useTheme();

  if (!type) return null;

  if (type === 'stable') {
    return <circle cx={shapeX} cy={shapeY} r={shapeSize} fill={color ?? palette.warning.main} />;
  }

  if (type === 'up') {
    return (
      <polygon
        points={`${shapeX},${shapeY - shapeSize} ${shapeX - shapeSize},${shapeY + shapeSize} ${
          shapeX + shapeSize
        },${shapeY + shapeSize}`}
        fill={color ?? palette.success.main}
        strokeLinecap="round"
      />
    );
  }

  if (type === 'down') {
    return (
      <polygon
        points={`${shapeX},${shapeY + shapeSize} ${shapeX - shapeSize},${shapeY - shapeSize} ${
          shapeX + shapeSize
        },${shapeY - shapeSize}`}
        fill={color ?? palette.error.main}
        strokeLinecap="round"
      />
    );
  }
  return null;
};
