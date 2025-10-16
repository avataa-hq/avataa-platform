import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Attributes,
  History,
  KanbanBoardColumn,
  KanbanEditModalTitle,
  StreamComments,
  useGetInventoryObjectData,
  useGetSeverityProcess,
  useKanbanBoardUserData,
  UserContextMenu,
  useUpdateMultipleParameters,
  useUserContextMenu,
} from '5_entites';
import {
  ActionTypes,
  IColorRangeModel,
  IKanbanStatus,
  IKanbanTask,
  IMenuPosition,
  Modal,
  MultipleParameterUpdateBody,
  useConfig,
  useKanbanBoard,
  useProcessManagerTable,
  useRegistration,
} from '6_shared';
import { useTaskPriority } from '3_widgets/taskPlanner/lib';
// import { useConfig } from 'config/useConfig';
import { TaskEdit } from '../../../4_features';
import { FileViewerWidget } from '../../inventory';
import { UserRepresentation } from '../../../6_shared/api/keycloak/users/types';
import { MainModuleListE } from '../../../config/mainModulesConfig';

import {
  KanbanBoardStyled,
  KanbanBoardWrapper,
  IssuesCount,
  KanbanBoardBody,
  TaskStatusCount,
  KanbanBoardColumnsWrapper,
  KanbanBoardHeader,
  KanbanBoardHeaderStatus,
  KanbanBoardPriorityWrapper,
  KanbanErrorContainer,
} from './KanbanBoard.styled';

// const STATUSES = [
//   { key: 'toDo', label: 'To do' },
//   { key: 'inProgress', label: 'In progress' },
//   { key: 'testing', label: 'Testing' },
//   { key: 'done', label: 'Done' },
// ];

// const initialTasks = Array.from({ length: 50 }, (_, i) => ({
//   id: i.toString(),
//   title: `Task ${i + 1}`,
//   status: STATUSES[Math.floor(Math.random() * STATUSES.length)].key,
// }));

interface IProps {
  kanbanStatuses: IKanbanStatus[];
  kanbanTasks: IKanbanTask[];
  setContextMenuPosition?: (value: IMenuPosition | null) => void;
  kanbanBoardColorRangesData?: IColorRangeModel | null;
  kanbanErrorSlot?: ReactNode;
  permissions?: Record<ActionTypes, boolean>;
  isLoading?: boolean;
}

