import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  ICamundaUserTaskModel,
  IGantProcess,
  IMenuPosition,
  PmSelectedRow,
  ProcessContextMenuActionType,
  ProcessManagerPageMode,
  SeverityProcessModel,
  SeverityProcessModelData,
  useAppNavigate,
  useAssociatedObjects,
  useInventory,
  userTaskApi,
  useTaskManager,
  useUser,
} from '6_shared';
import {
  useCloseAlarmsAndDeleteGroup,
  useDeleteElementsFromGroup,
  useOwnerAssign,
} from '4_features';
import { useGenerateLink } from './useGenerateLink';
import { MainModuleListE } from '../../../../config/mainModulesConfig/mainModuleList';

const { useClaimUserTaskMutation, useUnclaimUserTaskMutation } = userTaskApi;

interface IProps {
  tableProcessData: SeverityProcessModel | undefined;
  pmSelectedRow: SeverityProcessModelData | null;
  pmSelectedRows: PmSelectedRow[];
  refetchAfterSuccess: () => void;
  pmSelectedRowId: number | null;
  pmTmoId: number | undefined;
  viewType: ProcessManagerPageMode;
  setIsCompleteUserTaskOpen?: (isOpen: boolean) => void;

  userTasksSelectedRow?: ICamundaUserTaskModel | null;
  userTasksSelectedRows?: ICamundaUserTaskModel[];
}

