import { useTranslate } from '6_shared';
import { UploadFileRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export const DropFileBox = () => {
  const translate = useTranslate();
  return (
    <Box
      component="div"
      position="absolute"
      sx={{
        backgroundColor: 'white',
        zIndex: 2,
      }}
      left="0"
      right="0"
      bottom="0"
      top="0"
      p="20px"
    >
      <Box
        component="div"
        borderRadius="20px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        sx={{
          border: (theme) => `2px dashed ${theme.palette.primary.main}`,
        }}
      >
        <UploadFileRounded sx={{ fontSize: 64 }} />
        <Typography fontSize={24}>{translate('Drop here')}</Typography>
      </Box>
    </Box>
  );
};
