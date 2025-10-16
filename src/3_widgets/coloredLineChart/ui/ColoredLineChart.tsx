import { Skeleton } from '@mui/material';
import { IColoredLineData, InventoryAndHierarchyObjectTogether, GranularityMenu } from '6_shared';
import { useMemo, useState } from 'react';
import { GranularityType } from '6_shared/api/clickhouse/constants';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { Body, ColoredLineChartListItem, ColoredLineChartStyled } from './ColoredLineChart.styled';
import { ColorLineIndicator } from '../../topViewDashboard';

interface IProps {
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  coloredLineChartData?: Record<string, IColoredLineData[]>;
  isLoading?: boolean;
  selectedGranularity?: GranularityType;
  setSelectedGranularity?: (option: GranularityType) => void;
  onColoredLineClick?: (objectName?: string) => void;
  dateRange?: DateRange<Dayjs> | [null, null];
}
export const ColoredLineChart = ({
  hierarchyInventoryObjects,
  coloredLineChartData,
  isLoading,
  selectedGranularity,
  setSelectedGranularity,
  onColoredLineClick,
  dateRange,
}: IProps) => {
  const [menuPosition, setMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleSelectGranularity = (option: GranularityType) => {
    setSelectedGranularity?.(option);
    handleClose();
  };

  const lineList = useMemo(() => {
    return Object.entries(coloredLineChartData ?? {}).map(([key, d], idx) => {
      const inventoryObject = hierarchyInventoryObjects?.find(({ name }) => name === key);
      const label = inventoryObject?.label || key;
      return (
        <ColoredLineChartListItem key={`${key}-${idx}`}>
          <ColorLineIndicator
            data={d}
            title={label}
            onColoredLineClick={onColoredLineClick}
            dateRange={dateRange}
          />
        </ColoredLineChartListItem>
      );
    });
  }, [hierarchyInventoryObjects, coloredLineChartData, onColoredLineClick, dateRange]);

  const skeletons = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7].map((i) => (
      <Skeleton key={i} variant="text" sx={{ fontSize: '1rem' }} />
    ));
  }, []);

  return (
    <ColoredLineChartStyled onContextMenu={handleRightClick}>
      <Body>{isLoading ? skeletons : lineList}</Body>
      <GranularityMenu
        menuPosition={menuPosition}
        handleClose={handleClose}
        selectedGranularity={selectedGranularity ?? 'day'}
        handleSelectGranularity={handleSelectGranularity}
      />
    </ColoredLineChartStyled>
  );
};
