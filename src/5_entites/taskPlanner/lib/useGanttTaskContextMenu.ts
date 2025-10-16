import React, { useState } from 'react';
import { IContextMenuPosition, IGanttTask } from '6_shared';

interface IProps {
  tasks?: IGanttTask[];
  setTasks?: (tasks: IGanttTask[]) => void;
}

export const useGanttTaskContextMenu = ({ tasks, setTasks }: IProps) => {
  const [contextMenuPosition, setContextMenuPosition] = useState<IContextMenuPosition | null>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const taskId = event.currentTarget.id;
    setContextMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
      taskId,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  const handleContextMenuItemClick = (menuType: string, taskId: string) => {
    switch (menuType) {
      case 'delete':
        if (!tasks) return;
        setTasks?.(tasks.filter((task) => task.id !== taskId));
        break;
      default:
        break;
    }
  };

  return {
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    handleContextMenuItemClick,
  };
};
