import React, { useCallback } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IKanbanTask, IMenuPosition } from '6_shared';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import ShareIcon from '@mui/icons-material/Share';
import { KanbanIssueType } from '../kanbanIssueType/KanbanIssueType';

interface IProps {
  handleContextMenuPosition?: (value: IMenuPosition | null, taskItem: IKanbanTask) => void;
  task?: IKanbanTask | null;
}

export const KanbanEditModalTitle = ({ handleContextMenuPosition, task }: IProps) => {
  const navigate = useNavigate();

  const handleContextMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!task) return;
    handleContextMenuPosition?.(
      {
        mouseX: event.clientX,
        mouseY: event.clientY,
      },
      task,
    );
  };

  const onShareClick = useCallback(async () => {
    try {
      const urlToCopy = window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      enqueueSnackbar('The link is copied', { variant: 'success', autoHideDuration: 500 });
    } catch (err) {
      console.error('Ошибка:', err);
      enqueueSnackbar('Failed to copy the link', { variant: 'error' });
    }
  }, []);

  const onOpenTaskClick = () => {
    if (!task) return;
    navigate(`${task.id}`);
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.625rem',
        position: 'absolute',
        top: '0.5rem',
        width: '-webkit-fill-available',
        marginRight: '3.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <KanbanIssueType task={task} />
        <Typography sx={{ opacity: 0.9 }} variant="body2">
          {task?.name}
        </Typography>
      </div>
      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <IconButton color="primary" onClick={onShareClick}>
          <ShareIcon color="primary" />
        </IconButton>

        <IconButton onClick={onOpenTaskClick} size="small">
          <OpenInNewIcon />
        </IconButton>

        <IconButton onClick={handleContextMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
      </div>
    </Box>
  );
};
