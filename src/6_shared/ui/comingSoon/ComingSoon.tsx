import { Box, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export const ComingSoon = () => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SettingsIcon
          fontSize="large"
          sx={{
            animation: 'spin 2s linear infinite',
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography>Coming soon...</Typography>
      </Box>
    </Box>
  );
};
