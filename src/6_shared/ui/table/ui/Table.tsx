import { ReactNode, useState, MouseEvent, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import { MenuItemProps, Typography } from '@mui/material';

import { LoadingAvataa, ActionTypes, ErrorPage, useTranslate } from '6_shared';

import { getTableLabelsFromColumns, getTableLabelsFromData, stableSort } from '../lib';
import { Order, TableColumn, TableData } from '../model';
import { TableHead } from './TableHead';
import { TableToolbar } from './TableToolbar';
import {
  TableWrapper,
  TableContainer,
  TableCell,
  TableRow,
  LoadingContainer,
} from './Table.styled';
import { ContextMenu } from '../../contextMenu';

interface IContextMenu<T = Record<string, any>> {
  disabled?: boolean;
  contextMenuItems?: (string | { title: string; disabled?: boolean; props?: MenuItemProps })[];
  onRowContextMenuItemClick?: (menuItem: string, row: T | null) => void;
}

interface TableProps<T = Record<string, any>> {
  tableData: TableData<T> | undefined;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  exceptions?: string[];
  toolbar?: ReactNode;
  title?: string;
  sortable?: boolean;
  sortLabel?: boolean;
  withTooltip?: boolean;
  initialOrderBy?: keyof T;
  initialOrder?: Order;
  columns?: TableColumn<T>[];
  hasPagination?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRowClick?: (event: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>, row: T) => void;
  contextMenu?: IContextMenu<T> | ((row: T | null) => IContextMenu<T>);
  permissions?: Record<ActionTypes, boolean>;
  setPagination?: ({ offset, limit }: { offset: number; limit: number }) => void;
  setSortOrder?: (sort: 'asc' | 'desc') => void;
  totalCount?: number;
  tablePage?: number;
  handleTablePage?: (page: number) => void;
}

// eslint-disable-next-line react/function-component-definition
export function Table<T extends Record<string, any>>({
  title,
  initialRowsPerPage = 15,
  tableData = [],
  exceptions,
  columns,
  hasPagination = false,
  rowsPerPageOptions = [15, 30, 50, 100],
  onRowClick,
  sortable = false,
  sortLabel = true,
  withTooltip = false,
  initialOrderBy = 'name',
  toolbar,
  initialOrder,
  isLoading = false,
  isError = false,
  contextMenu: contextMenuProp,
  permissions,
  setPagination,
  setSortOrder,
  totalCount,
  tablePage,
  handleTablePage,
}: TableProps<T>) {
  const translate = useTranslate();

  const [order, setOrder] = useState<Order | undefined>();
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(initialOrderBy);
  const [page, setPage] = useState(tablePage ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(hasPagination ? initialRowsPerPage : -1);
  const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | any>(null);
  const [currentRow, setCurrentRow] = useState<T | null>(null);

  useEffect(() => {
    if (totalCount) {
      setPage(tablePage ?? 0);
    }
  }, [tablePage, totalCount]);

  const onContextMenu = (event: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>, row: T) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentRow(row);
    setIsOpenContextMenu(true);
    const { clientX, clientY } = event;
    const virtualElement = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: clientY,
        right: clientX,
        bottom: clientY,
        left: clientX,
      }),
    };
    setAnchorEl(virtualElement);
  };

  const contextMenu = useMemo(
    () => (typeof contextMenuProp === 'function' ? contextMenuProp?.(currentRow) : contextMenuProp),
    [contextMenuProp, currentRow],
  );

  const onContextMenuItem = (menuItem: string) => {
    contextMenu?.onRowContextMenuItemClick?.(menuItem, currentRow);
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && (!order || order === 'asc');
    setOrder(isAsc ? 'desc' : 'asc');
    setSortOrder?.(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    handleTablePage?.(newPage);
    setPagination?.({ offset: newPage * rowsPerPage, limit: rowsPerPage });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (tableData?.length || 0)) : 0;

  const labels = columns
    ? getTableLabelsFromColumns<T>(columns)
    : getTableLabelsFromData<T>(tableData, exceptions);

  const cellKeys = useMemo(() => {
    if (!tableData?.length) return [];

    const keys = Object.keys(tableData[0]);

    if (exceptions) return keys.filter((key) => !exceptions.includes(key));

    return keys;
  }, [exceptions, tableData]);

  return (
    <TableWrapper>
      {(title || toolbar) && <TableToolbar title={title}>{toolbar}</TableToolbar>}
      {isLoading && !isError && (
        <LoadingContainer>
          <LoadingAvataa />
        </LoadingContainer>
      )}
      {!isLoading && isError && (
        <LoadingContainer>
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          />
        </LoadingContainer>
      )}

      {!isLoading && !isError && tableData?.length === 0 && (
        <LoadingContainer>
          <Typography>{translate('No data')}</Typography>
        </LoadingContainer>
      )}

      {!isLoading && !isError && tableData?.length !== 0 && (
        <>
          <TableContainer>
            <MuiTable stickyHeader>
              <TableHead
                sortable={sortable}
                sortLabel={sortLabel}
                labels={labels}
                withTooltip={withTooltip}
                order={sortable ? order : undefined}
                orderBy={sortable ? orderBy : undefined}
                onHeadCellClick={sortable ? handleRequestSort : undefined}
              />
              <TableBody>
                {stableSort(tableData, order, orderBy)
                  .slice(
                    rowsPerPage !== -1 ? page * rowsPerPage : 0,
                    rowsPerPage !== -1
                      ? Math.min(page * rowsPerPage + rowsPerPage, tableData.length)
                      : tableData?.length,
                  )
                  // .slice(
                  //   rowsPerPage !== -1 ? page * rowsPerPage : 0,
                  //   rowsPerPage !== -1 ? page * rowsPerPage + rowsPerPage : tableData?.length,
                  // )
                  .map((row) => {
                    return (
                      <TableRow
                        onContextMenu={(e) => onContextMenu(e, row)}
                        hover
                        onClick={(event) => onRowClick?.(event, row)}
                        key={uuidv4()}
                      >
                        {!columns &&
                          cellKeys.map((key) => (
                            <TableCell align="left" key={key}>
                              {row[key]?.toString()}
                            </TableCell>
                          ))}
                        {columns?.map((column) => (
                          <TableCell key={column.key} align={column.align || 'left'}>
                            {column.render
                              ? column.render(row)
                              : column.dataIndex && row[column.dataIndex]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={labels?.length} />
                  </TableRow>
                )}
              </TableBody>
              {contextMenu && !contextMenu.disabled && (
                <ContextMenu
                  isOpen={isOpenContextMenu}
                  onClose={() => setIsOpenContextMenu(false)}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  onContextMenuItemClick={onContextMenuItem}
                  menuItems={contextMenu.contextMenuItems}
                  // permissions={permissions}
                />
              )}
            </MuiTable>
          </TableContainer>
          {hasPagination && (
            <TablePagination
              component="div"
              count={totalCount ?? 0}
              onPageChange={handleChangePage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={(event: any) => {
                setPage(0);
                handleTablePage?.(0);
                setRowsPerPage(Number(event.target.value));
                setPagination?.({ offset: 0, limit: Number(event.target.value) });
              }}
            />
          )}
        </>
      )}
    </TableWrapper>
  );
}
