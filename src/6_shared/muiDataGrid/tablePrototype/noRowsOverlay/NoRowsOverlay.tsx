import SadRobot from 'assets/img/sad_robot.svg?react';
import { useTheme } from '@mui/material';
import { Label, StyledGridOverlay } from './NoRowsOverlay.styled';

export const NoRowsOverlay = () => {
  const theme = useTheme();
  return (
    <StyledGridOverlay>
      <SadRobot fill={theme.palette.primary.light} stroke={theme.palette.primary.light} />
      <Label>No data available</Label>
    </StyledGridOverlay>
  );
};