export const KanbanBoard = ({
  kanbanStatuses,
  kanbanTasks,
  setContextMenuPosition,
  kanbanBoardColorRangesData,
  kanbanErrorSlot,
  permissions,
  isLoading,
}: IProps) => {
  useRegistration(['kanbanBoard']);

  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const { editableTask, setEditableTask } = useKanbanBoard();
  const { setSelectedRow, setSelectedRows } = useProcessManagerTable();

  const [tasks, setTasks] = useState<IKanbanTask[]>(kanbanTasks);
  const [isExpediteCollapsed, setIsExpediteCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && kanbanTasks.length) {
      setTasks((prev) => {
        const prevById = Object.fromEntries(prev.map((t) => [t.id, t]));
        return kanbanTasks.map((serverTask) => ({
          ...serverTask,
          status: prevById[serverTask.id]?.status ?? serverTask.status,
        }));
      });
    }
  }, [kanbanTasks, isLoading]);

  useEffect(() => {
    if (editableTask) {
      window.history.pushState(null, '', `/${MainModuleListE.processManager}/${editableTask.id}`);
    } else {
      window.history.pushState(null, '', `/${MainModuleListE.processManager}`);
    }
  }, [editableTask]);

  const { updateMultipleParameters } = useUpdateMultipleParameters();

  const { userNamesList, usersData } = useKanbanBoardUserData();

  const { tasksPriorityColors } = useTaskPriority({ tasks, kanbanBoardColorRangesData });

  const { getInventoryObjectData } = useGetInventoryObjectData({});

  const { getSeverityProcesses, createSeverityProcessBody } = useGetSeverityProcess();

  const {
    userContextMenuPosition,
    setUserContextMenuPosition,
    handleUserContextMenuPosition,
    onUserConextMenuItemClick,
    kanbanTaskUserName,
  } = useUserContextMenu();

  const onMoveTask = (
    taskId: string,
    statusTprmId: number,
    newStatus: string,
    newIndex: number,
  ) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks.find((task) => task.id === taskId);
      if (!taskToMove) return prevTasks;

      const filteredTasks = prevTasks.filter((task) => task.id !== taskId);
      const targetTasks = filteredTasks.filter((task) => task.status === newStatus);
      targetTasks.splice(newIndex, 0, { ...taskToMove, status: newStatus });

      return [...filteredTasks.filter((task) => task.status !== newStatus), ...targetTasks];
    });

    const updateParamsBody: MultipleParameterUpdateBody[] = [
      { object_id: Number(taskId), new_values: [{ tprm_id: statusTprmId, new_value: newStatus }] },
    ];

    if (newStatus !== tasks.find((task) => task.id === taskId)?.status) {
      updateMultipleParameters(updateParamsBody, `Task moved to ${newStatus}`);
    }
  };

  const groupedTasks = useMemo(() => {
    return tasks.reduce<Record<string, IKanbanTask[]>>((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const handleContextMenuPosition = (position: IMenuPosition | null, taskItem: IKanbanTask) => {
    setSelectedRow(taskItem);
    setSelectedRows([taskItem]);
    setContextMenuPosition?.(position);
  };

  const onTaskClick = useCallback(
    (task: IKanbanTask) => {
      setEditableTask(task);
    },
    [setEditableTask],
  );

  const onTaskParentClick = useCallback(
    async (parentId: number) => {
      if (!parentId) return;

      const { data: invObjectData } = await getInventoryObjectData({ id: parentId });
      if (!invObjectData) return;

      const { data: sevetityProcessData } = await getSeverityProcesses(
        createSeverityProcessBody(invObjectData.tmo_id, invObjectData.id.toString()),
      );
      if (!sevetityProcessData?.rows?.[0]) return;

      setEditableTask({
        ...sevetityProcessData.rows[0],
        daysInColumn: 0,
      } satisfies IKanbanTask);
    },
    [createSeverityProcessBody, getInventoryObjectData, getSeverityProcesses, setEditableTask],
  );

  const usersById = useMemo(() => {
    if (!usersData) return {};
    return usersData.reduce((acc, item) => {
      const key = `${item.firstName} ${item.lastName}`.trim().toLowerCase();
      acc[key ?? ''] = item;
      return acc;
    }, {} as Record<string, UserRepresentation>);
  }, [usersData]);

  if (kanbanErrorSlot) {
    return <KanbanErrorContainer>{kanbanErrorSlot}</KanbanErrorContainer>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanBoardStyled>
        <KanbanBoardWrapper>
          <KanbanBoardHeader>
            {kanbanStatuses.map(({ id, name }) => (
              <KanbanBoardHeaderStatus key={id}>
                {name}
                <TaskStatusCount>
                  <Typography variant="subtitle1">{groupedTasks[id]?.length || 0}</Typography>
                </TaskStatusCount>
              </KanbanBoardHeaderStatus>
            ))}
          </KanbanBoardHeader>

          <KanbanBoardPriorityWrapper>
            <IconButton
              size="small"
              onClick={() => setIsExpediteCollapsed(!isExpediteCollapsed)}
              sx={{ width: '24px', height: '24px', marginLeft: '10px' }}
            >
              <KeyboardArrowDownIcon
                sx={{
                  transform: isExpediteCollapsed ? 'rotate(-90deg)' : '',
                  transition: '0.3s',
                }}
              />
            </IconButton>
            <Typography>
              Expedite <IssuesCount>({tasks.length} issues)</IssuesCount>
            </Typography>
          </KanbanBoardPriorityWrapper>

          <KanbanBoardBody>
            <KanbanBoardColumnsWrapper
              sx={{
                gridTemplateColumns: `repeat(${kanbanStatuses?.length || 0}, 1fr)`,
                // gridTemplateRows: '40px 1fr',
              }}
            >
              {/* <KanbanBoardPriorityWrapper
                sx={{ gridColumn: `span ${kanbanStatuses?.length || 0}` }}
              >
                <IconButton
                  size="small"
                  onClick={() => setIsExpediteCollapsed(!isExpediteCollapsed)}
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: isExpediteCollapsed ? 'rotate(-90deg)' : '',
                      transition: '0.3s',
                    }}
                  />
                </IconButton>
                <Typography>
                  Expedite <IssuesCount>({tasks.length} issues)</IssuesCount>
                </Typography>
              </KanbanBoardPriorityWrapper> */}
              {!isExpediteCollapsed &&
                kanbanStatuses.map(({ id, tprmId }) => (
                  <KanbanBoardColumn
                    key={id}
                    status={id}
                    statusTprmId={tprmId}
                    tasks={groupedTasks[id]}
                    usersData={usersData}
                    onMoveTask={onMoveTask}
                    handleContextMenuPosition={handleContextMenuPosition}
                    tasksPriorityColors={tasksPriorityColors}
                    handleUserContextMenuPosition={handleUserContextMenuPosition}
                    onTaskClick={onTaskClick}
                    onTaskParentClick={onTaskParentClick}
                  />
                ))}
            </KanbanBoardColumnsWrapper>
          </KanbanBoardBody>
        </KanbanBoardWrapper>

        <UserContextMenu
          userContextMenuPosition={userContextMenuPosition}
          onClose={() => setUserContextMenuPosition(null)}
          onUserConextMenuItemClick={onUserConextMenuItemClick}
          userNamesList={userNamesList}
          kanbanTaskUserName={kanbanTaskUserName}
        />
      </KanbanBoardStyled>
      <Modal
        title={
          <KanbanEditModalTitle
            handleContextMenuPosition={handleContextMenuPosition}
            task={editableTask}
          />
        }
        open={!!editableTask}
        onClose={() => {
          setEditableTask(null);
        }}
        width="60%"
        minWidth="800px"
      >
        {editableTask && (
          <TaskEdit
            objectId={+editableTask.id}
            permissions={permissions}
            rightSlot={<Attributes objectId={+editableTask.id} permissions={permissions} />}
            footerSlots={{
              attachmentComponent: (
                <FileViewerWidget objectId={+editableTask.id} permissions={permissions} isKanban />
              ),
              commentsComponent: (
                <StreamComments
                  objectId={+editableTask.id}
                  usersData={usersById}
                  permissions={permissions}
                />
              ),
              historyComponent: (
                <History
                  objectId={+editableTask.id}
                  disableTimezoneAdjustment={disableTimezoneAdjustment}
                  disabledHeader
                  disabledOverflow
                  enableHiddenResponseSettings
                />
              ),
            }}
          />
        )}
      </Modal>
    </DndProvider>
  );
};
