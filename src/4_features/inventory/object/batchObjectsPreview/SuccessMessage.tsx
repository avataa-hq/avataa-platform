import { useTranslate } from '6_shared';
import { Typography, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconContainer, MessageContainer } from './BatchObjectsPreview.styled';

export const SuccessMessage = () => {
  const theme = useTheme();
  const translate = useTranslate();

  return (
    <MessageContainer sx={{ border: `1px ${theme.palette.success.main} solid` }}>
      <IconContainer>
        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
      </IconContainer>
      <Typography sx={{ fontSize: '20px' }}>
        {translate('The uploaded file is valid. No errors were found.')}
        <br />
        {translate("Please click 'Confirm' to send data.")}
      </Typography>
    </MessageContainer>
  );
};
