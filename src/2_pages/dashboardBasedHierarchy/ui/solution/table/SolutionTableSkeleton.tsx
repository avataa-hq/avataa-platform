import { Box } from '6_shared';
import { Skeleton } from '@mui/material';

export const SolutionTableSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} width="95%" height="15%" />
      ))}
    </Box>
  );
};
