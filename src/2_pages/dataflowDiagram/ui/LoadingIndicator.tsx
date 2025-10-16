import { BoxProps, CircularProgress, circularProgressClasses } from '@mui/material';
import { Box, useDataflowDiagram } from '6_shared';

export const LoadingIndicator = (props: BoxProps) => {
  const { isLoading } = useDataflowDiagram();

  return (
    <Box {...props}>
      <CircularProgress
        sx={{
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
          ...(!isLoading && { display: 'none' }),
        }}
        size={30}
      />
    </Box>
  );
};
