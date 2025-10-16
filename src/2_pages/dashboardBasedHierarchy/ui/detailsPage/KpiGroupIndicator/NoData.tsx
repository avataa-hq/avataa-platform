import { Typography } from '@mui/material';
import { CenteredIndicatorContainer } from './KpiGroupIndicator.styled';

export const NoData = () => {
  return (
    <CenteredIndicatorContainer>
      <Typography>No information on the current level</Typography>
    </CenteredIndicatorContainer>
  );
};
