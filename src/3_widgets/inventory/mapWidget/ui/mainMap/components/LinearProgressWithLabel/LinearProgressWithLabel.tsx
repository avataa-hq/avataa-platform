import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

export const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  const { value } = props;
  return (
    <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box component="div" sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box component="div" sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};
