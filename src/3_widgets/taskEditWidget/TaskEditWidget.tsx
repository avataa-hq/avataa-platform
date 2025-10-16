import { useParams } from 'react-router-dom';
import { TaskEdit } from '4_features';
import { Attributes, History, StreamComments, useKanbanBoardUserData } from '5_entites';
import { ActionTypes, Box, useAppNavigate, useConfig } from '6_shared';
import { useCallback, useMemo, useState } from 'react';
import { IconButton, Stack } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { enqueueSnackbar } from 'notistack';
import { FileViewerWidget } from '../inventory';
import { UserRepresentation } from '../../6_shared/api/keycloak/users/types';
import { MainModuleListE } from '../../config/mainModulesConfig';

interface IProps {
  permissions?: Record<ActionTypes, boolean>;
}

export const TaskEditWidget = ({ permissions }: IProps) => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useAppNavigate();

  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const [isLoadingCopy, setIsLoadingCopy] = useState(false);

  const { usersData } = useKanbanBoardUserData();

  const usersById = useMemo(() => {
    if (!usersData) return {};
    return usersData.reduce((acc, item) => {
      const key = `${item.firstName} ${item.lastName}`.trim().toLowerCase();
      acc[key ?? ''] = item;
      return acc;
    }, {} as Record<string, UserRepresentation>);
  }, [usersData]);

  const onShareClick = useCallback(async () => {
    setIsLoadingCopy(true);
    try {
      const urlToCopy = window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      enqueueSnackbar('The link is copied', { variant: 'success', autoHideDuration: 500 });
    } catch (err) {
      console.error('Ошибка:', err);
      enqueueSnackbar('Failed to copy the link', { variant: 'error' });
    } finally {
      setIsLoadingCopy(false);
    }
  }, []);

  const onBackClick = useCallback(() => {
    navigate(MainModuleListE.processManager);
  }, [navigate]);

  return (
    <Box style={{ width: '100%', height: '100%', padding: '20px' }}>
      {taskId && (
        <Stack gap={2}>
          <Stack justifyContent="space-between" direction="row">
            <IconButton disabled={isLoadingCopy} onClick={onBackClick}>
              <ArrowBack />
            </IconButton>
            <IconButton color="primary" disabled={isLoadingCopy} onClick={onShareClick}>
              <ShareIcon color="primary" />
            </IconButton>
          </Stack>

          <TaskEdit
            objectId={+taskId}
            permissions={permissions}
            rightSlot={<Attributes objectId={+taskId} permissions={permissions} />}
            footerSlots={{
              attachmentComponent: (
                <FileViewerWidget objectId={+taskId} permissions={permissions} isKanban />
              ),
              commentsComponent: (
                <StreamComments
                  objectId={+taskId}
                  usersData={usersById}
                  permissions={permissions}
                />
              ),
              historyComponent: (
                <History
                  objectId={+taskId}
                  disableTimezoneAdjustment={disableTimezoneAdjustment}
                  disabledHeader
                  disabledOverflow
                  enableHiddenResponseSettings
                />
              ),
            }}
          />
        </Stack>
      )}
    </Box>
  );
};
