import React, { useMemo } from 'react';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import { IKanbanTask, ITaskPriotityColors } from '6_shared';
import { getInitials } from './getInitials';

interface IProps {
  task: IKanbanTask;
  tasksPriorityColors: ITaskPriotityColors | null;
  usersData: UserRepresentation[] | undefined;
}

export const useKanbanBoardTaskCard = ({ task, tasksPriorityColors, usersData }: IProps) => {
  const { priorityIcon, priorityText } = useMemo(() => {
    const defaultPriority = {
      priorityText: 'Medium priority',
      priorityIcon: <DragHandleIcon color="warning" fontSize="small" />,
    };

    if (!tasksPriorityColors) return defaultPriority;

    const priority = {
      'Highest priority': {
        name: 'Highest priority',
        color: tasksPriorityColors[task.id]?.color || 'red',
        icon: <KeyboardDoubleArrowUpIcon color="error" fontSize="small" />,
      },
      'High priority': {
        name: 'High priority',
        color: tasksPriorityColors[task.id]?.color || 'red',
        icon: <KeyboardArrowUpIcon color="error" fontSize="small" />,
      },
      'Medium priority': {
        name: 'Medium priority',
        color: tasksPriorityColors[task.id]?.color || 'yellow',
        icon: <DragHandleIcon color="warning" fontSize="small" />,
      },
      'Low priority': {
        name: 'Low priority',
        color: tasksPriorityColors[task.id]?.color || 'blue',
        icon: <KeyboardArrowDownIcon color="primary" fontSize="small" />,
      },
      'Lowest priority': {
        name: 'Lowest priority',
        color: tasksPriorityColors[task.id]?.color || 'blue',
        icon: <KeyboardDoubleArrowDownIcon color="primary" fontSize="small" />,
      },
    };

    const taskColor = tasksPriorityColors[task.id];
    if (!taskColor) return defaultPriority;

    const IconComponent = Object.values(priority).find((p) => p.name === taskColor.name)?.icon;

    return IconComponent
      ? {
          priorityText: taskColor.name,
          priorityIcon: React.cloneElement(IconComponent, { style: { color: taskColor.color } }),
        }
      : defaultPriority;
  }, [task.id, tasksPriorityColors]);

  const cardTitle = useMemo(() => {
    return task.label && task.label.trim() !== '' ? task.label : task.name;
  }, [task.label, task.name]);

  const { userAvatar, userName, taskUserName } = useMemo(() => {
    if (!usersData) return { userAvatar: null, userName: '', taskUserName: '' };

    // const taskUser = usersData.find((u) => Object.values(task).some((v) => v === u.username));
    const taskUser = usersData.find((u) => task.assignee === u.username);
    const avatarLink = taskUser?.attributes?.picture?.[0] ?? null;

    return {
      userAvatar: avatarLink,
      userName: taskUser?.username ? getInitials(taskUser.username) : '',
      taskUserName:
        !taskUser?.firstName || !taskUser?.lastName
          ? taskUser?.username || ''
          : `${taskUser?.firstName} ${taskUser?.lastName}`,
    };
  }, [task, usersData]);

  return {
    priorityIcon,
    priorityText,
    cardTitle,
    userAvatar,
    userName,
    taskUserName,
  };
};
