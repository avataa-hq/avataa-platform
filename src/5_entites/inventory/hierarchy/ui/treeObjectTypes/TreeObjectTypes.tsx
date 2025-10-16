import { useCallback, useEffect, useRef, useState } from 'react';
import {
  InventoryObjectTypesModel,
  useRegistration,
  ActionTypes,
  isArraysEqual,
  useHierarchy,
  useInventory,
  useTabs,
  useSettingsObject,
} from '6_shared';
import { useUserSettingsCud } from '4_features';
import { Box, Switch, Typography } from '@mui/material';
import { TreeObjectTypesStyled } from './TreeObjectTypes.styled';
import { Children } from '../childrens/Children';
import { Parents } from '../parents/Parents';
import { ContextMenu } from '../contextMenu/ContextMenu';

interface IProps {
  getParentRightSideElements?: (item: InventoryObjectTypesModel) => React.ReactNode;
  getChildRightSideElements?: (item: InventoryObjectTypesModel) => React.ReactNode;
  getChildLeftSideElements?: (item: InventoryObjectTypesModel) => React.ReactNode;

  childrenItems?: InventoryObjectTypesModel[];
  isErrorChildrenItems?: boolean;
  isFetchingChildrenItems?: boolean;

  parentItems?: InventoryObjectTypesModel[];
  isFetchingParentItems?: boolean;
  isErrorParentItems?: boolean;

  objectTypeFromSearch?: InventoryObjectTypesModel;

  anchor?: string;
  permissions?: Record<ActionTypes, boolean>;
  favorites: number[];
  showParents: boolean;
  showFavorite: boolean;
  isObjectSettings?: boolean;
}

