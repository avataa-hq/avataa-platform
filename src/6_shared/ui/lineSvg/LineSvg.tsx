import { useTheme } from '@emotion/react';
import { LineType } from '6_shared/api';
import { lineTypeDefinitions } from './lib/lineTypeDefinitions';

interface IProps {
  lineType: LineType;
  color?: string;
}

export const LineSvg = ({ lineType, color }: IProps) => {
  const theme = useTheme();

  const { pathString, dasharray } = lineTypeDefinitions[lineType || 'solid'];

  return (
    <svg style={{ width: '100%', height: '10px' }}>
      <path
        d={pathString}
        strokeDasharray={dasharray}
        stroke={lineType === 'blank' ? 'transparent' : color ?? theme.palette.primary.main}
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};
