import { Box, CircularProgress, Fade, Menu, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ActionTypes, InventoryObjectTypesModel, useTranslate } from '6_shared';
import { NestedElement, NestedMenu, TopLevelMenuItem } from './TemplateGraphContextMenu.styled';
import { ITemplateGraphContextMenuItem, ITemplateGraphContextMenuPosition } from '../../model';

interface IProps {
  templateChildOptions: InventoryObjectTypesModel[];
  nodeContextMenu: ITemplateGraphContextMenuPosition | null;
  onCloseTemplateGraphContextMenu: () => void;
  onTemplateGraphContextMenuItemClick: (props: ITemplateGraphContextMenuItem) => void;
  isGetObjectTypesChildFetching: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const TemplateGraphContextMenu = ({
  templateChildOptions,
  nodeContextMenu,
  onCloseTemplateGraphContextMenu,
  onTemplateGraphContextMenuItemClick,
  isGetObjectTypesChildFetching,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  return (
    <Menu
      sx={{
        '.MuiMenu-paper': {
          overflow: 'visible !important',
          minWidth: '160px',
        },
      }}
      // slotProps={{
      //   paper: { 'data-testid': 'inventory__context-menu' } as any,
      // }}
      TransitionComponent={Fade}
      transitionDuration={200}
      anchorReference="anchorPosition"
      aria-hidden={false}
      anchorPosition={
        nodeContextMenu ? { top: nodeContextMenu.top, left: nodeContextMenu.left } : undefined
      }
      // anchorEl={nodeContextMenu}
      open={!!nodeContextMenu}
      onClose={onCloseTemplateGraphContextMenu}
      // slotProps={{
      //   list: {
      //     'aria-labelledby': 'basic-button',
      //   },
      // }}
    >
      <NestedMenu>
        <TopLevelMenuItem
          className="parent"
          disabled={permissions?.update !== true || !templateChildOptions.length}
        >
          <Typography>{translate('Add child')}</Typography>
          {isGetObjectTypesChildFetching && <CircularProgress size={20} />}
          <ChevronRightIcon sx={{ position: 'absolute', right: '10px' }} />
          <Box component="div" className="nested_child">
            {templateChildOptions.map((child) => (
              <NestedElement
                disabled={permissions?.update !== true}
                onClick={() =>
                  onTemplateGraphContextMenuItemClick({
                    menuType: 'addChild',
                    objType: child,
                  })
                }
                key={child.id}
              >
                {child.name}
              </NestedElement>
            ))}
          </Box>
        </TopLevelMenuItem>

        <TopLevelMenuItem
          className="parent"
          disabled={!!permissions && !permissions.update}
          onClick={() =>
            onTemplateGraphContextMenuItemClick({
              menuType: 'edit',
              templateObjectId: nodeContextMenu?.node.id ? +nodeContextMenu.node.id : null,
            })
          }
        >
          <Typography>{translate('Edit')}</Typography>
        </TopLevelMenuItem>

        {!!nodeContextMenu && !nodeContextMenu?.node?.data?.isParent && (
          <TopLevelMenuItem
            className="parent"
            disabled={!!permissions && !permissions.update}
            onClick={() =>
              onTemplateGraphContextMenuItemClick({
                menuType: 'delete',
                templateObjectId: nodeContextMenu?.node.id ? +nodeContextMenu.node.id : null,
              })
            }
          >
            <Typography>{translate('Delete')}</Typography>
          </TopLevelMenuItem>
        )}
      </NestedMenu>
    </Menu>
  );
};
