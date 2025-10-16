import { Typography, Button } from '@mui/material';
import { Modal, getPropertyLabel, useTranslate } from '6_shared';
import { useGetModalMessage } from '3_widgets/coloring/helper/useGetModalMessage';

interface IProps {
  isPrivateColor?: boolean;
  isDefaultColor?: boolean;
  wasPublicColor?: boolean;
  wasDefaultColor?: boolean;
  tprmName?: string;
  labels?: {
    [key: string]: string;
  };
  onUpdateColorSet?: () => Promise<void> | void;
  isOpen?: boolean;
  setIsOpen?: (value: React.SetStateAction<boolean>) => void;
  disablePortal: boolean;
}

export const UpdateConfirmationModal = ({
  isPrivateColor,
  isDefaultColor,
  wasPublicColor,
  wasDefaultColor,
  tprmName,
  labels,
  onUpdateColorSet,
  isOpen,
  setIsOpen,
  disablePortal,
}: IProps) => {
  const translate = useTranslate();

  return (
    <Modal
      open={isOpen ?? false}
      onClose={() => setIsOpen?.(false)}
      minWidth="30%"
      disablePortal={disablePortal}
      actions={
        <>
          <Button variant="outlined" onClick={() => setIsOpen?.(false)}>
            {translate('No')}
          </Button>
          <Button variant="contained" onClick={() => onUpdateColorSet?.()}>
            {translate('Yes')}
          </Button>
        </>
      }
    >
      <Typography textAlign="center" fontSize="18px">{`${translate(
        'Do you really want',
      )} ${useGetModalMessage({
        isPrivateColor,
        isDefaultColor,
        wasPublicColor,
        wasDefaultColor,
      })} ${translate('for the')} ${getPropertyLabel({
        key: tprmName,
        labels,
      })} ${translate('parameter')}?`}</Typography>
    </Modal>
  );
};
