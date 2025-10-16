import { Box, useTranslate } from '6_shared';
import WarningIcon from '@mui/icons-material/Warning';
import { Typography, useTheme } from '@mui/material';

export const BigFileWarning = () => {
  const theme = useTheme();
  const translate = useTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        border: `1px ${theme.palette.error.main} solid`,
        borderRadius: '10px',
        padding: '10px',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <WarningIcon />
      </Box>
      <Typography>
        {translate('File is too big.')}
        <br />
        {translate(
          'To avoid browser crashes, only the first 250 rows of the downloaded file are displayed in the preview.',
        )}
      </Typography>
    </Box>
  );
};
