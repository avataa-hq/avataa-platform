import { Skeleton } from '@mui/material';
import { InformationStyled } from './Information.styled';

export const InformationSkeleton = () => {
  return (
    <InformationStyled>
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
      <Skeleton width="100%" animation="wave" sx={{ padding: '1% 0' }} />
    </InformationStyled>
  );
};
