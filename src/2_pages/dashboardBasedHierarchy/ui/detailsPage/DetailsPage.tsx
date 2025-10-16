import { useCallback, useMemo, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { Divider, Switch, Typography } from '@mui/material';
import { useGetPalettesQuery } from '2_pages/dashboardBasedHierarchy/lib/useGetPalettesQuery';
import { ColorLineIndicator } from '3_widgets';
import { Information } from '5_entites';
import {
  ArcProgress,
  DBHHierarchyModel,
  InventoryAndHierarchyObjectTogether,
  ISpeedometerData,
  LevelSettings,
  useDashboardBasedHierarchy,
} from '6_shared';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { ChildCountType } from '6_shared/api/clickhouse/types';
import { useGetChartData } from '2_pages/dashboardBasedHierarchy/lib/chart/useGetChartData';
import { getEventsName } from '2_pages/dashboardBasedHierarchy/lib/getEventsName';
import {
  DetailsPageStyled,
  TopContainer,
  TopContainerHead,
  TopContainerBody,
  TopContainerBodyLeft,
  TopContainerBodyRight,
  BottomContainer,
  BottomContainerBody,
  BottomContainerHead,
} from './DetailsPage.styled';
import { Priority } from '../priority/Priority';
import { Solution } from '../solution/Solution';
import { dispatchNewHierarchyAndChangeLeftAreaType } from '../../lib/dispatchNewHierarchyAndChangeLeftAreaType';
import { useGetInformationData } from '../../lib/useGetInformationData';
import { useGetSolutionData } from '../../lib/useGetSolutionData';
import { useEventsData } from '../../lib/useEventData';
import { Chart } from '../chart/Chart';
import { useKpiGroupData } from '../../lib/hooks/useKpiGroupData';
import { KpiGroupIndicator } from './KpiGroupIndicator/KpiGroupIndicator';

interface IProps {
  selectedHierarchy?: DBHHierarchyModel | null;
  selectHierarchyNodeObject?: InventoryAndHierarchyObjectTogether | null;
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  hierarchyLevels: HierarchyLevel[];

  dateRange: DateRange<Dayjs>;
  currentHierarchyLevelId: number | null;

  childCount?: ChildCountType[];
  currentLevelKpiSettings?: LevelSettings;
  parentNodeLevelKpiSettings?: LevelSettings;

  isFullScreen?: boolean;
}

export const DetailsPage = ({
  selectedHierarchy,
  selectHierarchyNodeObject,
  hierarchyInventoryObjects,
  dateRange,
  hierarchyLevels,
  currentHierarchyLevelId,
  childCount,
  currentLevelKpiSettings,
  parentNodeLevelKpiSettings,

  isFullScreen,
}: IProps) => {
  const [isChart, setIsChart] = useState(true);

  const {
    selectedEventColumn,
    topLevelAggregationKPIData,
    setHierarchyBreadcrumbs,
    setLeftAreaType,
    setCurrentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const isReal = useMemo(() => {
    if (!hierarchyLevels || !selectHierarchyNodeObject) return false;
    // const isVirtual = hierarchyLevels.find(
    //   (lvl) => String(lvl.id) === String(selectHierarchyNodeObject?.level_id ?? ''),
    // )?.is_virtual;
    const isVirtual = selectHierarchyNodeObject.child_count === 0;
    return !(isVirtual ?? true);
  }, [hierarchyLevels, selectHierarchyNodeObject]);

  const bottomEventKeys = useMemo(() => {
    return Object.values(currentLevelKpiSettings?.bottom_kpis ?? {}).map((kpi: any) => kpi.ID);
  }, [currentLevelKpiSettings]);

  const allEventsKeysByParent = useMemo(() => {
    return getEventsName(
      parentNodeLevelKpiSettings?.clickhouse_settings?.events,
      false,
      true,
    ) as string[];
  }, [parentNodeLevelKpiSettings?.clickhouse_settings?.events]);

  const localObjectId = useMemo(() => {
    return selectHierarchyNodeObject ? [selectHierarchyNodeObject.key] : [];
  }, [selectHierarchyNodeObject]);

  const localLevelId = useMemo(() => {
    return selectHierarchyNodeObject?.parent_level_id
      ? +selectHierarchyNodeObject.parent_level_id
      : undefined;
  }, [selectHierarchyNodeObject]);

  const { speedometersData, loading: isLoadingSpeedometers } = useEventsData({
    dateRange,
    objIds: localObjectId,
    eventType: 'main_kpis',
    withPrevious: true,
    levelID: localLevelId,
  });

  // const { speedometersData: circleLightsData } = useEventsData({
  //   dateRange,
  //   objIds: localObjectId,
  //   withPrevious: false,
  //   eventType: 'bottom_kpis',
  // });

  const { colorRangesData } = useGetPalettesQuery({
    tmo_ids:
      selectedHierarchy?.hierarchy_id && currentHierarchyLevelId
        ? [`${selectedHierarchy.hierarchy_id}-${currentHierarchyLevelId}`]
        : undefined,
    tprm_ids: bottomEventKeys,
    is_default: true,
  });

  const { colorRangesData: kolbasaColorData } = useGetPalettesQuery({
    tmo_ids:
      selectedHierarchy?.hierarchy_id && localLevelId
        ? [`${selectedHierarchy.hierarchy_id}-${localLevelId}`]
        : undefined,
    tprm_ids: selectedEventColumn
      ? [selectedEventColumn.value, ...allEventsKeysByParent]
      : allEventsKeysByParent,
  });

  const { chartData, selectedKpi, currentKpiData, prevKpiData } = useGetChartData({
    selectedEvent: selectedEventColumn,
    levelKpiSettings: parentNodeLevelKpiSettings,
    selectHierarchyNodeObject,
    dateRange,
  });

  const currentKolbasaColorRangesData = useMemo(() => {
    if (!selectedHierarchy?.hierarchy_id || localLevelId == null) return null;
    const key = `${selectedHierarchy.hierarchy_id}-${localLevelId}`;
    const res =
      kolbasaColorData?.find(
        (cd) => cd.tmoId === key && cd.tprmId === selectedEventColumn?.value,
      ) ?? null;
    return res;
  }, [kolbasaColorData, localLevelId, selectedEventColumn?.value, selectedHierarchy?.hierarchy_id]);

  // const cirleLightDataToRender = useMemo(() => {
  //   const kpiNames = Object.keys(circleLightsData ?? {});
  //
  //   const res: ICircleChainData[] = [];
  //
  //   kpiNames?.forEach((kpiName, idx) => {
  //     const kpiInfo = Object.values(circleLightsData?.[kpiName ?? ''])?.[0];
  //     if (!kpiInfo) return;
  //     const { value, minValue, maxValue, numberOfDecimals } = kpiInfo;
  //     const min = +(minValue ?? 0);
  //     const max = maxValue ?? 10;
  //     const correctValue = value != null ? Math.min(+value, max) : null;
  //
  //     if (correctValue === null) return;
  //
  //     const radius = Math.max(1, Math.round((correctValue / (max - min)) * 10));
  //
  //     const palette = colorRangesData?.find((el) => el.tprmId === kpiInfo.key);
  //     let color: string = theme.palette.primary.dark;
  //     if (palette?.ranges && typeof value === 'number') {
  //       const interval = getInterval(+value, palette?.ranges?.values);
  //       const val = palette?.ranges?.colors[interval];
  //       color = val?.hex;
  //     }
  //     res.push({
  //       color,
  //       id: idx,
  //       r: radius,
  //       name: kpiInfo?.name ?? '',
  //       value: Number((kpiInfo?.value != null ? +kpiInfo.value : 0).toFixed(numberOfDecimals ?? 2)),
  //     });
  //   });
  //   return res;
  // }, [circleLightsData, colorRangesData, theme]);

  const { informationResultData } = useGetInformationData({
    selectHierarchyNodeObject,
    hierarchyInventoryObjects,
  });

  const { solutionData } = useGetSolutionData({
    hierarchyInventoryObjects,
    dateRange,
    isReal,
    currentHierarchyLevelId: currentHierarchyLevelId ?? 0,
    childCount,
  });

  const speedometersResultData = useMemo(() => {
    const outputArray: ISpeedometerData[] = [];

    Object.keys(speedometersData ?? {}).forEach((key: string) => {
      const value = speedometersData[key][selectHierarchyNodeObject?.key ?? ''];

      if (value) {
        const savedAggregationData = topLevelAggregationKPIData[value.key ?? ''];
        if (savedAggregationData) {
          const newValue = {
            ...value,
            additionalValue: {
              min: savedAggregationData.min,
              max: savedAggregationData.max,
              value: savedAggregationData.value,
            },
          };
          outputArray.push(newValue);
        } else {
          outputArray.push(value);
        }
      }
    });
    return outputArray;
  }, [selectHierarchyNodeObject?.key, speedometersData, topLevelAggregationKPIData]);

  const onSolutionRowClick = useCallback(
    (row: InventoryAndHierarchyObjectTogether) => {
      dispatchNewHierarchyAndChangeLeftAreaType(
        setHierarchyBreadcrumbs,
        setLeftAreaType,
        setCurrentHierarchyLevelId,
        row,
        hierarchyLevels,
      );
    },
    [hierarchyLevels],
  );

  const handleIsChartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChart(event.target.checked);
  };

  const { groupData, defaultKpiData } = useKpiGroupData({
    levelKpiSettings: parentNodeLevelKpiSettings,
    objectKeys: localObjectId,
    dateRange,
    colorRangesData: kolbasaColorData,
    hierarchyId: selectedHierarchy?.hierarchy_id,
    levelId: localLevelId,
  });

  return (
    <DetailsPageStyled>
      <div
        style={{
          width: isFullScreen ? '50%' : '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopContainer>
          <TopContainerHead>
            {isFullScreen && defaultKpiData && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ height: '80%' }}>
                  <ArcProgress
                    simple
                    type="circle"
                    imageUrl={defaultKpiData.imageUrl}
                    {...defaultKpiData.progressData}
                  />
                </div>

                <div style={{ width: '90%', height: '20%' }}>
                  <ColorLineIndicator {...defaultKpiData.coloredLineData} />
                </div>
              </div>
            )}

            {!isFullScreen &&
              speedometersResultData?.map((spd, index) => {
                return (
                  <div key={index} style={{ height: '100%' }}>
                    <ArcProgress
                      value={{
                        value: spd.value ? +spd.value : 0,
                        min: spd.minValue ? +spd.minValue : 0,
                        max: spd.maxValue ? +spd.maxValue : 100,
                        prevValue: spd.initialValue ? +spd.initialValue : 0,
                        label: spd.name,
                        tickMarks: spd.ticks,
                        valueUnit: spd.unit,
                        valueDecimals: spd.numberOfDecimals,
                        description: spd.description,
                      }}
                      additionalValue={spd.additionalValue}
                      icon={{
                        type: spd.icon,
                        color: spd.iconColor,
                        direction: spd.directionValue,
                      }}
                      name={spd.name}
                      numberOfDecimals={spd.numberOfDecimals}
                    />
                  </div>
                );
              })}
          </TopContainerHead>
          <TopContainerBody>
            <TopContainerBodyLeft>
              <Information siteInformationData={informationResultData} />
            </TopContainerBodyLeft>
            <TopContainerBodyRight>
              <Priority
                dateRange={dateRange}
                selectHierarchyNodeObject={selectHierarchyNodeObject}
                colorRangesData={colorRangesData}
                coloredLineColorData={currentKolbasaColorRangesData}
                selectedEvent={selectedEventColumn}
                currentKpiData={currentKpiData}
                prevKpiData={prevKpiData}
                selectedKPI={selectedKpi}
                granularity={parentNodeLevelKpiSettings?.clickhouse_settings?.granularity}
              />
            </TopContainerBodyRight>
          </TopContainerBody>
        </TopContainer>
        {isReal && (
          <BottomContainer>
            <BottomContainerHead>
              <Typography>Table</Typography>
              <Switch
                checked={isChart}
                onChange={handleIsChartChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <Typography>Chart</Typography>
            </BottomContainerHead>
            <BottomContainerBody sx={{ height: '90%' }}>
              {isChart && (
                <Chart chartData={chartData} currentHierarchyLevelId={currentHierarchyLevelId} />
              )}
              {!isChart && (
                <Solution
                  onSolutionRowClick={onSolutionRowClick}
                  solutionData={solutionData ?? []}
                />
              )}
            </BottomContainerBody>
          </BottomContainer>
        )}
        {!isReal && (
          <BottomContainer>
            <BottomContainerBody sx={{ height: '100%' }}>
              <Chart chartData={chartData} currentHierarchyLevelId={currentHierarchyLevelId} />
            </BottomContainerBody>
          </BottomContainer>
        )}
      </div>
      {isFullScreen && (
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          {Object.keys(groupData ?? {}).length === 0 && <KpiGroupIndicator data={[]} />}
          {groupData &&
            groupData?.map((item) => (
              <div key={item.group}>
                <div>
                  <Typography variant="h1" color="primary">
                    {item.group}
                  </Typography>
                  <Divider sx={{ width: '40%', my: 1 }} />
                </div>
                <KpiGroupIndicator data={item.indicatorData} />
              </div>
            ))}
        </div>
      )}
    </DetailsPageStyled>
  );
};
