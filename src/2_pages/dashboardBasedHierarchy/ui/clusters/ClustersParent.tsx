import { useRef, useCallback, memo, useState, useEffect } from 'react';

import { Button, ButtonGroup, Typography } from '@mui/material';
import { ArrowCircleUp, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';

import {
  Box,
  DBHClusteresDataModel,
  InventoryAndHierarchyObjectTogether,
  SortValueType,
  useDashboardBasedHierarchy,
  useResize,
  useTranslate,
} from '6_shared';

import { ClusterSorting } from './ClusterSorting';
import { Clusters } from './Clusters';
import { Body, Header } from './ClustersParent.styled';
import { HierarchyLevel } from '../../../../6_shared/api/hierarchy/types';
import { dispatchNewHierarchyAndChangeLeftAreaType } from '../../lib/dispatchNewHierarchyAndChangeLeftAreaType';

interface IProps {
  clustersData: DBHClusteresDataModel;
  loading: boolean;
  sortValues?: SortValueType[];
  selectedClusterSort: SortValueType | null;
  setSelectedClusterSort: (sort: SortValueType | null) => void;
  hierarchyLevels: HierarchyLevel[];

  isFullScreen?: boolean;
}

const ClustersParentComponent = ({
  clustersData,
  setSelectedClusterSort,
  sortValues,
  selectedClusterSort,
  loading,
  hierarchyLevels,
  isFullScreen,
}: IProps) => {
  const translate = useTranslate();
  const childRef = useRef<HTMLElement | null>(null);

  const { setHierarchyBreadcrumbs, setLeftAreaType, setCurrentHierarchyLevelId } =
    useDashboardBasedHierarchy();

  const { getFontSize } = useResize({ childRef });

  const [page, setPage] = useState(1);
  const [selectedClusterSortDirection, setSelectedClusterSortDirection] = useState<{
    dir: 'up' | 'down' | null;
    color: 'error' | 'success';
  } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [isFullScreen]);

  // const { handleMouseDown, handleMouseLeave, handleMouseMove, handleMouseUp, didMove } =
  //   useSwipeScroll();

  const onClusterClick = useCallback(
    async (hierarchy: InventoryAndHierarchyObjectTogether) => {
      // if (!didMove.current) {
      dispatchNewHierarchyAndChangeLeftAreaType(
        setHierarchyBreadcrumbs,
        setLeftAreaType,
        setCurrentHierarchyLevelId,
        hierarchy,
        hierarchyLevels,
      );
      // }
    },
    [hierarchyLevels],
  );

  const totalPages = Math.ceil((clustersData?.clusterData?.length || 0) / (isFullScreen ? 5 : 3));

  const sliderMove = (direction: 'PREV' | 'NEXT') => {
    setPage((prevPage) => {
      if (direction === 'PREV' && prevPage > 1) return prevPage - 1;
      if (direction === 'NEXT' && prevPage < totalPages) return prevPage + 1;
      return prevPage;
    });
  };

  const toggleSortingDirection = useCallback(() => {
    setSelectedClusterSortDirection((prevDirection) => ({
      dir: prevDirection?.dir === 'up' ? 'down' : 'up',
      color: prevDirection?.color === 'error' ? 'success' : 'error',
    }));
  }, []);

  useEffect(() => {
    if (!selectedClusterSort) return;
    setSelectedClusterSortDirection({
      dir: selectedClusterSort.direction === 'up' ? 'down' : 'up',
      color: 'error',
    });
  }, [selectedClusterSort]);

  return (
    <>
      <Header ref={childRef}>
        <Box width="25%" height="100%" display="flex" justifyContent="start" alignItems="center">
          <Typography variant="h1" fontSize={getFontSize(50)} fontWeight="600">
            {translate('Top offenders')}
          </Typography>
          {selectedClusterSort?.direction && (
            <ArrowCircleUp
              onClick={toggleSortingDirection}
              sx={(theme: Theme) => ({
                color: theme.palette[selectedClusterSortDirection?.color ?? 'error'].main,
                transform:
                  selectedClusterSortDirection?.dir === 'up' ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              })}
            />
          )}
        </Box>
        <Box
          width="75%"
          height="100%"
          display="flex"
          justifyContent="end"
          alignItems="center"
          gap="5%"
        >
          {/* {selectedClusterSort?.direction && (
            <ArrowCircleUp
              onClick={toggleSortingDirection}
              sx={(theme: Theme) => ({
                color: theme.palette[selectedClusterSortDirection?.color ?? 'error'].main,
                transform:
                  selectedClusterSortDirection?.dir === 'up' ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              })}
            />
          )} */}
          <Box width="50%">
            <ClusterSorting
              sortingList={sortValues}
              selectedSort={selectedClusterSort}
              setSelectedSort={setSelectedClusterSort}
            />
          </Box>
          <ButtonGroup className="container__btn-group" variant="text" color="inherit">
            <Button
              className="container__btn"
              sx={{
                borderRight: (theme: Theme) =>
                  `1px solid ${theme.palette.neutralVariant.outline} !important`,
              }}
              onClick={() => sliderMove('PREV')}
              disabled={page === 1}
            >
              <ChevronLeft
                sx={{
                  color: (theme: Theme) => theme.palette.text.primary,
                }}
              />
            </Button>
            <Button onClick={() => sliderMove('NEXT')} disabled={page === totalPages}>
              <ChevronRight
                sx={{
                  color: (theme: Theme) => theme.palette.text.primary,
                }}
              />
            </Button>
          </ButtonGroup>
        </Box>
      </Header>
      <Body
      // onMouseDown={handleMouseDown}
      // onMouseUp={handleMouseUp}
      // onMouseMove={handleMouseMove}
      // onMouseLeave={handleMouseLeave}
      >
        <Clusters
          onClusterClick={onClusterClick}
          isLoadingCluster={loading}
          errorCluster={null}
          refetchCluster={() => {}}
          clusterData={clustersData?.clusterData}
          speedometersData={clustersData?.speedometersData ?? {}}
          tableDataWeek={clustersData?.tableDataWeek ?? {}}
          tableDataMonth={clustersData?.tableDataMonth ?? {}}
          tableDataYear={clustersData?.tableDataYear ?? {}}
          selectedClusterSortName={selectedClusterSort?.label}
          selectedClusterSortDirection={selectedClusterSortDirection?.dir}
          page={page}
          pageSize={isFullScreen ? 5 : 3}
        />
      </Body>
    </>
  );
};

export const ClustersParent = memo(ClustersParentComponent);
