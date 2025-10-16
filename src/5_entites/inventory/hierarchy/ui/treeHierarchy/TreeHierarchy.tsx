import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import {
  IHierarchyChildrenData,
  IHierarchyParentData,
  useAppNavigate,
  useHierarchy,
  useInventory,
  useObjectDetails,
} from '6_shared';
import { MainModuleListE } from 'config/mainModulesConfig';
import { Children } from '../childrens/Children';
import { Parents } from '../parents/Parents';
import { ContextMenu } from '../contextMenu/ContextMenu';

import { TreeHierarchyStyled } from './TreeHierarchy.styled';

interface ITreeHierarchyProps {
  childrenData: IHierarchyChildrenData;
  parentData: IHierarchyParentData;
  showChildrenCount?: boolean;
}

export const TreeHierarchy = ({
  parentData,
  childrenData,
  showChildrenCount,
}: ITreeHierarchyProps) => {
  const navigate = useAppNavigate();

  const {
    isErrorChildrenItems,
    isLoadingChildrenItems,
    childrenItems,
    getChildRightSideElements,
    getChildLeftSideElements,
    errorMessageChildrenItems,
  } = childrenData;

  const {
    isErrorParentsItems,
    isLoadingParentsItems,
    parentItems,
    getParentRightSideElements,
    errorMessageParentsItems,
  } = parentData;

  const [currentItem, setCurrentItem] = useState<HierarchyObject | null>(null);
  const [popupItemObject, setPopupItemObject] = useState<HierarchyObject | null>(null);
  const [anchorElContextMenu, setAnchorElContextMenu] = useState<null | HTMLElement>(null);
  const [anchorElHierarchyPath, setAnchorElHierarchyPath] = useState<null | HTMLElement>(null);

  const { setObjIds, setTmoId } = useInventory();
  const { setSelectedIHierarchyItem, setSelectedChild, setSelectedParentId, setRClickItem } =
    useHierarchy();
  const { pushObjectIdToStack } = useObjectDetails();

  const filteredChildren = useMemo(() => {
    // if ((!hideHierarchyNodesId || !hideHierarchyNodesId.length) && childrenItems) {
    //   return childrenItems;
    // }
    // return childrenItems?.filter((item) => !hideHierarchyNodesId?.includes(item.id));
    return childrenItems;
  }, [childrenItems]);

  const onChildrenClickOrDblclick = useCallback(
    (event: MouseEvent<HTMLElement>, item: HierarchyObject) => {
      setTmoId(item.object_type_id);
      // Single click logic
      if (event.detail === 1) {
        if (currentItem?.id === item.id) {
          setCurrentItem(null);
          setSelectedIHierarchyItem(null);
          setSelectedChild(null);
        } else {
          setCurrentItem(item);
          setSelectedIHierarchyItem(item);
          setSelectedChild(item.id);
          if (item.object_id) {
            setObjIds([item.object_id]);
          }
        }
      }
      // Double click logic
      if (event.detail > 1) {
        if (item.child_count > 0 && parentItems?.every((element) => element.id !== item.id)) {
          setSelectedIHierarchyItem(null);
          setSelectedParentId(item.id);
        }
      }
    },
    [currentItem?.id, parentItems],
  );

  const onParentClick = useCallback((parent: HierarchyObject) => {
    setSelectedParentId(parent.id);
    setSelectedIHierarchyItem(null);
  }, []);

  const handleClickContextMenu = (event: any, item: HierarchyObject) => {
    setCurrentItem(item);
    setPopupItemObject(item);
    event.preventDefault();
    event.stopPropagation();
    setAnchorElContextMenu(event.currentTarget);
  };

  const onPopupMenuItemClick = useCallback(
    (item: string) => {
      if (item === 'Get child elements') {
        // Some action
      }
      if (item === 'Details') {
        setRClickItem(item);
        if (popupItemObject) {
          navigate(MainModuleListE.objectDetails);
          if (popupItemObject?.object_id != null) {
            pushObjectIdToStack(popupItemObject.object_id);
          }
        }
      }
      setAnchorElContextMenu(null);
    },
    [navigate, popupItemObject, pushObjectIdToStack, setRClickItem],
  );

  const onClickHierarchyPath = (event: any) => {
    setAnchorElHierarchyPath(event.currentTarget);
  };

  return (
    <TreeHierarchyStyled>
      <Children
        isChildrenFetching={isLoadingChildrenItems}
        isChildrenError={isErrorChildrenItems}
        selectedChildren={currentItem?.id}
        childrenItems={filteredChildren}
        errorMessage={errorMessageChildrenItems}
        getChildRightSideElements={getChildRightSideElements}
        getChildLeftSideElements={getChildLeftSideElements}
        onChildrenClick={onChildrenClickOrDblclick}
        handleClickContextMenu={handleClickContextMenu}
        showChildrenCount={showChildrenCount}
      />
      <Parents
        parentItems={parentItems}
        errorMessage={errorMessageParentsItems}
        getParentRightSideElements={getParentRightSideElements}
        anchorElHierarchyPath={anchorElHierarchyPath}
        isBreadcrumbsFetching={isLoadingParentsItems}
        isBreadcrumbsError={isErrorParentsItems}
        onClickHierarchyPath={onClickHierarchyPath}
        onParentClick={onParentClick}
        setAnchorElHierarchyPath={setAnchorElHierarchyPath}
      />

      <ContextMenu
        anchorElContextMenu={anchorElContextMenu}
        setAnchorElContextMenu={setAnchorElContextMenu}
        popupItemObject={popupItemObject}
        onPopupMenuItemClick={onPopupMenuItemClick}
      />
    </TreeHierarchyStyled>
  );
};
