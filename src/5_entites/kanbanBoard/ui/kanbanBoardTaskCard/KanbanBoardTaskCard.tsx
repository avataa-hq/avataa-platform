import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IconButton, Typography, Box, Avatar, useTheme, alpha, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useKanbanBoardTaskCard } from '5_entites/kanbanBoard/lib';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import { IKanbanTask, IMenuPosition, ITaskPriotityColors } from '6_shared';
import * as SC from './KanbanBoardTaskCard.styled';
import { CardMiddleText } from './KanbanBoardTaskCard.styled';
import { KanbanIssueType } from '../kanbanIssueType/KanbanIssueType';

interface IProps {
  task: IKanbanTask;
  taskIndex: number;
  setHoveredIndex: (index: number | null) => void;
  isHovered: boolean;
  usersData: UserRepresentation[] | undefined;
  handleContextMenuPosition?: (value: IMenuPosition | null, taskItem: IKanbanTask) => void;
  tasksPriorityColors: ITaskPriotityColors | null;
  handleUserContextMenuPosition?: (
    value: IMenuPosition | null,
    taskItem: IKanbanTask,
    userName: string,
  ) => void;

  onTaskClick?: (task: IKanbanTask) => void;
  onTaskParentClick?: (parentId: number) => void;
}

export const KanbanBoardTaskCard = ({
  task,
  taskIndex,
  setHoveredIndex,
  isHovered,
  usersData,
  handleContextMenuPosition,
  tasksPriorityColors,
  handleUserContextMenuPosition,
  onTaskClick,
  onTaskParentClick,
}: IProps) => {
  const { palette } = useTheme();

  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id, taskIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'TASK',
    hover: (_, monitor) => {
      if (!monitor.isOver()) {
        setHoveredIndex(null);
        return;
      }
      setHoveredIndex(taskIndex);
    },
  });

  const { priorityIcon, priorityText, cardTitle, userAvatar, userName, taskUserName } =
    useKanbanBoardTaskCard({
      task,
      tasksPriorityColors,
      usersData,
    });

  const getColumnColor = (days: number) => {
    if (days <= 2) return palette.success.main;
    if (days <= 5) return palette.warning.main;
    return palette.error.main;
  };

  const handleContextMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleContextMenuPosition?.(
      {
        mouseX: event.clientX,
        mouseY: event.clientY,
      },
      task,
    );
  };

  const handleUserContextMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleUserContextMenuPosition?.(
      {
        mouseX: event.clientX,
        mouseY: event.clientY,
      },
      task,
      taskUserName,
    );
  };

  return (
    <>
      {isHovered && <SC.InsertLine />}
      <SC.KanbanBoardTaskCardStyled
        onClick={() => onTaskClick?.(task)}
        ref={(node: HTMLElement) => dragRef(dropRef(node))}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          clipPath: 'inset(0 round 10px)',
          transition: 'box-shadow 0.2s ease, background 0.2s ease',
          boxShadow: isDragging ? `0px 4px 12px ${alpha(palette.common.black, 0.15)}` : 'none',
          backgroundColor: isHovered ? `${alpha(palette.primary.main, 0.1)}` : 'inherit',
        }}
      >
        {/* <SC.CardTopContent>
          {/* <Tooltip title={cardTitle} placement="bottom">
            <SC.CardTaskName>{cardTitle}</SC.CardTaskName>
          </Tooltip> */}
        {/* <IconButton onClick={handleContextMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </SC.CardTopContent>  */}

        <SC.CardMiddleContent>
          <SC.CardMiddleLeftContent>
            <Tooltip title={task.summary} placement="bottom">
              <CardMiddleText>{task?.summary}</CardMiddleText>
            </Tooltip>
            {task.parent_name && (
              <Tooltip title={task.parent_name} placement="bottom">
                <SC.CardParentNameWrapper
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskParentClick?.(task.p_id);
                  }}
                >
                  <SC.CardTaskParentName variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {task.parent_name}
                  </SC.CardTaskParentName>
                </SC.CardParentNameWrapper>
              </Tooltip>
            )}
          </SC.CardMiddleLeftContent>

          <SC.CardMiddleRightContent>
            <IconButton onClick={handleContextMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </SC.CardMiddleRightContent>
        </SC.CardMiddleContent>

        <SC.CardBottomContent
          sx={{ justifyContent: !task.label && !task.issueTypeId ? 'flex-end' : 'space-between' }}
        >
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <KanbanIssueType task={task} />

            <Tooltip title={cardTitle} placement="bottom">
              <SC.CardTaskName>{cardTitle}</SC.CardTaskName>
            </Tooltip>

            {/* {!!task.label && (
              <Tooltip title={task.name} placement="bottom">
                <Typography>{task.name}</Typography>
              </Tooltip>
            )} */}
          </Box>

          <SC.CardInfoContent>
            <Tooltip
              title={`${task.daysInColumn} ${
                task.daysInColumn === 1 ? 'day' : 'days'
              } in this column`}
              placement="bottom"
            >
              <Box component="div" sx={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: Math.min(task.daysInColumn, 4) }, (_, index) => (
                  <SC.CardDaysInColumn
                    key={index}
                    sx={{ backgroundColor: getColumnColor(task.daysInColumn) }}
                  />
                ))}
              </Box>
            </Tooltip>

            <Tooltip title={priorityText} placement="bottom">
              <Box
                component="div"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {priorityIcon}
              </Box>
            </Tooltip>

            <Tooltip
              title={taskUserName ? `Assignee: ${taskUserName}` : 'Unassigned'}
              placement="bottom"
            >
              <SC.CardUserWrapper onClick={handleUserContextMenuOpen}>
                {userName && !userAvatar && <Typography variant="subtitle1">{userName}</Typography>}
                {userAvatar && (
                  <Avatar alt={userName} src={userAvatar} sx={{ width: '30px', height: '30px' }} />
                )}
              </SC.CardUserWrapper>
            </Tooltip>
          </SC.CardInfoContent>
        </SC.CardBottomContent>
      </SC.KanbanBoardTaskCardStyled>
    </>
  );
};
