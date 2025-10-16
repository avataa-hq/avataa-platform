import { useState } from 'react';
import { Button, MenuItem, Popover } from '@mui/material';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import { AddRounded } from '@mui/icons-material';
import { useTranslate, useWorkflows } from '6_shared';
import { useSaveWarningModal } from '../../lib';

export const AddDiagramButton = () => {
  const translate = useTranslate();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const {
    isDiagramChanged,
    setIsCreateModalActive,
    setIsUploadModalActive,
    setIsDiagramChanged,
    setSaveWarningModalState,
  } = useWorkflows();

  const saveWarningModal = useSaveWarningModal();

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button variant="contained.icon" onClick={openPopover}>
        <AddRounded />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            closePopover();
            setIsUploadModalActive(true);
          }}
        >
          <UploadFileRoundedIcon sx={{ mr: '5px' }} />
          {translate('Upload')}
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (isDiagramChanged) {
              try {
                await saveWarningModal();
                setIsDiagramChanged(false);
                setSaveWarningModalState({ isOpen: false });

                setIsCreateModalActive(true);
                closePopover();
              } catch (error) {
                setSaveWarningModalState({ isOpen: false });
                closePopover();
              }
            } else {
              setIsCreateModalActive(true);
              closePopover();
            }
          }}
        >
          <NoteAddRoundedIcon sx={{ mr: '5px' }} />
          {translate('Create New')}
        </MenuItem>
      </Popover>
    </>
  );
};
