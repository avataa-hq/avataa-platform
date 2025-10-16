import { alpha, useTheme } from '@mui/material';

interface IProps {
  text?: string;
  position?: 'center' | 'bottom';
}
export const ArcImageText = ({ text, position = 'center' }: IProps) => {
  const { palette } = useTheme();

  return (
    <>
      <rect
        x={position === 'center' ? '12' : '20'}
        y={position === 'center' ? '40' : '68'}
        width={position === 'center' ? '75' : '60'}
        height={position === 'center' ? '25' : '15'}
        rx="10"
        ry="10"
        fill={alpha(palette.primary.main, 1)}
        stroke="none"
      />
      <text
        x={50}
        y={position === 'center' ? '57' : '80'}
        textAnchor="middle"
        fontSize="12"
        fill={palette.primary.contrastText}
      >
        {text}
      </text>
    </>
  );
};
