import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  DBHHierarchyModel,
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  MapColumnsSelectData,
  RESPONSIVE_TEXT_CONTAINER_CLASS,
  useDashboardBasedHierarchy,
} from '6_shared';
import { ChildCountType } from '6_shared/api/clickhouse/types';
import {
  DataRangeContainer,
  Header,
  HeaderName,
  HeaderNameContainer,
  LeftAreaStyled,
  SelectContainer,
} from './LeftArea.styled';
import { DateRangeComponent } from '../dateRange/DateRangeComponent';
import { HierarchySelect } from '../hierarchySelect/HierarchySelect';
import { MainPage } from '../mainPage/MainPage';
import { DetailsPage } from '../detailsPage/DetailsPage';

interface IProps {
  hierarchies?: DBHHierarchyModel[];
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  childCount?: ChildCountType[];

  currentLevelKpiSettings?: LevelSettings;
  parentNodeLevelKpiSettings?: LevelSettings;

  dataMaxDate?: string | null;

  isFullScreen?: boolean;
}

export const LeftArea = ({
  hierarchies,
  hierarchyInventoryObjects,
  childCount,
  currentLevelKpiSettings,
  parentNodeLevelKpiSettings,

  dataMaxDate,

  isFullScreen,
}: IProps) => {
  const leftAreaContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    leftAreaType,
    dateRange,
    selectedEventColumn,
    selectedHierarchy,
    hierarchyBreadcrumbs,
    hierarchyLevels,
    selectHierarchyNodeObject,
    currentHierarchyLevelId,
    setLeftAreaType,
    setHierarchyBreadcrumbs,
    setCurrentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const [selectedKPI, setSelectedKPI] = useState<MapColumnsSelectData | undefined>(undefined);

  useEffect(() => {
    if (!selectedKPI && selectedEventColumn) setSelectedKPI(selectedEventColumn);
  }, [selectedEventColumn, selectedKPI]);

  const headerName = useMemo(() => {
    return (
      selectHierarchyNodeObject?.label || selectHierarchyNodeObject?.key || selectedHierarchy?.key
    );
  }, [selectHierarchyNodeObject, selectedHierarchy]);

  const onHeaderButtonClick = useCallback(() => {
    const prevBreadcrumbsEl = hierarchyBreadcrumbs[hierarchyBreadcrumbs.length - 2];

    if (!prevBreadcrumbsEl || prevBreadcrumbsEl?.parent_id === 'root') {
      setLeftAreaType('root');
      setHierarchyBreadcrumbs([]);
    } else {
      setLeftAreaType(
        +prevBreadcrumbsEl.child_count === 0 && prevBreadcrumbsEl.object_id != null
          ? 'real'
          : 'virtual',
      );
      setHierarchyBreadcrumbs(hierarchyBreadcrumbs.slice(0, -1));
    }

    const prevLevelId = prevBreadcrumbsEl?.level_id ? +prevBreadcrumbsEl.level_id : null;

    if (prevLevelId) {
      setCurrentHierarchyLevelId(prevLevelId);
    } else {
      const firstLevelIdFromList = hierarchyLevels?.[0]?.id;
      if (firstLevelIdFromList != null) {
        setCurrentHierarchyLevelId(+firstLevelIdFromList);
      }
    }
  }, [hierarchyBreadcrumbs, hierarchyLevels]);

  return (
    <LeftAreaStyled ref={leftAreaContainerRef} className={RESPONSIVE_TEXT_CONTAINER_CLASS}>
      <Header>
        <DataRangeContainer>
          <DateRangeComponent dataMaxDate={dataMaxDate} />
        </DataRangeContainer>

        {leftAreaType !== 'root' && (
          <HeaderNameContainer>
            <Tooltip title={headerName}>
              <HeaderName>{headerName}</HeaderName>
            </Tooltip>
          </HeaderNameContainer>
        )}

        <SelectContainer>
          <HierarchySelect hierarchies={hierarchies} />
        </SelectContainer>
        {leftAreaType !== 'root' && (
          <Box>
            <IconButton onClick={onHeaderButtonClick}>
              {hierarchyBreadcrumbs.length <= 1 && <CloseIcon />}
              {hierarchyBreadcrumbs.length > 1 && <ArrowBackIcon />}
            </IconButton>
          </Box>
        )}
      </Header>

      {leftAreaType === 'root' && (
        <MainPage
          dateRange={dateRange}
          selectedEventColumn={selectedEventColumn}
          hierarchyLevels={hierarchyLevels}
          currentHierarchyLevelId={currentHierarchyLevelId}
          selectedHierarchy={selectedHierarchy}
          currentLevelKpiSettings={currentLevelKpiSettings}
          isFullScreen={isFullScreen}
          hierarchyInventoryObjects={hierarchyInventoryObjects}
        />
      )}
      {leftAreaType !== 'root' && (
        <DetailsPage
          selectedHierarchy={selectedHierarchy}
          dateRange={dateRange}
          hierarchyInventoryObjects={hierarchyInventoryObjects}
          selectHierarchyNodeObject={selectHierarchyNodeObject}
          hierarchyLevels={hierarchyLevels}
          currentHierarchyLevelId={currentHierarchyLevelId}
          childCount={childCount}
          currentLevelKpiSettings={currentLevelKpiSettings}
          parentNodeLevelKpiSettings={parentNodeLevelKpiSettings}
          isFullScreen={isFullScreen}
        />
      )}
    </LeftAreaStyled>
  );
};
