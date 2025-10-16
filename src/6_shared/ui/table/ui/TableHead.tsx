import { TableHead as MuiTableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';

import { Order, TableLabel } from '../model';
import { TableHeadCell } from './Table.styled';

interface TableHeadProps {
  labels: TableLabel[];
  order?: Order;
  orderBy?: symbol | string | number;
  sortable?: boolean;
  sortLabel?: boolean;
  withTooltip?: boolean;
  onHeadCellClick?: (event: React.MouseEvent<unknown>, itemId: any) => void;
}

export const TableHead = ({
  order,
  orderBy,
  onHeadCellClick,
  labels,
  sortable = false,
  sortLabel = true,
  withTooltip = false,
}: TableHeadProps) => {
  return (
    <MuiTableHead>
      {sortLabel && (
        <TableRow>
          {labels.map((label) => (
            <TableHeadCell
              key={label.key}
              align={label.align || 'left'}
              sortDirection={orderBy === label.key ? order : false}
            >
              {withTooltip ? (
                <Tooltip title={label.title} placement="top">
                  <TableSortLabel
                    active={orderBy === label.key}
                    direction={sortable && orderBy === label.key ? order : undefined}
                    onClick={(e: React.MouseEvent<HTMLElement>) => onHeadCellClick?.(e, label.key)}
                    hideSortIcon={!sortable}
                    IconComponent={ArrowDropDownRounded}
                    sx={{
                      cursor: sortable ? 'pointer' : 'default',
                    }}
                  >
                    {label.title}
                  </TableSortLabel>
                </Tooltip>
              ) : (
                <TableSortLabel
                  active={orderBy === label.key}
                  direction={sortable && orderBy === label.key ? order : undefined}
                  onClick={(e: React.MouseEvent<HTMLElement>) => onHeadCellClick?.(e, label.key)}
                  hideSortIcon={!sortable}
                  IconComponent={ArrowDropDownRounded}
                  sx={{
                    cursor: sortable ? 'pointer' : 'default',
                  }}
                >
                  {label.title}
                </TableSortLabel>
              )}
            </TableHeadCell>
          ))}
        </TableRow>
      )}
      {!sortLabel && (
        <TableRow>
          {labels.map((label) =>
            withTooltip ? (
              <Tooltip title={label.title} placement="top" key={label.key}>
                <TableHeadCell
                  align={label.align || 'left'}
                  sortDirection={orderBy === label.key ? order : false}
                  onClick={(e) => onHeadCellClick?.(e, label.key)}
                >
                  {label.title}
                </TableHeadCell>
              </Tooltip>
            ) : (
              <TableHeadCell
                key={label.key}
                align={label.align || 'left'}
                sortDirection={orderBy === label.key ? order : false}
                onClick={(e) => onHeadCellClick?.(e, label.key)}
              >
                {label.title}
              </TableHeadCell>
            ),
          )}
        </TableRow>
      )}
    </MuiTableHead>
  );
};
