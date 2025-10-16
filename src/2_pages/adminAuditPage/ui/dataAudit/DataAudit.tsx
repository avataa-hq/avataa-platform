import { useState } from 'react';
import { Box } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { AdminDataAuditTable, DataAuditHeader, useGetEventsByFilter } from '5_entites';
import { INestedMultiFilterItem, useDataAudit, useLeftSidebar } from '6_shared';
import { useGenerateDataAuditColumns } from '../lib/useGenerateDataAuditColumns';
import { DataAuditBody, DataAuditContainer, DataAuditStyled } from './DataAudit.styled';

export const DataAudit = () => {
  const apiRef = useGridApiRef();

  const { isLeftSidebarOpen } = useLeftSidebar();
  const { customPagination, customSorting, customFilter } = useDataAudit();

  const [dateRange, setDateRange] = useState<{
    dateFrom: string | undefined;
    dateTo: string | undefined;
  }>({ dateFrom: undefined, dateTo: undefined });

  const transformFilterColumns = (customFilterModel: INestedMultiFilterItem[] | undefined) => {
    return (
      customFilterModel?.flatMap((item) =>
        item.filters.map((filter) => ({
          field: item.column.id,
          value: filter.value as string,
          condition: item.logicalOperator === 'and' ? 'AND' : 'OR',
          // condition: filter.operator,
        })),
      ) || []
    );
  };

  const onApplyDateFilter = (dateFrom: string | undefined, dateTo: string | undefined) => {
    setDateRange({ dateFrom, dateTo });
  };

  const { eventsData, isEventsDataFetching } = useGetEventsByFilter({
    filter_column: transformFilterColumns(customFilter?.[1]?.columnFilters),
    sort_by: {
      field: customSorting?.[1]?.[0] ? customSorting[1][0].field : 'valid_from',
      descending: customSorting?.[1]?.[0]?.sort === 'desc' ? 'DESC' : 'ASC',
    },
    date_from: dateRange.dateFrom,
    date_to: dateRange.dateTo,
    limit: customPagination?.[1]?.pageSize,
    offset: customPagination?.[1] ? customPagination[1].page * customPagination[1].pageSize : 0,
  });

  const { columns, rows } = useGenerateDataAuditColumns({ eventsData });

  return (
    <DataAuditStyled>
      <DataAuditContainer>
        <DataAuditHeader apiRef={apiRef} onApplyDateFilter={onApplyDateFilter} />

        <DataAuditBody>
          <Box
            component="div"
            sx={{
              width: isLeftSidebarOpen ? 'calc(100% - 191px)' : '100%',
              height: '80%',
              opacity: isEventsDataFetching ? 0.5 : 1,
              overflow: 'auto',
            }}
          >
            <AdminDataAuditTable
              apiRef={apiRef}
              columns={columns}
              rows={rows}
              rowCount={eventsData?.total ?? 0}
              isLoading={isEventsDataFetching}
            />
          </Box>
        </DataAuditBody>
      </DataAuditContainer>
    </DataAuditStyled>
  );
};