export const useProcessTableContextMenu = ({
  tableProcessData,
  pmSelectedRow,
  pmSelectedRows,
  refetchAfterSuccess,
  pmSelectedRowId,
  pmTmoId,
  viewType,
  setIsCompleteUserTaskOpen,

  userTasksSelectedRow,
  userTasksSelectedRows,
}: IProps) => {
  const { user } = useUser();

  const [contextMenuPosition, setContextMenuPosition] = useState<IMenuPosition | null>(null);
  const [isOpenCreateGroupDialog, setIsOpenCreateGroupDialog] = useState(false);
  const [isOpenAddElementsGroupDialog, setIsOpenAddElementsGroupDialog] = useState(false);
  const [isOpenDeleteGroupDialog, setIsOpenDeleteGroupDialog] = useState(false);
  const [isShowHistoryOpen, setIsShowHistoryOpen] = useState(false);
  const [isOpenGroupCreateTemplate, setIsOpenGroupCreateTemplate] = useState(false);
  const [isOpenDeleteGroupTemplate, setIsOpenDeleteGroupTemplate] = useState(false);

  const { setChangeObjectActivityStatusModal } = useInventory();
  const { setSelectedProcess } = useTaskManager();
  const { pushToObjectHistory, setIsOpenAssociatedTableModal } = useAssociatedObjects();

  const navigate = useAppNavigate();

  const rowId = pmSelectedRow?.id;

  const { closeAlarmsAndDeleteGroup } = useCloseAlarmsAndDeleteGroup({
    afterSuccessFn: refetchAfterSuccess,
  });

  const { ownerAssign } = useOwnerAssign({
    afterSuccess: refetchAfterSuccess,
    tmoId: pmTmoId,
    pmSelectedRows,
  });

  const { openMapLink, openDashboardLink } = useGenerateLink({
    objectId: pmSelectedRowId || undefined,
  });

  const { deleteElementsFromGroup } = useDeleteElementsFromGroup();

  const [claimUserTask] = useClaimUserTaskMutation();
  const [unclaimUserTask] = useUnclaimUserTaskMutation();

  const onContextMenuItemClick = async (menuType: ProcessContextMenuActionType, value?: string) => {
    switch (menuType) {
      case 'claim':
        if (user?.upn) {
          await ownerAssign(user.upn);
          if (viewType === 'tasks' && userTasksSelectedRow) {
            await claimUserTask({ user_task_key: +userTasksSelectedRow.id, assignee: user.upn });
          }
        }

        setContextMenuPosition(null);
        break;

      case 'assignTo': {
        if (value) {
          await ownerAssign(value);
          if (viewType === 'tasks' && userTasksSelectedRow) {
            claimUserTask({ user_task_key: +userTasksSelectedRow.id, assignee: value });
          }
        }

        setContextMenuPosition(null);
        break;
      }

      case 'copy':
        if (!tableProcessData || rowId == null) {
          enqueueSnackbar('Can not copy row data!', { variant: 'error' });
          setContextMenuPosition(null);
          return;
        }
        if (tableProcessData) {
          const currentObject2 = tableProcessData.rows.find((item) => item.id === rowId);
          if (currentObject2) {
            const currentObjectToJson = JSON.stringify(
              currentObject2,
              (key, val) => val || '',
              4,
            ).replace(/"([^"]+)":/g, '$1:');
            await navigator.clipboard.writeText(currentObjectToJson!);
            enqueueSnackbar('Row data was successfully copied.', { variant: 'success' });
          }
          setContextMenuPosition(null);
        }
        break;

      case 'closeAlarm':
        if (rowId) {
          await closeAlarmsAndDeleteGroup(pmSelectedRows);
          setContextMenuPosition(null);
        }
        break;

      case 'group':
        if (!value) break;

        if (value === 'Create group') {
          setIsOpenCreateGroupDialog(true);
          setContextMenuPosition(null);
          break;
        }
        if (value === 'Add to group') {
          setIsOpenAddElementsGroupDialog(true);
          setContextMenuPosition(null);
          break;
        }
        if (value === 'Delete group') {
          setIsOpenDeleteGroupDialog(true);
          setContextMenuPosition(null);
          break;
        }
        if (value === 'Remove element(s) from group') {
          await deleteElementsFromGroup();
          refetchAfterSuccess();
          setContextMenuPosition(null);
          break;
        }
        if (value === 'Create template') {
          setIsOpenGroupCreateTemplate(true);
          setContextMenuPosition(null);
          break;
        }
        if (value === 'Delete template') {
          setIsOpenDeleteGroupTemplate(true);
          refetchAfterSuccess();
          setContextMenuPosition(null);
          break;
        }
        break;

      case 'openMap':
        // openLink('Element Name');
        if (openMapLink) {
          window.open(openMapLink, '_blank');
          setContextMenuPosition(null);
        }
        break;

      case 'openDashboard':
        // openLink('to_navigator');
        if (openDashboardLink) {
          window.open(openDashboardLink, '_blank');
          setContextMenuPosition(null);
        }
        break;

      case 'showLinkedObjects':
        pushToObjectHistory({ id: pmSelectedRowId ?? 0, popupType: 'linked' });

        setIsOpenAssociatedTableModal({
          isOpen: true,
          type: 'linked',
          initialId: pmSelectedRowId,
        });
        setContextMenuPosition(null);
        break;

      case 'showRelatedObjects':
        pushToObjectHistory({ id: pmSelectedRowId ?? 0, popupType: 'related' });

        setIsOpenAssociatedTableModal({
          isOpen: true,
          type: 'related',
          initialId: pmSelectedRowId,
        });
        setContextMenuPosition(null);
        break;

      case 'showHistory': {
        setIsShowHistoryOpen(true);
        setContextMenuPosition(null);
        break;
      }

      case 'openTaskManager': {
        let selectedProcesses: IGantProcess[] = [];

        if (viewType === 'tasks') {
          selectedProcesses =
            userTasksSelectedRows?.map((row) => {
              return {
                processDefinitionKey: row.bpmnProcessId,
                processDefinitionId: +row.processDefinitionId,
                processInstanceId: +row.processInstanceId,
                startDate: row.creationTime,
              } as IGantProcess;
            }) ?? [];
        }
        if (viewType !== 'tasks') {
          if (pmSelectedRows.length && tableProcessData?.rows) {
            const rowsIds = pmSelectedRows.map(({ id }) => String(id));
            selectedProcesses = tableProcessData.rows.flatMap((row) => {
              if (!rowsIds.includes(String(row.id)) || !row.processDefinitionId) return [];

              return {
                processDefinitionKey: row.processDefinitionKey,
                processDefinitionId: row.processDefinitionId,
                processInstanceId: row.processInstanceId,
                startDate: row.startDate,
              } as IGantProcess;
            });
          }
        }

        setSelectedProcess(selectedProcesses);
        navigate(MainModuleListE.taskManager);
        setContextMenuPosition(null);

        break;
      }

      case 'delete': {
        setChangeObjectActivityStatusModal({
          isOpen: true,
          role: 'Delete',
        });
        setContextMenuPosition(null);
        break;
      }
      case 'completeTask': {
        setIsCompleteUserTaskOpen?.(true);
        setContextMenuPosition(null);
        break;
      }

      case 'unclaim': {
        if (viewType === 'tasks' && userTasksSelectedRow) {
          await unclaimUserTask({ user_task_key: +userTasksSelectedRow.id });
        }
        break;
      }

      default:
        break;
    }
  };

  return {
    contextMenuPosition,
    setContextMenuPosition,

    onContextMenuItemClick,
    isOpenCreateGroupDialog,
    setIsOpenCreateGroupDialog,
    isOpenAddElementsGroupDialog,
    setIsOpenAddElementsGroupDialog,
    isOpenDeleteGroupDialog,
    setIsOpenDeleteGroupDialog,
    isShowHistoryOpen,
    setIsShowHistoryOpen,

    isOpenGroupCreateTemplate,
    setIsOpenGroupCreateTemplate,

    isOpenDeleteGroupTemplate,
    setIsOpenDeleteGroupTemplate,
  };
};
