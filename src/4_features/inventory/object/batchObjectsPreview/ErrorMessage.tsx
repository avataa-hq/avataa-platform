import { useTranslate } from '6_shared';
import { Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { IconContainer, MessageContainer } from './BatchObjectsPreview.styled';

export const ErrorMessage = () => {
  const theme = useTheme();
  const translate = useTranslate();

  return (
    <MessageContainer sx={{ border: `1px ${theme.palette.error.main} solid` }}>
      <IconContainer>
        <WarningIcon color="error" sx={{ fontSize: 60 }} />
      </IconContainer>
      <Typography sx={{ fontSize: '20px', lineHeight: '30px' }}>
        {translate('File contains errors.')}
        <span> </span>
        {translate('Please check the preview file for more information.')}
        <br />
        {translate(
          'You can still upload the file, but only valid object parameters will be taken into account during the import process.',
        )}
      </Typography>
    </MessageContainer>
  );
};
