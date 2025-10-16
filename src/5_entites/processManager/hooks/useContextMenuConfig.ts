import { useMemo } from 'react';
import {
  ActionTypes,
  IProcessManagerContextMenuConfig,
  keycloakUsersApi,
  PmSelectedRow,
  ProcessManagerPageMode,
} from '6_shared';

const groupItemList = [
  'Create group',
  'Add to group',
  'Delete group',
  'Remove element(s) from group',
  'Create template',
  'Delete template',
];

interface IProps {
  selectedGroup: string | null;
  viewType: ProcessManagerPageMode;
  selectedRows?: PmSelectedRow[];

  hasSelectedRows?: boolean;
  isOpenMapActive?: boolean;
  isOpenDashboardActive?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const useContextMenuConfig = ({
  selectedGroup,
  viewType,
  selectedRows,
  hasSelectedRows,
  isOpenMapActive,
  isOpenDashboardActive,
  permissions,
}: IProps) => {
  const { useGetUsersQuery } = keycloakUsersApi;
  const canUpdate = permissions?.update ?? true;
  const canView = permissions?.view ?? true;
  const isUserTasks = viewType === 'tasks';
  const isKanbanBoard = viewType === 'grid';

  const hasActiveObject = selectedRows && selectedRows.some((item) => item.isActive === true);

  const hasGroup = selectedRows && selectedRows.some((item) => item.groupName);

  const { data: usersData } = useGetUsersQuery();
  const userNamesList = useMemo(() => {
    if (!usersData) return [];
    return usersData.flatMap((u) => (u.username ? u.username : []));
  }, [usersData]);

  const groupMenuList = useMemo(
    () =>
      !selectedGroup || !hasSelectedRows
        ? groupItemList.filter((i) => i !== 'Remove element(s) from group')
        : groupItemList,
    [selectedGroup, hasSelectedRows],
  );

  const processManagerContextMenuConfig: IProcessManagerContextMenuConfig[] = useMemo(() => {
    return [
      {
        type: 'item',
        label: 'Claim',
        action: 'claim',
        disabled: !canUpdate,
      },
      {
        type: 'submenu',
        label: 'Assign to',
        action: 'assignTo',
        disabled: !canUpdate,
        children: userNamesList,
      },
      {
        type: 'submenu',
        label: 'Group',
        action: 'group',
        disabled: !canView,
        children: groupMenuList,
      },
      {
        type: 'item',
        label: 'Open map',
        action: 'openMap',
        disabled: isOpenMapActive,
      },
      {
        type: 'item',
        label: 'Open dashboard',
        action: 'openDashboard',
        disabled: isOpenDashboardActive,
      },
      {
        type: 'item',
        label: 'Close alarm',
        action: 'closeAlarm',
        disabled: !canUpdate || !hasActiveObject,
      },
      {
        type: 'item',
        label: 'Show linked objects',
        action: 'showLinkedObjects',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Show related objects',
        action: 'showRelatedObjects',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Show history',
        action: 'showHistory',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Open task manager',
        action: 'openTaskManager',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Delete',
        action: 'delete',
        disabled: !canUpdate || hasGroup,
      },
    ];
  }, [
    canUpdate,
    canView,
    groupMenuList,
    hasActiveObject,
    hasGroup,
    isOpenDashboardActive,
    isOpenMapActive,
    userNamesList,
  ]);

  const kanbanContextMenuConfig: IProcessManagerContextMenuConfig[] = useMemo(() => {
    return [
      {
        type: 'item',
        label: 'Claim',
        action: 'claim',
        disabled: !canUpdate,
      },
      {
        type: 'submenu',
        label: 'Assign to',
        action: 'assignTo',
        disabled: !canUpdate,
        children: userNamesList,
      },
      {
        type: 'item',
        label: 'Open task manager',
        action: 'openTaskManager',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Delete',
        action: 'delete',
        disabled: !canUpdate || hasGroup,
      },
    ];
  }, [canUpdate, canView, hasGroup, userNamesList]);

  const userTasksContextMenuConfig: IProcessManagerContextMenuConfig[] = useMemo(() => {
    return [
      {
        type: 'item',
        label: 'Claim',
        action: 'claim',
        disabled: !canUpdate,
      },
      {
        type: 'submenu',
        label: 'Assign to',
        action: 'assignTo',
        disabled: !canUpdate,
        children: userNamesList,
      },
      {
        type: 'item',
        label: 'Open task manager',
        action: 'openTaskManager',
        disabled: !canView,
      },
      {
        type: 'item',
        label: 'Complete tasks',
        action: 'completeTask',
        disabled: !canUpdate || hasGroup,
      },
      {
        type: 'item',
        label: 'Unclaim',
        action: 'unclaim',
        disabled: !canUpdate || hasGroup,
      },
    ];
  }, [canUpdate, canView, hasGroup, userNamesList]);

  const contextMenuConfig = useMemo(() => {
    if (isKanbanBoard) return kanbanContextMenuConfig;
    if (isUserTasks) return userTasksContextMenuConfig;
    return processManagerContextMenuConfig;
  }, [
    isKanbanBoard,
    isUserTasks,
    kanbanContextMenuConfig,
    processManagerContextMenuConfig,
    userTasksContextMenuConfig,
  ]);

  return { contextMenuConfig };
};
