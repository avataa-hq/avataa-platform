import {
  CollapseButton,
  DBHHierarchyModel,
  IMapInitialViewState,
  InventoryAndHierarchyObjectTogether,
  KpiSettings,
  LoadingAvataa,
  moduleSettingsApi,
  searchApiV2,
  useConfig,
  useDashboardBasedHierarchy,
  useGetClickhouseChildCountByParent,
  useGetClickhouseMaxDate,
  useGetClickhouseObjectsByParent,
} from '6_shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useGetObjectsBySearchValue } from '4_features';
import { LeftArea } from './leftArea/LeftArea';
import {
  DashboardBasedHierarchyStyled,
  LoadingContainer,
  RightArea,
} from './DashboardBasedHierarchy.styled';
import { NetworkMap } from './rightArea';
import { useKpiDataByLevel } from '../lib/hooks/useKPIDataByLevel';
import { useLevelsData } from '../lib/hooks/useLevelsData';
import { dispatchNewHierarchyAndChangeLeftAreaType } from '../lib/dispatchNewHierarchyAndChangeLeftAreaType';
import { QATAR_COORDINATES } from '../../../6_shared/ui/map/deckGlMap/config';

const { useGetHierarchyAndInventoryResultsQuery, useLazyFindMoIdInHierarchiesQuery } = searchApiV2;
const { useGetModuleSettingsQuery } = moduleSettingsApi;

