import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { HierarchyFilter } from '4_features';
import { HierarchySelect, TreeHierarchy } from '5_entites';
import { ActionTypes, Box, IHierarchyData, useDebounceValue, useHierarchy } from '6_shared';

import { ContentContainer } from '../contentContainer/ContentContainer';
import { FilterInput } from '../filterInput/FilterInput';
import { HierarchyComponentStyled } from './HierarchyComponent.styled';

interface IProps {
  footerSlot?: ReactNode;
  hierarchyData?: IHierarchyData;
  withLifecycle?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const HierarchyComponent = ({
  footerSlot,
  hierarchyData,
  withLifecycle,
  permissions,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const debValue = useDebounceValue(value);

  const {
    selectedParentId,
    parentItems,
    childItems,
    activeHierarchy,

    setGlobalSearchValue,
    setChildItems,
    setParentItems,
    setResetParentItems,
    setSelectedParentId,
    setSelectedChild,
  } = useHierarchy();

  useEffect(() => {
    setSelectedParentId('root');
    setSelectedChild(null);
  }, [activeHierarchy]);

  useEffect(() => {
    setChildItems(hierarchyData?.childrenData?.childrenItems ?? []);
  }, [hierarchyData?.childrenData?.childrenItems, setChildItems]);

  useEffect(() => {
    const parents = hierarchyData?.parentData?.parentItems ?? [];

    if (selectedParentId === 'root') {
      setResetParentItems();
      return;
    }
    if (selectedParentId !== 'root' && parents) {
      setParentItems(parents);
    }
  }, [hierarchyData?.parentData?.parentItems, selectedParentId]);

  useEffect(() => {
    setGlobalSearchValue(debValue);
  }, [debValue]);

  return (
    <HierarchyComponentStyled>
      <ContentContainer
        headerPercentHeight={20}
        bodyPercentHeight={100}
        footerPercentHeight={10}
        headerSlot={
          <>
            <HierarchySelect permissions={permissions} withLifecycle={withLifecycle} />
            <Box display="flex" alignItems="center" gap="5%">
              <FilterInput permissions={permissions} value={value} onChange={setValue} />
              <Button
                variant="contained.icon"
                data-testid="inventory_leftPanel-filter_btn"
                disabled={!(permissions?.view ?? true)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setIsOpen(true);
                }}
                onClick={() => setIsOpen(true)}
              >
                <FilterAltIcon />
              </Button>
              <HierarchyFilter permissions={permissions} isOpen={isOpen} setIsOpen={setIsOpen} />
            </Box>
          </>
        }
        bodySlot={
          <TreeHierarchy
            parentData={{
              parentItems,
              isLoadingParentsItems: hierarchyData?.parentData?.isLoadingParentsItems,
              isErrorParentsItems: hierarchyData?.parentData?.isErrorParentsItems,
              errorMessageParentsItems: hierarchyData?.parentData?.errorMessageParentsItems,
            }}
            childrenData={{
              childrenItems: childItems,
              isLoadingChildrenItems: hierarchyData?.childrenData?.isLoadingChildrenItems,
              isErrorChildrenItems: hierarchyData?.childrenData?.isErrorChildrenItems,
              getChildRightSideElements: hierarchyData?.childrenData?.getChildRightSideElements,
              getChildLeftSideElements: hierarchyData?.childrenData?.getChildLeftSideElements,
              errorMessageChildrenItems: hierarchyData?.childrenData?.errorMessageChildrenItems,
            }}
            showChildrenCount={hierarchyData?.showHierarchyChildCount}
          />
        }
        footerSlot={footerSlot}
      />
    </HierarchyComponentStyled>
  );
};
