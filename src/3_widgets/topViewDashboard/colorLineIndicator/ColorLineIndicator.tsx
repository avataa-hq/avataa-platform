import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { IColoredLineData } from '6_shared';
import { Typography } from '@mui/material';
import { zoomies } from 'ldrs';
import { DateRange } from '@mui/x-date-pickers-pro';
import { InsideIcon } from '../../../6_shared/ui/arcProgress/ui/InsideIcon';
import { IArcProgressIcon } from '../../../6_shared/ui/arcProgress/types';

// Default values shown

import { ColorLineIndicatorStyled } from './ColorLineIndicator.styled';
import { ColoredCanvasLine } from '../../../6_shared/ui/coloredLine/ColoredCanvasLine';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

zoomies.register();

const getGroupedDataByMonths = (data: IColoredLineData[]) => {
  return data.reduce((acc, item) => {
    const month = dayjs(item.date).month();
    if (acc[month]) acc[month].push(item);
    else acc[month] = [item];
    return acc;
  }, {} as Record<number, IColoredLineData[]>);
};

const distributedDataBy12Months = (dates: IColoredLineData[]) => {
  const groupByMonth = getGroupedDataByMonths(dates);
  const result: IColoredLineData[][] = [];

  for (let i = 0; i < 12; i++) {
    const monthData = groupByMonth[i];
    if (monthData) {
      result.push(monthData);
    } else {
      result.push(Array(1).fill(null));
    }
  }
  return result;
};

interface IColorLineIndicatorProps {
  data?: IColoredLineData[];
  title?: string;
  icon?: IArcProgressIcon;
  isLoading?: boolean;
  onColoredLineClick?: (objectName?: string) => void;
  dateRange?: DateRange<Dayjs> | [null, null];
}
export const ColorLineIndicator = ({
  data,
  title,
  icon,
  isLoading,
  onColoredLineClick,
  dateRange,
}: IColorLineIndicatorProps) => {
  const linesData = useMemo(() => {
    return distributedDataBy12Months(data ?? []);
  }, [data]);
  const [currentMonths, setCurrentMonths] = useState<string[]>(monthNames);

  const dataByDateRange = useMemo(() => {
    if (!dateRange) return linesData;
    const [start, end] = dateRange;
    if (!start || !end) return linesData;

    const isDifferentYears = start.year() !== end.year();
    if (isDifferentYears) {
      setCurrentMonths(monthNames);
      return linesData;
    }

    const result = [];
    let current = start.startOf('month');

    while (current.isBefore(end) || current.isSame(end, 'month')) {
      result.push(current.format('YYYY-MM'));
      current = current.add(1, 'month');
    }
    const groupByMonth = getGroupedDataByMonths(data ?? []);

    const monthSet = new Set<string>();

    const dataResult = result.map((date) => {
      const monthCount = dayjs(date).get('month');
      monthSet.add(monthNames[monthCount]);

      const monthData = groupByMonth[dayjs(date).month()];
      if (monthData) {
        return monthData;
      }
      return Array(1).fill(null);
    });

    setCurrentMonths(Array.from(monthSet));

    return dataResult;
  }, [data, dateRange, linesData]);

  return (
    <ColorLineIndicatorStyled>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {title && (
          <Typography color="primary" align="center" variant="h3">
            {title}
          </Typography>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '25px',
          position: 'relative',
        }}
      >
        {icon && (
          <svg viewBox="0 0 20 20" width={20} height={20}>
            <InsideIcon type={icon?.type ?? 'stable'} color={icon?.color} x={10} y={10} size={10} />
          </svg>
        )}

        <div style={{ width: '100%' }}>
          <ColoredCanvasLine
            data={dataByDateRange}
            onCanvasClick={() => onColoredLineClick?.(title)}
            currentMonthsNames={currentMonths}
          />
        </div>
      </div>
    </ColorLineIndicatorStyled>
  );
};
