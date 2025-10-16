import { alpha, useTheme } from '@mui/material';

interface IProps {
  width: number;
  leftOffset: number;
}

export const TodayLine = ({ leftOffset, width }: IProps) => {
  const { palette } = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: leftOffset,
        border: `${width}px dashed ${alpha(palette.primary.main, 0.5)}`,
        height: '-webkit-fill-available',
      }}
    />
  );
};
