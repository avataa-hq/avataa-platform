import { PropsWithChildren } from 'react';
import { ActionTypes, Box, DraggableDialog, useTranslate } from '6_shared';
import { Button, Typography } from '@mui/material';
import { NOT_VALID_TEMPLATE_FORM_ID } from '../../model';

interface IProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const ObjectTemplatesNotValidModal = ({
  isOpen,
  onClose,
  children,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  return (
    <DraggableDialog
      open={isOpen}
      onClose={onClose}
      width={600}
      height={400}
      title={
        <Box
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 2 }}
        >
          <Typography>{translate('Templates')}</Typography>
        </Box>
      }
      draggable={false}
      actions={
        <>
          <Button disabled={permissions?.update !== true} variant="outlined" onClick={onClose}>
            {translate('Cancel')}
          </Button>
          <Button
            disabled={permissions?.update !== true}
            type="submit"
            form={NOT_VALID_TEMPLATE_FORM_ID}
            variant="contained"
          >
            {translate('Save')}
          </Button>
        </>
      }
    >
      {children}
    </DraggableDialog>
  );
};
