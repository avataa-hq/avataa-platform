import { useCallback, useEffect, useState } from 'react';

import { Add, Delete, Edit } from '@mui/icons-material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTheme } from '@emotion/react';
import { Button, IconButton } from '@mui/material';

import {
  Box,
  SearchInput,
  SidebarLayout,
  useRegistration,
  useGetPermissions,
  useGetAllObjectsAttributesQuery,
  searchApiV2,
  hierarchyApi,
  useHierarchyBuilder,
} from '6_shared';
import { ItemTreeList } from '6_shared/ui/itemTreeList';
import { Hierarchy } from '6_shared/api/hierarchy/types';

import SettingsHierarchyBody from './body/SettingsHierarchyBody';
import {
  AddHierarchyDialog,
  AddHierarchyLevelDialog,
  DeleteHierarchyDialog,
  EditHierarchyDialog,
  EditHierarchyLevelDialog,
} from './dialogBoxes';
import SettingsHierarchyHead from './head/SettingsHierarchyHead';
import SettingsHierarchyStyled from './SettingsHierarchy.styled';
import { DeleteHierarchyLevelDialog } from './dialogBoxes/DeleteHierarchyLevelDialog';

const SettingsObjects = () => {
  const { useGetAllHierarchyQuery } = searchApiV2;
  const { useRefreshMutation } = hierarchyApi;
  const theme = useTheme();
  useRegistration('hierarchyBuilder');
  const permissions = useGetPermissions('settings-hierarchies');

  const {
    activeHierarchyMenuItem,
    setActiveHierarchyMenuItem,
    setIsAddHierarchyDialogOpen,
    setIsDeleteHierarchyDialogOpen,
    setIsEditHierarchyDialogOpen,
    setSelectedHierarchy,
  } = useHierarchyBuilder();

  const { data: hierarchies } = useGetAllHierarchyQuery({}, { refetchOnMountOrArgChange: 1 });
  const [refreshHierarchy, { isLoading: isHierarchyRefreshing }] = useRefreshMutation();
  const { data: allObjectsAttributes } = useGetAllObjectsAttributesQuery();
  const { Sidebar, SidebarBody, SidebarHeader, Container } = SidebarLayout;
  const [searchResult, setSearchResult] = useState<Hierarchy[] | undefined>(hierarchies?.items);

  useEffect(() => {
    setSearchResult(hierarchies?.items);
    if (!hierarchies || !hierarchies?.items.length) return;
    setActiveHierarchyMenuItem(hierarchies.items[0]);
  }, [hierarchies]);

  const getItemActions = useCallback(
    (hierarchy: Hierarchy) => (
      <>
        <IconButton
          style={{ padding: 0 }}
          onClick={() => {
            setSelectedHierarchy(hierarchy);
            setIsEditHierarchyDialogOpen(true);
          }}
          data-testid={hierarchy.name?.startsWith('at_') ? `${hierarchy.name}_edit-btn` : undefined}
          disabled={!(permissions?.update ?? true)}
        >
          <Edit />
        </IconButton>
        <IconButton
          style={{ padding: 0 }}
          onClick={() => {
            setSelectedHierarchy(hierarchy);
            setIsDeleteHierarchyDialogOpen(true);
          }}
          data-testid={
            hierarchy.name?.startsWith('at_') ? `${hierarchy.name}_delete-btn` : undefined
          }
          disabled={!(permissions?.update ?? true)}
        >
          <Delete />
        </IconButton>
      </>
    ),
    [permissions?.update],
  );

  return (
    <SettingsHierarchyStyled>
      <SidebarLayout>
        <Sidebar background={theme.palette.neutral.surfaceContainerLow} collapsible>
          <SidebarHeader>
            <Box marginTop="0.5rem" display="flex" alignItems="center" gap="5%">
              <SearchInput
                data={hierarchies?.items}
                searchedProperty="name"
                onChange={(value) => setSearchResult(value)}
              />
              <Button
                variant="contained.icon"
                data-testid="left-panel__add-hierarchy-btn"
                onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setIsAddHierarchyDialogOpen(true);
                }}
                onClick={() => {
                  setIsAddHierarchyDialogOpen(true);
                }}
                disabled={!(permissions?.update ?? true)}
                style={{
                  backgroundColor: !(permissions?.update ?? true)
                    ? theme.palette.text.disabled
                    : '',
                }}
              >
                <Add />
              </Button>
            </Box>
          </SidebarHeader>
          <SidebarBody>
            {searchResult && (
              <ItemTreeList
                items={searchResult}
                getItemIcon={<AccountTreeIcon />}
                getItemActions={getItemActions}
                onItemClick={(event, hierarchy) => setActiveHierarchyMenuItem(hierarchy)}
                activeItem={activeHierarchyMenuItem}
                permissions={permissions}
              />
            )}
          </SidebarBody>

          <AddHierarchyDialog />
          <EditHierarchyDialog />
          <DeleteHierarchyDialog />
          <EditHierarchyLevelDialog allObjectsAttributes={allObjectsAttributes} />
          <AddHierarchyLevelDialog allObjectsAttributes={allObjectsAttributes} />
          <DeleteHierarchyLevelDialog />
        </Sidebar>

        <Container>
          <SettingsHierarchyHead
            disableRefreshButtonClick={isHierarchyRefreshing}
            onRefreshButtonClick={async () => {
              if (activeHierarchyMenuItem?.id) {
                await refreshHierarchy(activeHierarchyMenuItem.id).unwrap();
              }
            }}
          />
          <SettingsHierarchyBody
            permissions={permissions}
            activeHierarchyMenuItem={activeHierarchyMenuItem}
          />
        </Container>
      </SidebarLayout>
    </SettingsHierarchyStyled>
  );
};

export default SettingsObjects;