const DashboardBasedHierarchy = () => {
  const {
    selectedHierarchy,
    selectHierarchyNodeObject,
    hierarchyLevels,
    searchDashboard,
    dateRange,
    currentHierarchyLevelId,
    setKpiData,
    setSelectedHierarchy,
    setDateRange,
    setHierarchyBreadcrumbs,
    setLeftAreaType,
    setCurrentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const [findHierarchyByMoIds, { isFetching: isFetchingFindHierarchyObject }] =
    useLazyFindMoIdInHierarchiesQuery();

  const { data: moduleSettings, isLoading: isModuleSettingsLoading } =
    useGetModuleSettingsQuery('Dashboard');

  const [hierarchyObjectKeys, setHierarchyObjectKeys] = useState<string[]>([]);
  const [isLeftSideOpen, setIsLeftSideOpen] = useState(true);
  const [isRightSideOpen, setIsRightSideOpen] = useState(true);
  const [viewType, setViewType] = useState<'map' | 'tree'>('tree');

  const [hierarchies, setHierarchies] = useState<DBHHierarchyModel[]>([]);

  const hierarchy_id = selectHierarchyNodeObject?.hierarchy_id ?? selectedHierarchy?.hierarchy_id;
  const parent_node_id = selectHierarchyNodeObject?.id ?? 'root';
  const parent_level_Id =
    selectHierarchyNodeObject?.parent_level_id != null
      ? +selectHierarchyNodeObject.parent_level_id
      : -1;

  const { isFetchingHierarchyLevels, levelsObjectTypeIds } = useLevelsData({
    moduleSettings,
    hierarchyID: selectedHierarchy?.hierarchy_id,
  });

  const {
    currentLevelKpiSettings,
    parentNodeLevelKpiSettings,
    selectedHierarchyNodeObjectLevelKpiSettings,
    selectedHierarchyNodeObjectChildLevelKpiSettings,
  } = useKpiDataByLevel({
    moduleSettings,
    hierarchyID: selectedHierarchy?.hierarchy_id,
    selectedHierarchyNodeObject: selectHierarchyNodeObject,

    currentLevelId: currentHierarchyLevelId,
    parentLevelId: parent_level_Id,
  });

  useEffect(() => {
    const kpiSettings = moduleSettings?.settings?.['KPI Settings'];
    if (kpiSettings) setKpiData(kpiSettings as KpiSettings);
  }, [moduleSettings?.settings]);

  useEffect(() => {
    if (!moduleSettings?.settings?.Hierarchies) return;

    const { All } = moduleSettings.settings.Hierarchies;

    const correctHierarchy = All?.map((h) => ({
      key: h.name,
      hierarchy_id: +h.id,
      parent_id: 'root',
    }));
    setHierarchies(correctHierarchy);
  }, [moduleSettings?.settings?.Hierarchies]);

  useEffect(() => {
    if (!selectedHierarchy && moduleSettings?.settings?.Hierarchies?.Default) {
      const { id } = moduleSettings.settings.Hierarchies.Default;

      const defaultHierarchy = hierarchies?.find((i) => +i.hierarchy_id === +id);
      if (defaultHierarchy) setSelectedHierarchy(defaultHierarchy);
    }
  }, [hierarchies, moduleSettings?.settings?.Hierarchies?.Default, selectedHierarchy]);

  const {
    data: hierarchyAndInventoryData,
    isFetching: isFetchingHierarchyAndInventoryData,
    isError,
  } = useGetHierarchyAndInventoryResultsQuery(
    {
      hierarchy_id: hierarchy_id!,
      parent_node_id,
      inventory_res: { return_results: true },
    },
    { skip: !hierarchy_id || selectHierarchyNodeObject?.level_id?.startsWith('10000') },
  );

  const hierarchyAndInventoryObjects = useMemo(() => {
    if (isError) return [];
    return (
      hierarchyAndInventoryData?.hierarchy_results?.objects?.map((hierarchyObject) => {
        const inventoryObject = hierarchyAndInventoryData?.inventory_results?.objects?.find(
          ({ id }) => id === +(hierarchyObject.object_id ?? -1),
        );
        return {
          ...(inventoryObject ?? {}),
          ...hierarchyObject,
          eventValues: {},
        } as InventoryAndHierarchyObjectTogether;
      }) ?? []
    );
  }, [
    hierarchyAndInventoryData?.hierarchy_results?.objects,
    hierarchyAndInventoryData?.inventory_results?.objects,
    isError,
  ]);

  const { inventoryObjectsSearchData, isInventoryObjectsDataFetching } = useGetObjectsBySearchValue(
    {
      searchValue: searchDashboard,
      newOffset: 0,
      tmoIds: levelsObjectTypeIds,
      skip: !searchDashboard || !levelsObjectTypeIds.length,
    },
  );

  const searchValue = useMemo(() => {
    return (inventoryObjectsSearchData?.objects ??
      []) as unknown as InventoryAndHierarchyObjectTogether[];
  }, [inventoryObjectsSearchData?.objects]);

  const { data: childCount, isLoading: isFetchingChildCount } = useGetClickhouseChildCountByParent({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table: selectedHierarchyNodeObjectChildLevelKpiSettings?.clickhouse_object_settings?.table_name,
    objectColumn:
      selectedHierarchyNodeObjectChildLevelKpiSettings?.clickhouse_object_settings?.object_key,
    parentColumn:
      selectedHierarchyNodeObjectChildLevelKpiSettings?.clickhouse_object_settings?.parent_key,
    parentKeys: hierarchyObjectKeys,
    skip: !selectedHierarchyNodeObjectChildLevelKpiSettings,
  });

  const parentKeys = useMemo(() => {
    return selectHierarchyNodeObject?.key ? [selectHierarchyNodeObject.key] : [];
  }, [selectHierarchyNodeObject]);

  const { data: childKeys, isLoading: isFetchingChildKeys } = useGetClickhouseObjectsByParent({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table: selectedHierarchyNodeObjectLevelKpiSettings?.clickhouse_object_settings?.table_name,
    objectColumn:
      selectedHierarchyNodeObjectLevelKpiSettings?.clickhouse_object_settings?.object_key,
    parentColumn:
      selectedHierarchyNodeObjectLevelKpiSettings?.clickhouse_object_settings?.parent_key,
    parentKeys,
    skip: !selectedHierarchyNodeObjectLevelKpiSettings,
  });

  const { maxDate } = useGetClickhouseMaxDate({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    table: currentLevelKpiSettings?.clickhouse_settings?.table_name ?? '',
    dateColumn: currentLevelKpiSettings?.clickhouse_settings?.datetime_column ?? '',
  });

  useEffect(() => {
    if (!maxDate) return;
    const [from, to] = dateRange;
    if (!from && !to) {
      const start = dayjs().startOf('year');
      const end = dayjs(maxDate);

      if (end.isBefore(start)) setDateRange([end, end]);
      else setDateRange([start, end]);
    }
  }, [dateRange, maxDate]);

  const mappedObjects = useMemo(() => {
    const level = hierarchyLevels.find((l) => l.id === currentHierarchyLevelId)?.id || 0;

    if (!childKeys?.length && !parentKeys?.length) return [];
    const res = (childKeys?.length ? childKeys : parentKeys!).map((id: string) => ({
      key: id,
      object_id: 0,
      object_type_id: 0,
      additional_params: '',
      hierarchy_id: hierarchy_id ?? 0,
      level,
      level_id: String(currentHierarchyLevelId ?? ''),
      // parent_level_id: parentLevelId,
      // child_level_id: childLevelId,
      parent_id: parent_node_id,
      latitude: 0,
      longitude: 0,
      child_count: 0,
      id,
    }));
    return res;
  }, [
    hierarchyLevels,
    childKeys,
    parentKeys,
    currentHierarchyLevelId,
    hierarchy_id,
    parent_node_id,
  ]);

  const hierarchyObjects = useMemo(() => {
    if (selectHierarchyNodeObject?.level_id?.startsWith('10000')) {
      return mappedObjects || [];
    }
    if (!hierarchyAndInventoryObjects.length) {
      return selectHierarchyNodeObject ? [selectHierarchyNodeObject] : [];
    }
    return hierarchyAndInventoryObjects;
  }, [selectHierarchyNodeObject, hierarchyAndInventoryObjects, mappedObjects]);

  useEffect(() => {
    if (!hierarchyObjects?.length) return;
    const objKeys = hierarchyObjects.map((obj) => obj.key);
    setHierarchyObjectKeys(objKeys);
  }, [hierarchyObjects]);

  const toggleLeft = () => {
    if (isLeftSideOpen && !isRightSideOpen) {
      setIsLeftSideOpen(false);
      setIsRightSideOpen(true);
    } else {
      setIsLeftSideOpen(!isLeftSideOpen);
    }
  };

  const toggleRight = () => {
    if (isRightSideOpen && !isLeftSideOpen) {
      setIsRightSideOpen(false);
      setIsLeftSideOpen(true);
    } else {
      setIsRightSideOpen(!isRightSideOpen);
    }
  };

  const onSearchResultClick = useCallback(
    async (data: InventoryAndHierarchyObjectTogether) => {
      if (!hierarchy_id) return;
      const res = await findHierarchyByMoIds({ mo_id: data.id }).unwrap();
      const neededHierarchyObject = res.find(
        (obj) => +obj.hierarchy_id === hierarchy_id && Number(obj.object_id) === data.id,
      );
      if (neededHierarchyObject) {
        const item = { ...data, ...neededHierarchyObject } as InventoryAndHierarchyObjectTogether;
        dispatchNewHierarchyAndChangeLeftAreaType(
          setHierarchyBreadcrumbs,
          setLeftAreaType,
          setCurrentHierarchyLevelId,
          item,
          hierarchyLevels,
        );
      }
    },
    [findHierarchyByMoIds, hierarchyLevels, hierarchy_id],
  );

  const isLoading =
    isModuleSettingsLoading ||
    isFetchingHierarchyAndInventoryData ||
    isFetchingChildCount ||
    isFetchingChildKeys ||
    isFetchingHierarchyLevels;

  return (
    <DashboardBasedHierarchyStyled>
      {isLoading && (
        <LoadingContainer>
          <LoadingAvataa />
        </LoadingContainer>
      )}
      <Box
        component="div"
        sx={{
          position: 'relative',
          // eslint-disable-next-line no-nested-ternary
          width: isLeftSideOpen && isRightSideOpen ? '50%' : isLeftSideOpen ? '100%' : '0%',
          transition: 'width 0.3s ease',
        }}
      >
        <CollapseButton isOpen={isLeftSideOpen} onToggle={toggleLeft} placement="right" />
        {isLeftSideOpen && (
          <LeftArea
            hierarchyInventoryObjects={hierarchyAndInventoryObjects}
            childCount={childCount}
            hierarchies={hierarchies}
            currentLevelKpiSettings={currentLevelKpiSettings}
            parentNodeLevelKpiSettings={parentNodeLevelKpiSettings}
            dataMaxDate={maxDate}
            isFullScreen={isLeftSideOpen && !isRightSideOpen}
          />
        )}
      </Box>

      <Box
        component="div"
        sx={{
          position: 'relative',
          // eslint-disable-next-line no-nested-ternary
          width: isLeftSideOpen && isRightSideOpen ? '50%' : isRightSideOpen ? '100%' : '0%',
          transition: 'width 0.3s ease',
          '& .fullscreen > div:first-of-type': {
            paddingLeft: '20px',
          },
        }}
      >
        <CollapseButton isOpen={isRightSideOpen} onToggle={toggleRight} direction="right" />
        {isRightSideOpen && (
          <RightArea>
            <NetworkMap
              hierarchyInventoryObjects={hierarchyAndInventoryObjects}
              searchValues={searchValue}
              viewType={viewType}
              setViewType={setViewType}
              onSearchResultClick={onSearchResultClick}
              isFetchingSearchValues={
                isInventoryObjectsDataFetching || isFetchingFindHierarchyObject
              }
              initialMapState={
                (moduleSettings?.settings?.['Map Settings'] ??
                  QATAR_COORDINATES) as IMapInitialViewState
              }
              isLoading={isLoading}
              currentLevelKpiSettings={currentLevelKpiSettings}
              currentHierarchyId={hierarchy_id}
            />
          </RightArea>
        )}
      </Box>
    </DashboardBasedHierarchyStyled>
  );
};

export default DashboardBasedHierarchy;
