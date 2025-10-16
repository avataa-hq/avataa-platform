import { memo, useMemo, useState } from 'react';
import {
  ArcProgress,
  ContextMenu,
  IColorRangeModel,
  IRangeModel,
  ISpeedometerData,
  useDashboardBasedHierarchy,
} from '6_shared';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { AggregationType } from '6_shared/api/clickhouse/constants';
import { TooltipData } from '2_pages/dashboardBasedHierarchy/lib/useGetMainSpeedometersData';
import { getColorByValue } from '2_pages/dashboardBasedHierarchy/lib/getColorByValue';

interface IProps {
  rootSpeedometersData?: { [event: string]: { [nodeKey: string]: ISpeedometerData } } | null;
  loading?: boolean;
  hierarchyLevels: HierarchyLevel[];
  tooltipData?: TooltipData;
  eventCustomNames?: Record<string, string>;
  currentHierarchyLevelId?: number | null;
  currentColorRangesData?: IColorRangeModel | null;
}

interface ISpeedometerDataWithLevel extends ISpeedometerData {
  level: number;
  color: string;
}

const OperatorsSpeedometersComponent = ({
  rootSpeedometersData,
  loading,
  hierarchyLevels,
  tooltipData,
  eventCustomNames,
  currentHierarchyLevelId,
  currentColorRangesData,
}: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mainSpeedometerAggregationType, setMainSpeedometerAggregationType } =
    useDashboardBasedHierarchy();

  const outputArray: ISpeedometerDataWithLevel[] = useMemo(() => {
    if (!rootSpeedometersData) return [];

    const hierarchyMap = new Map();
    hierarchyLevels.forEach((item) => hierarchyMap.set(String(item.id), item));

    return Object.keys(rootSpeedometersData).map((key: string) => {
      const value = rootSpeedometersData[key].root;
      const levelData = hierarchyMap.get(key);

      return {
        ...value,
        name: levelData?.name || value.name,
        level: levelData?.level || 1000,
        color: getColorByValue(
          value?.value ? +value.value : 0,
          currentColorRangesData?.ranges as IRangeModel,
        ),
      };
    });
  }, [rootSpeedometersData, hierarchyLevels, currentColorRangesData?.ranges]);

  const sortedOutputArray = outputArray.sort((a, b) => a.level - b.level);

  const onContextMenuItemClick = (item: string) => {
    setMainSpeedometerAggregationType(item as AggregationType);
    setAnchorEl(null);
  };

  // sortedOutputArray
  return sortedOutputArray?.map((spd, index) => {
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
            valueUnit: spd?.unit,
            description: spd?.description,
            valueDecimals: spd.numberOfDecimals,
          }}
          backgroundColor={spd.color}
          additionalValue={spd.additionalValue}
          icon={{ type: spd.icon, color: spd.iconColor, direction: spd.directionValue }}
          name={spd.name}
          numberOfDecimals={spd.numberOfDecimals}
        />
        <ContextMenu
          placement="bottom"
          selectedItem={mainSpeedometerAggregationType}
          isOpen={!!anchorEl}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          menuItems={['AVG', 'SUM']}
          onContextMenuItemClick={onContextMenuItemClick}
          sx={{ top: '-10% !important' }}
        />
      </div>
    );
  });
};

export const OperatorsSpeedometers = memo(OperatorsSpeedometersComponent);
