import { useCallback, useEffect, useState } from 'react';
import { DataGridPro, GridPaginationModel, GridSortModel } from '@mui/x-data-grid-pro';
import { useTheme } from '@emotion/react';
import { Box, Button } from '@mui/material';
import {
  LoadingAvataa,
  moduleSettingsLogsApi,
  modulesApi,
  useTranslate,
  GetFilteredModuleSettingsLogsRequest,
  ModuleSettingsLogsSortBy,
} from '6_shared';
import { AuditDateRange } from '5_entites';
import format from 'date-fns/format';
import { ModalFilterByDomain } from '../modals';
import { transformColumnNamesToSnakeCase } from '../lib';
import {
  ConfigurationAuditStyled,
  ConfigurationAuditContainer,
  ConfigurationAuditHeader,
  LoadingContainer,
} from './ConfigurationAudit.styled';

const columns = [
  { field: 'changeTime', headerName: 'Change Time', flex: 1 },
  { field: 'user', headerName: 'User', flex: 1 },
  { field: 'domain', headerName: 'Domain', flex: 1 },
  { field: 'variable', headerName: 'Variable', flex: 1 },
  { field: 'oldValue', headerName: 'Old Value', flex: 1 },
  { field: 'newValue', headerName: 'New Value', flex: 1 },
];

export const ConfigurationAudit = () => {
  const { useGetFilteredModuleSettingsLogsMutation } = moduleSettingsLogsApi;
  const { useGetAllModulesQuery } = modulesApi;
  const theme = useTheme();
  const translate = useTranslate();

  const [paginationModel, setPaginationModel] = useState({ pageSize: 20, page: 0 });
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isModalFilterByDomainOpen, setIsModalFilterByDomainOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    dateFrom: string | undefined;
    dateTo: string | undefined;
  }>({ dateFrom: undefined, dateTo: undefined });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [localRows, setLocalRows] = useState<Record<string, any>[]>([]);

  const [getFilteredModuleSettingsLogs, { data, isError, isLoading }] =
    useGetFilteredModuleSettingsLogsMutation();
  const { data: modules } = useGetAllModulesQuery();

  const fetchModuleSettingsLogs = useCallback(
    (body: GetFilteredModuleSettingsLogsRequest) => {
      getFilteredModuleSettingsLogs(body).unwrap();
    },
    [getFilteredModuleSettingsLogs],
  );

  useEffect(() => {
    const sortBy: ModuleSettingsLogsSortBy[] = sortModel.map((model) => ({
      sort_by: model.field,
      sort_direction: model.sort === 'asc' ? 'asc' : 'desc',
    }));

    const defaultSortBy: ModuleSettingsLogsSortBy[] = !sortBy?.length
      ? [
          {
            sort_by: 'change_time',
            sort_direction: 'desc',
          },
        ]
      : sortBy;

    fetchModuleSettingsLogs({
      module_names: selectedModules,
      from_date: dateRange.dateFrom,
      to_date: dateRange.dateTo,
      sort_by: transformColumnNamesToSnakeCase(defaultSortBy),
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize,
    });
  }, [selectedModules, paginationModel, sortModel, fetchModuleSettingsLogs, dateRange]);

  useEffect(() => {
    if (data && !data.elements.length) {
      setLocalRows([]);
      return;
    }

    if (data?.elements.length) {
      const transformedRows = data.elements.map((element: any, index: number) => ({
        id: index + 1,
        changeTime:
          format(new Date(element.change_time), 'yyyy-MM-dd HH:mm:ss') || element.change_time,
        user: element.user,
        domain: element.domain,
        variable: element.variable,
        oldValue: element.old_value,
        newValue: element.new_value,
      }));

      setLocalRows(transformedRows);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setLocalRows([]);
    }
  }, [isError]);

  const handlePaginationChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const onFilterByDomainClick = () => {
    setIsModalFilterByDomainOpen(true);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel(newSortModel);
  };

  const onApplyDateFilter = (dateFrom: string | undefined, dateTo: string | undefined) => {
    setDateRange({ dateFrom, dateTo });
  };

  return (
    <ConfigurationAuditStyled>
      {isLoading && (
        <LoadingContainer>
          <LoadingAvataa />
        </LoadingContainer>
      )}
      <ConfigurationAuditContainer>
        <ConfigurationAuditHeader>
          <Button variant="contained" sx={{ alignSelf: 'end' }} onClick={onFilterByDomainClick}>
            {translate('Filter by domains')}
          </Button>
          <AuditDateRange onApplyDateRange={onApplyDateFilter} />
        </ConfigurationAuditHeader>
        <Box component="div" sx={{ height: 'calc(100% - 80px)', opacity: isLoading ? 0.5 : 1 }}>
          <DataGridPro
            rows={localRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[20, 50, 100]}
            pagination
            paginationMode="server"
            rowCount={data?.meta.total_count}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            getRowClassName={({ indexRelativeToCurrentPage }) =>
              indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
            }
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
              '& .row-odd': { backgroundColor: theme.palette.neutral.surfaceContainerLow },
            }}
          />
        </Box>
        <ModalFilterByDomain
          isModalFilterByDomainOpen={isModalFilterByDomainOpen}
          setIsModalFilterByDomainOpen={setIsModalFilterByDomainOpen}
          modules={modules}
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
        />
      </ConfigurationAuditContainer>
    </ConfigurationAuditStyled>
  );
};
