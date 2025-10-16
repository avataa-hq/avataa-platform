import { useTranslate } from '6_shared/localization';
import { AddRounded } from '@mui/icons-material';
import { alpha, Box, BoxProps, Typography } from '@mui/material';

export const DragHereBox = ({ component, children, sx, ...props }: BoxProps) => {
  const translate = useTranslate();
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ pointerEvents: 'none', ...sx }}
      {...props}
    >
      <Box
        component="div"
        borderRadius="50%"
        width="27px"
        height="27px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <AddRounded color="primary" />
      </Box>
      <Typography sx={{ opacity: 0.3 }}>{translate('Drag here')}</Typography>
    </Box>
  );
};