export const TreeObjectTypes = ({
  getParentRightSideElements,
  getChildRightSideElements,
  getChildLeftSideElements,

  childrenItems,
  isErrorChildrenItems,
  isFetchingChildrenItems,

  parentItems,
  isFetchingParentItems,
  isErrorParentItems,

  objectTypeFromSearch,

  anchor,
  permissions,
  favorites,
  showParents,
  showFavorite,
  isObjectSettings,
}: IProps) => {
  useRegistration('hierarchy');

  const [anchorElContextMenu, setAnchorElContextMenu] = useState<null | HTMLElement>(null);
  const [anchorElHierarchyPath, setAnchorElHierarchyPath] = useState<null | HTMLElement>(null);
  const [favoritesIds, setFavoritesIds] = useState<number[]>(favorites);

  const timerId = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const { selectedTab } = useTabs();
  const { setTmoId, setIsFileDownloadModalOpen } = useInventory();
  const {
    searchedObject,
    selectedObjectTypeItem,
    isImportDisabled,
    selectNestedTMO,

    setSelectNestedTMO,
    setParentId,
    setSearchedObject,
    setSelectedObjectTypeItem,
  } = useHierarchy();
  const {
    setArrayOfGroupsObjects,
    setNameOfSelectedGroup,
    setObjType,
    setIsEditObjectModalOpen,
    setIsDeleteObjectModalOpen,
  } = useSettingsObject();

  const { updateUserSettings } = useUserSettingsCud();

  const onPopupMenuItemClick = (item: string) => {
    if (item === 'Import') {
      setIsFileDownloadModalOpen(true);
      setAnchorElContextMenu(null);
    }
  };

  useEffect(() => {
    if (!objectTypeFromSearch) return;

    if (objectTypeFromSearch.p_id === null) setParentId(0);
    else setParentId(objectTypeFromSearch.p_id);

    if (searchedObject !== null) setSelectedObjectTypeItem(objectTypeFromSearch);
  }, [objectTypeFromSearch, searchedObject]);

  const onChildrenClick = (
    event: React.MouseEvent<HTMLElement>,
    item: InventoryObjectTypesModel,
  ) => {
    if (!(permissions?.view ?? true)) return;
    event.preventDefault();
    event.stopPropagation();
    const isCorrectParent =
      item.child_count &&
      item.child_count > 0 &&
      parentItems?.every((element) => element.name !== item.name);

    const drillToParent = () => {
      setParentId(item.id);
      setArrayOfGroupsObjects(null);
      setObjType(null);
      setNameOfSelectedGroup(null);
      setSelectedObjectTypeItem(item);
    };

    if (event.detail === 1) {
      if (!showParents) {
        setTmoId(item.id);
        setSelectedObjectTypeItem(item);
        return;
      }

      if (selectedObjectTypeItem?.id === item.id) {
        setSelectedObjectTypeItem(null);
      } else {
        setSelectedObjectTypeItem(item);
      }
      setSearchedObject(null);

      if (selectedTab === 'objects') {
        setObjType(item);
      }

      if (selectedTab === 'inventory' || selectedTab === 'inventoryRework') {
        setSelectedObjectTypeItem(item);
      }

      if (item.virtual && isCorrectParent) {
        drillToParent();
      }
    }

    if (event.detail > 1 && isCorrectParent) {
      drillToParent();
    }
  };

  const onParentClick = (parent: InventoryObjectTypesModel) => {
    if (!(permissions?.view ?? true)) return;

    if (!parentItems || parentItems[parentItems.length - 1].id === parent.id) return;

    setParentId(parent.id);
    setSearchedObject(null);
    setArrayOfGroupsObjects(null);
    setNameOfSelectedGroup(null);
    setObjType(null);

    setSelectedObjectTypeItem(parent);
  };

  const handleClickContextMenu = (event: any, item: InventoryObjectTypesModel) => {
    if (selectedTab === 'inventory' || selectedTab === 'map' || selectedTab === 'inventoryRework') {
      event.preventDefault();
      event.stopPropagation();
      setSelectedObjectTypeItem(item);
      setSearchedObject(null);
      setAnchorElContextMenu(event.currentTarget);
    }
  };

  const onClickHierarchyPath = (event: any) => {
    setAnchorElHierarchyPath(event.currentTarget);
  };

  const updateFavorites = useCallback(
    async (newIds: number[]) => {
      updateUserSettings({
        key: 'component:object_types',
        body: {
          settings: {
            favorite: newIds,
          },
        },
      });
    },
    [updateUserSettings],
  );

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      if (favoritesIds.length === 0 && !isArraysEqual(favorites, favoritesIds)) {
        setFavoritesIds(favorites);
      }
    }, 1500);
  }, [favorites, favoritesIds]);

  const onFavoriteClick = async (id: number) => {
    let newFavorites = [...favoritesIds];
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    if (favoritesIds.includes(id)) {
      newFavorites = newFavorites.filter((item) => item !== id);
    } else {
      newFavorites = [...newFavorites, id];
    }

    setFavoritesIds(newFavorites);

    timerId.current = setTimeout(() => {
      updateFavorites(newFavorites);
    }, 500);
  };

  const onEditClick = (item: InventoryObjectTypesModel) => {
    setObjType(item);
    setIsEditObjectModalOpen(true);
    setSelectedObjectTypeItem(item);
  };

  const onDeleteClick = () => {
    setIsDeleteObjectModalOpen(true);
  };

  return (
    <TreeObjectTypesStyled>
      {selectedTab === 'map' && (
        <Box component="div" display="flex" alignItems="center">
          <Switch
            checked={selectNestedTMO}
            value={selectNestedTMO}
            onChange={(_, checked) => {
              setSelectNestedTMO(checked);
            }}
          />
          <Typography sx={{ opacity: selectNestedTMO ? 0.8 : 0.5 }}>with nested</Typography>
        </Box>
      )}

      <Children
        childrenItems={childrenItems}
        handleClickContextMenu={handleClickContextMenu}
        isChildrenError={isErrorChildrenItems}
        isChildrenFetching={isFetchingChildrenItems}
        onChildrenClick={onChildrenClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        selectedChildren={selectedObjectTypeItem?.id}
        getChildRightSideElements={getChildRightSideElements}
        getChildLeftSideElements={getChildLeftSideElements}
        anchor={anchor}
        onFavoriteClick={onFavoriteClick}
        favorites={favoritesIds}
        showFavorite={showFavorite}
        isObjectSettings={isObjectSettings}
        permissions={permissions}
      />

      {showParents && (
        <Parents
          parentItems={parentItems}
          getParentRightSideElements={getParentRightSideElements}
          anchorElHierarchyPath={anchorElHierarchyPath}
          isBreadcrumbsFetching={isFetchingParentItems}
          isBreadcrumbsError={isErrorParentItems}
          onClickHierarchyPath={onClickHierarchyPath}
          onParentClick={onParentClick}
          setAnchorElHierarchyPath={setAnchorElHierarchyPath}
        />
      )}

      <ContextMenu
        anchorElContextMenu={anchorElContextMenu}
        setAnchorElContextMenu={setAnchorElContextMenu}
        onPopupMenuItemClick={onPopupMenuItemClick}
        forObjectTypes
        isImportDisabled={isImportDisabled}
        permissions={permissions}
      />
    </TreeObjectTypesStyled>
  );
};
