import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { alpha, useTheme } from '@mui/material';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import { IKanbanTask, IMenuPosition, ITaskPriotityColors } from '6_shared';
import { KanbanBoardTaskCard } from '../kanbanBoardTaskCard/KanbanBoardTaskCard';
import { ColumnBody, KanbanBoardColumnStyled } from './KanbanBoardColumn.styled';

interface IProps {
  status: string;
  statusTprmId: number;
  tasks: IKanbanTask[];
  onMoveTask: (taskId: string, statusTprmId: number, newStatus: string, newIndex: number) => void;
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

export const KanbanBoardColumn = ({
  status,
  statusTprmId,
  tasks,
  onMoveTask,
  usersData,
  handleContextMenuPosition,
  tasksPriorityColors,
  handleUserContextMenuPosition,
  onTaskClick,
  onTaskParentClick,
}: IProps) => {
  const { palette } = useTheme();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setHoveredIndex(null);
  }, [tasks]);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; index: number }) => {
      onMoveTask(item.id, statusTprmId, status, hoveredIndex ?? (tasks?.length || 0));
      setHoveredIndex(null);
    },
    hover: (_, monitor) => {
      if (!monitor.isOver()) {
        setHoveredIndex(null);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <KanbanBoardColumnStyled
      ref={dropRef}
      sx={{
        opacity: isOver ? 0.5 : 1,
        backgroundColor: isOver ? `${alpha(palette.primary.main, 0.2)}` : 'transparent',
        minHeight: tasks?.length === 0 ? '100vh' : 'auto',
        clipPath: 'inset(0 round 10px)',
      }}
    >
      <ColumnBody>
        {tasks?.map((task, taskIndex) => (
          <KanbanBoardTaskCard
            key={task.id}
            task={task}
            taskIndex={taskIndex}
            setHoveredIndex={(idx) => {
              if (isOver) {
                setHoveredIndex(idx);
              }
            }}
            isHovered={hoveredIndex === taskIndex && isOver}
            usersData={usersData}
            handleContextMenuPosition={handleContextMenuPosition}
            tasksPriorityColors={tasksPriorityColors}
            handleUserContextMenuPosition={handleUserContextMenuPosition}
            onTaskClick={onTaskClick}
            onTaskParentClick={onTaskParentClick}
          />
        ))}
      </ColumnBody>
    </KanbanBoardColumnStyled>
  );
};
