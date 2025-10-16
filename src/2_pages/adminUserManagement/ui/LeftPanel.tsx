import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Add, ExpandLess, ExpandMore, Hail, PeopleAlt, Person } from '@mui/icons-material';
import {
  Box,
  IGroup,
  IRole,
  IUser,
  SidebarLayout,
  useDebounceValue,
  useTranslate,
  useUserManagement,
} from '6_shared';
import { CustomSearch } from 'components/_reused components/myInput/CustomSearch';
import { ItemTreeListContainer } from '6_shared/ui/itemTreeList/ui/ItemTreeList.styled';
import { ItemTreeListItem } from '6_shared/ui/itemTreeList/ui/ItemTreeListItem';
import { ItemActions } from './lib/ItemActions';
import { ButtonAdd } from './MainView.styled';
import { getItemName, isUser } from '../utilities/utilities';
import ContextMenu from './lib/ContextMenu';
import { sortedSearchList } from './lib';

export const LeftPanel = () => {
  const translate = useTranslate();
  const { Sidebar, SidebarHeader, SidebarBody } = SidebarLayout;

  const [searchValue, setSearchValue] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [anchorElContextMenu, setAnchorElContextMenu] = useState<null | HTMLElement>(null);
  const [isUserContextMenu, setIsUserContextMenu] = useState<boolean>(false);

  const {
    users,
    groups,
    roles,
    selectedObject,
    selectedUser,
    selectedGroup,
    selectedRole,
    setSelectedObject,
    setSelectedUser,
    setSelectedGroup,
    setSelectedRole,
    setIsDialogAddGroupOpen,
    setIsDialogUserOpen,
    setUserDialogType,
    setIsDialogAddRoleOpen,
    setParentGroup,
  } = useUserManagement();

  useEffect(() => {
    if (users.length) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  const searchDebounceValue = useDebounceValue(searchValue);

  const onInputHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const onChangeSelectedObject = (event: SelectChangeEvent<string>) => {
    setSelectedObject(event.target.value);
    setSelectedUser(users[0]);
    setSelectedGroup(groups[0]);
    setSelectedRole(roles[0]);
  };

  const onCreateButtonClick = () => {
    switch (selectedObject) {
      case 'Groups':
        setParentGroup(null);
        setIsDialogAddGroupOpen(true);
        break;
      case 'Users':
        setUserDialogType('add');
        setIsDialogUserOpen(true);
        break;
      case 'Roles':
        setIsDialogAddRoleOpen(true);
        break;
      default:
        break;
    }
  };

  const toggleExpand = (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter((id) => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
    }
  };

  const handleClickContextMenu = (event: any, item: IGroup | IUser) => {
    if (isUser(item)) {
      setSelectedUser(item);
      setIsUserContextMenu(true);
    } else {
      setSelectedGroup(item);
      setIsUserContextMenu(false);
    }
    event.preventDefault();
    event.stopPropagation();
    setAnchorElContextMenu(event.currentTarget);
  };

  const onPopupMenuItemClick = (item: string) => {
    if (item === 'Add a Subgroup') {
      setParentGroup(selectedGroup);
      setIsDialogAddGroupOpen(true);
    }
    if (item === 'Reset Credentials') {
      setUserDialogType('password');
      setIsDialogUserOpen(true);
    }
    setAnchorElContextMenu(null);
  };

  const groupRenderElement = (item: IGroup, level = 0) => {
    const hasChildren = item.subGroups && item.subGroups.length > 0;
    const isExpanded = item.id && expandedGroups.includes(item.id);

    return (
      <Fragment key={item.id}>
        <ItemTreeListItem
          onClick={() => setSelectedGroup(item)}
          onContextMenu={(event) => {
            event?.preventDefault();
            handleClickContextMenu(event, item);
          }}
          selected={item.id === selectedGroup.id}
          icon={<PeopleAlt />}
          name={
            <>
              {item.name}
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={() => item.id && toggleExpand(item.id)} // Toggle expand/collapse
                >
                  {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              )}
            </>
          }
          actions={<ItemActions item={item} />}
        />
        {isExpanded && hasChildren && (
          <div style={{ marginLeft: `${10 * (level + 1)}px` }}>
            {item.subGroups?.map((subGroup: IGroup) => groupRenderElement(subGroup, level + 1))}
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <Sidebar collapsible>
      <SidebarHeader>
        <Select value={selectedObject} onChange={onChangeSelectedObject}>
          <MenuItem value="Users">{translate('Users')}</MenuItem>
          <MenuItem value="Groups">{translate('Groups')}</MenuItem>
          <MenuItem value="Roles">{translate('Roles')}</MenuItem>
        </Select>
        <Box display="flex" alignItems="center" gap="0.5rem" marginTop="0.5rem">
          <CustomSearch
            IconPosition="right"
            placeHolderText={translate('Search')}
            value={searchValue}
            onChange={onInputHandleChange}
          />
          <ButtonAdd variant="contained.icon" onClick={onCreateButtonClick}>
            <Add />
          </ButtonAdd>
        </Box>
      </SidebarHeader>
      <SidebarBody>
        <ItemTreeListContainer>
          <Box component="div" flex={1} overflow="auto">
            {selectedObject === 'Users' &&
              sortedSearchList(searchDebounceValue || '', users).map((item: IUser) => (
                <ItemTreeListItem
                  key={item.id}
                  onClick={() => setSelectedUser(item)}
                  selected={item.id === selectedUser.id}
                  icon={<Person />}
                  name={item.username}
                  actions={<ItemActions item={item} />}
                  onContextMenu={(event) => {
                    event?.preventDefault();
                    handleClickContextMenu(event, item);
                  }}
                  data-testid={
                    getItemName(item)?.startsWith('at_')
                      ? `${getItemName(item)}_container`
                      : undefined
                  }
                />
              ))}
            {selectedObject === 'Groups' &&
              sortedSearchList(searchDebounceValue || '', groups).map((item: IGroup) =>
                groupRenderElement(item),
              )}
            {selectedObject === 'Roles' &&
              sortedSearchList(searchDebounceValue || '', roles).map((item: IRole) => (
                <ItemTreeListItem
                  key={item.id}
                  onClick={() => setSelectedRole(item)}
                  selected={item.id === selectedRole.id}
                  icon={<Hail />}
                  name={item.name}
                  actions={<ItemActions item={item} />}
                />
              ))}
          </Box>

          <ContextMenu
            anchorElContextMenu={anchorElContextMenu}
            popupItemObject={isUserContextMenu ? selectedUser : selectedGroup}
            setAnchorElContextMenu={setAnchorElContextMenu}
            onPopupMenuItemClick={onPopupMenuItemClick}
          />
        </ItemTreeListContainer>
      </SidebarBody>
    </Sidebar>
  );
};
