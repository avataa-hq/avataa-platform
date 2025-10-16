import { Button, Divider, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Body, Header, ConfirmationModalStyled, Content, Footer } from './ConfirmationModal.styled';
import { useTranslate } from '../../localization';

interface IProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;

  message?: string;
  confirmText?: string;
  cancelText?: string;

  disabledCancelButton?: boolean;
  disabledConfirmButton?: boolean;
}
export const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  onCancel,
  onConfirm,

  cancelText,
  confirmText,
  message,

  disabledConfirmButton,
  disabledCancelButton,
}: IProps) => {
  const translate = useTranslate();

  return (
    <ConfirmationModalStyled open={!!isOpen} onClose={() => setIsOpen?.(false)}>
      <Content>
        <Header>
          <InfoIcon fontSize="large" color="warning" />
        </Header>
        <Body>
          <Typography variant="body1">{translate('Warning')}</Typography>
          <Typography variant="body1">{message ?? 'Are you sure?'}</Typography>
        </Body>
        <Divider />
        <Footer
          justifyContent={
            disabledCancelButton || disabledConfirmButton ? 'center' : 'space-between'
          }
        >
          {!disabledCancelButton && (
            <Button onClick={onCancel} size="small" color="error">
              {cancelText ?? 'Cancel'}
            </Button>
          )}
          {!disabledConfirmButton && (
            <Button onClick={onConfirm} size="small" variant="contained">
              <Typography>{confirmText ?? 'OK'}</Typography>
            </Button>
          )}
        </Footer>
      </Content>
    </ConfirmationModalStyled>
  );
};
