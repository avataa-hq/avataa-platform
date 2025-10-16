import { memo, useRef } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { Box, createFormatter, ISpeedometerData, truncateString, useResize } from '6_shared';
import useGetIcon from '../useGetIcon';
import { TableContainer, TableRow, TableRowItem, TableRowItemName } from './Table.styled';

interface IMergedTableData {
  [key: string]: {
    week: ISpeedometerData;
    month: ISpeedometerData;
    year: ISpeedometerData;
    direction: string;
  };
}

interface IProps {
  tableData: IMergedTableData;
}

type InitialValueType = number | string | undefined;

const iconDirection = (
  initialValue: InitialValueType,
  value: InitialValueType,
  direction: string,
) => {
  if (
    initialValue !== undefined &&
    value !== undefined &&
    typeof value !== 'string' &&
    typeof initialValue !== 'string'
  ) {
    if (initialValue < value) {
      return { direction: 'UP', color: direction === 'up' ? 'GREEN' : 'RED' };
    }

    if (initialValue === value) {
      return { direction: 'STABLE', color: 'YELLOW' };
    }
  }

  return { direction: 'DOWN', color: direction === 'down' ? 'GREEN' : 'RED' };
};

const TableItem = ({
  value,
  initialValue,
  getIcon,
  direction,
  numberOfDecimals,
}: {
  value: number | string | undefined;
  initialValue: number | string | undefined;
  getIcon: (direction: string, color: string, isNoData?: boolean) => JSX.Element;
  direction: string;
  numberOfDecimals?: number;
}) => {
  const { direction: iconDir, color } = iconDirection(initialValue, value, direction);
  let initVal: number | string | undefined = initialValue;

  let val = value;

  const formatter = createFormatter(numberOfDecimals ?? 2);
  if (typeof value === 'number' || (typeof value === 'string' && !Number.isNaN(+value))) {
    val = +formatter.format(+value);
  }
  if (
    typeof initialValue === 'number' ||
    (typeof initialValue === 'string' && !Number.isNaN(+initialValue))
  ) {
    initVal = formatter.format(+initialValue);
  }

  return (
    <TableRowItem>
      <Tooltip
        followCursor
        title={
          <>
            <div>Previous: {initVal ?? 'N/A'}</div>
            <div>Current: {val ?? 'N/A'}</div>
          </>
        }
      >
        <Box
          sx={{
            position: 'relative',
            width: '2rem',
            height: '1.5rem',
            overflow: 'hidden',
          }}
        >
          {getIcon(iconDir, color, typeof val === 'string')}
        </Box>
      </Tooltip>
    </TableRowItem>
  );
};

const TableComponent = ({ tableData }: IProps) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const title = ['Week', 'Month', 'Year'];
  const { getFontSize } = useResize({ childRef });
  const setIcon = useGetIcon({ getFontSize });

  return (
    <TableContainer ref={childRef}>
      <TableRow>
        <TableRowItemName />
        {title.map((item) => (
          <TableRowItem key={item}>
            <Typography
              sx={{
                fontSize: getFontSize(80),
              }}
            >
              {item}
            </Typography>
          </TableRowItem>
        ))}
      </TableRow>
      {Object.entries(tableData).map(([key, { week, month, year, direction }]) => (
        <TableRow key={key}>
          <Tooltip title={key}>
            <TableRowItemName>
              <Typography
                sx={{
                  fontSize: getFontSize(80),
                }}
                align="left"
              >
                {truncateString(key, 11)}
              </Typography>
            </TableRowItemName>
          </Tooltip>

          <TableItem
            value={week?.value}
            initialValue={week?.initialValue ?? 0}
            getIcon={setIcon}
            direction={week?.directionValue ?? direction}
            numberOfDecimals={week?.numberOfDecimals}
          />
          <TableItem
            value={month?.value}
            initialValue={month?.initialValue ?? 0}
            getIcon={setIcon}
            direction={month?.directionValue ?? direction}
            numberOfDecimals={week?.numberOfDecimals}
          />
          <TableItem
            value={year?.value}
            initialValue={year?.initialValue ?? 0}
            getIcon={setIcon}
            direction={year?.directionValue ?? direction}
            numberOfDecimals={week?.numberOfDecimals}
          />
        </TableRow>
      ))}
    </TableContainer>
  );
};

export const Table = memo(TableComponent);
