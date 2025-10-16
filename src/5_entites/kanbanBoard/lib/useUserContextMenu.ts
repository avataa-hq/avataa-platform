import { useState } from 'react';
import { useOwnerAssign } from '4_features';
import { IKanbanTask, IMenuPosition } from '6_shared';

export const useUserContextMenu = () => {
  const [userContextMenuPosition, setUserContextMenuPosition] = useState<IMenuPosition | null>(
    null,
  );
  const [kanbanTaskItem, setKanbanTaskItem] = useState<IKanbanTask | null>(null);
  const [kanbanTaskUserName, setKanbanTaskUserName] = useState<string | null>(null);

  const { ownerAssign } = useOwnerAssign({
    tmoId: kanbanTaskItem?.tmo_id ? Number(kanbanTaskItem?.tmo_id) : undefined,
    pmSelectedRows: kanbanTaskItem ? [kanbanTaskItem] : undefined,
    createParamIfNotExist: true,
  });

  const handleUserContextMenuPosition = (
    position: IMenuPosition | null,
    taskItem: IKanbanTask,
    userName: string,
  ) => {
    setUserContextMenuPosition(position);
    setKanbanTaskItem(taskItem);
    setKanbanTaskUserName(userName);
  };

  const onUserConextMenuItemClick = async (username: string) => {
    if (kanbanTaskItem && Object.values(kanbanTaskItem).includes(username)) {
      setUserContextMenuPosition(null);
      return;
    }
    await ownerAssign(username);

    setUserContextMenuPosition(null);
    setKanbanTaskItem(null);
  };

  return {
    userContextMenuPosition,
    setUserContextMenuPosition,
    handleUserContextMenuPosition,
    onUserConextMenuItemClick,
    kanbanTaskUserName,
  };
};
