import { Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ActionTypes, Box, useTranslate } from '6_shared';
import { IProcessManagerContextMenuConfig, ProcessContextMenuActionType } from '6_shared/models';
import { NestedElement, NestedMenu, TopLevelMenuItem } from './ContextMenu.styled';

interface IProps {
  contextMenuConfig: IProcessManagerContextMenuConfig[];
  onContextMenuItemClick?: (clickType: ProcessContextMenuActionType, value?: string) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const ContextMenuComponent = ({
  contextMenuConfig,
  onContextMenuItemClick,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const onClick = (clickType: ProcessContextMenuActionType, value?: string) => {
    onContextMenuItemClick?.(clickType, value);
  };

  return (
    <NestedMenu>
      {contextMenuConfig.map((item) => {
        if (item.type === 'item') {
          return (
            <TopLevelMenuItem
              key={item.action}
              disabled={item.disabled}
              onClick={() => onClick(item.action)}
            >
              {translate(item.label as any)}
            </TopLevelMenuItem>
          );
        }

        if (item.type === 'submenu') {
          return (
            <TopLevelMenuItem key={item.action} disabled={item.disabled} className="parent">
              <Typography>{translate(item.label as any)}</Typography>
              <ChevronRightIcon sx={{ position: 'absolute', right: '10px' }} />
              <Box className="nested_child">
                {item?.children?.map((child) => (
                  <NestedElement onClick={() => onClick(item.action, child)} key={child}>
                    {child}
                  </NestedElement>
                ))}
              </Box>
            </TopLevelMenuItem>
          );
        }

        return null;
      })}
    </NestedMenu>

    // <NestedMenu>
    //   <TopLevelMenuItem disabled={!(permissions?.update ?? true)} onClick={() => onClick('claim')}>
    //     {translate('Claim')}
    //   </TopLevelMenuItem>

    //   <TopLevelMenuItem disabled={!(permissions?.update ?? true)} className="parent">
    //     <Typography>{translate('Assign to')}</Typography>
    //     <ChevronRightIcon sx={{ position: 'absolute', right: '10px' }} />
    //     <Box className="nested_child">
    //       {userNamesList?.map((item) => (
    //         <NestedElement onClick={() => onClick('assignTo', item)} key={item}>
    //           {item}
    //         </NestedElement>
    //       ))}
    //     </Box>
    //   </TopLevelMenuItem>

    //   {/* <TopLevelMenuItem disabled={!(permissions?.view ?? true)} onClick={() => onClick?.('copy')}>
    //     Copy
    //   </TopLevelMenuItem> */}

    //   {!isKanbanBoard && !isUserTasks && (
    //     <TopLevelMenuItem disabled={!(permissions?.view ?? true)} className="parent">
    //       <Typography>{translate('Group')}</Typography>
    //       <ChevronRightIcon sx={{ position: 'absolute', right: '10px' }} />
    //       <Box className="nested_child">
    //         {groupMenuList.map((item) => (
    //           <NestedElement
    //             disabled={!(permissions?.update ?? true)}
    //             onClick={() => (permissions?.update ?? true) && onClick('group', item)}
    //             key={item}
    //           >
    //             {translate(item)}
    //           </NestedElement>
    //         ))}
    //       </Box>
    //     </TopLevelMenuItem>
    //   )}
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       // disabled={!(mapPermissions?.view ?? true)}
    //       disabled={isOpenMapActive}
    //       onClick={() => onClick('openMap')}
    //     >
    //       {translate('Open map')}
    //     </TopLevelMenuItem>
    //   )}
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       // disabled={!(permissions?.view ?? true)}
    //       disabled={isOpenDashboardActive}
    //       onClick={() => onClick('openDashboard')}
    //     >
    //       {translate('Open dashboard')}
    //     </TopLevelMenuItem>
    //   )}
    //   {/* <TopLevelMenuItem
    //     disabled={!(permissions?.view ?? true)}
    //     onClick={() => onClick?.('showRule')}
    //   >
    //     <Link
    //       sx={{ color: ({ palette }) => palette.text.primary, textDecoration: 'none' }}
    //       href={config.processRuleBaseUrl}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Show rule
    //     </Link>
    //   </TopLevelMenuItem> */}
    //   {hasActiveObject && !isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.update ?? true)}
    //       onClick={() => onClick('closeAlarm')}
    //     >
    //       {translate('Close alarm')}
    //     </TopLevelMenuItem>
    //   )}
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.view ?? true)}
    //       onClick={() => onClick('showLinkedObjects')}
    //     >
    //       {translate('Show linked objects')}
    //     </TopLevelMenuItem>
    //   )}
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.view ?? true)}
    //       onClick={() => onClick('showRelatedObjects')}
    //     >
    //       {translate('Show related objects')}
    //     </TopLevelMenuItem>
    //   )}
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.view ?? true)}
    //       onClick={() => onClick('showHistory')}
    //     >
    //       {translate('Show history')}
    //     </TopLevelMenuItem>
    //   )}
    //   <TopLevelMenuItem
    //     disabled={!(permissions?.view ?? true)}
    //     onClick={() => onClick('openTaskManager')}
    //   >
    //     {translate('Open task manager')}
    //   </TopLevelMenuItem>
    //   {!isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.update ?? true) || hasGroup}
    //       onClick={() => onClick('delete')}
    //     >
    //       {translate('Delete')}
    //     </TopLevelMenuItem>
    //   )}
    //   {isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.update ?? true) || hasGroup}
    //       onClick={() => onClick('completeTask')}
    //     >
    //       {translate('Complete tasks')}
    //     </TopLevelMenuItem>
    //   )}
    //   {isUserTasks && (
    //     <TopLevelMenuItem
    //       disabled={!(permissions?.update ?? true) || hasGroup}
    //       onClick={() => onClick('unclaim')}
    //     >
    //       {translate('Unclaim')}
    //     </TopLevelMenuItem>
    //   )}
    // </NestedMenu>
  );
};
