import { useTheme } from '@mui/material';
import { Box, GANT_HEADER_SCALE_HEIGHT } from '6_shared';

interface IProps {
  todayPosition: number;
}

export const TodayLine = ({ todayPosition }: IProps) => {
  const { palette } = useTheme();

  return (
    <Box
      component="div"
      sx={{
        position: 'absolute',
        top: GANT_HEADER_SCALE_HEIGHT - 8,
        left: todayPosition - 8,
        width: 20,
        height: 20,
        background: palette.background.default,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="div"
        sx={{
          width: 12,
          height: 12,
          background: palette.primary.main,
          borderRadius: '50%',
        }}
      />
    </Box>
  );
};
