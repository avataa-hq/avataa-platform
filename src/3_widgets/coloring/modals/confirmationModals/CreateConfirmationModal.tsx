import { Typography, Button } from '@mui/material';
import { Modal, getPropertyLabel, useTranslate } from '6_shared';

interface IProps {
  isPrivateColor: boolean;
  tprmName: string | undefined;
  labels?: {
    [key: string]: string;
  };
  onCreateColorSet?: () => Promise<void> | void;
  isOpen?: boolean;
  setIsOpen?: (value: React.SetStateAction<boolean>) => void;
  disablePortal: boolean;
}

export const CreateConfirmationModal = ({
  isPrivateColor,
  tprmName,
  labels,
  onCreateColorSet,
  isOpen,
  setIsOpen,
  disablePortal,
}: IProps) => {
  const translate = useTranslate();

  return (
    <Modal
      open={isOpen ?? false}
      onClose={() => {}}
      minWidth="30%"
      disablePortal={disablePortal}
      actions={
        <>
          <Button variant="outlined" onClick={() => setIsOpen?.(false)}>
            {translate('No')}
          </Button>
          <Button variant="contained" onClick={onCreateColorSet}>
            {translate('Yes')}
          </Button>
        </>
      }
    >
      <Typography textAlign="center" fontSize="18px">{`${translate(
        'Do you really want to set this palette as',
      )} ${
        isPrivateColor
          ? `${translate('your new default setting')}`
          : `${translate('new default setting for everyone')}`
      } ${translate('for the')} ${getPropertyLabel({
        key: tprmName,
        labels,
      })} ${translate('parameter')}?`}</Typography>
    </Modal>
  );
};
