import { CircularProgress, Typography, useTheme } from '@mui/material';
import { WarningRounded } from '@mui/icons-material';

import { Modal, useTranslate, ActionTypes } from '6_shared';

import * as SC from './ConfirmDeleteProcessesModal.styled';

interface IProps {
  open: boolean;
  handleModalClose: () => void;
  handleDeleteClick: () => void;
  processesCountWithoutEndDate: number;
  groupsCount: number;
  isFetchingProcesses: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const ConfirmDeleteProcessesModal = ({
  open,
  handleModalClose,
  handleDeleteClick,
  processesCountWithoutEndDate,
  groupsCount,
  isFetchingProcesses,
  permissions,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  return (
    <Modal open={open} onClose={handleModalClose} width={350}>
      <SC.ModalHeader>
        <WarningRounded sx={{ fill: theme.palette.warning.main, width: '35px', height: '35px' }} />
        <SC.ModalTitle>
          {isFetchingProcesses
            ? `${translate('Collecting processes and groups')}. ${translate('Please wait')}...`
            : translate('Are you sure you want to close all processes?')}
        </SC.ModalTitle>
        {isFetchingProcesses && <CircularProgress />}
        {!isFetchingProcesses && (
          <>
            <Typography variant="body1">
              {translate('Processes to close')}: {processesCountWithoutEndDate}
            </Typography>
            <Typography variant="body1">
              {translate('Groups to delete')}: {groupsCount}
            </Typography>
          </>
        )}
      </SC.ModalHeader>

      <SC.ModalBody>
        <SC.ModalButton variant="outlined" onClick={handleModalClose}>
          {translate('Cancel')}
        </SC.ModalButton>
        <SC.ModalButton
          variant="contained"
          onClick={handleDeleteClick}
          disabled={
            isFetchingProcesses ||
            processesCountWithoutEndDate === 0 ||
            !(permissions?.administrate ?? true)
          }
        >
          {translate('Close')}
        </SC.ModalButton>
      </SC.ModalBody>
    </Modal>
  );
};
