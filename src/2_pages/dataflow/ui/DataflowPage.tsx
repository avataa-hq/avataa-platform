import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { enqueueSnackbar } from 'notistack';

import { Card, Typography, Button } from '@mui/material';
import { AddRounded, SettingsRounded, FilterAlt } from '@mui/icons-material';

import { DataflowDiagramPage } from '2_pages/dataflowDiagram';
import { DataSourcesStats, useGetAllPipelinesByFilters, usePipelinesTableColumns } from '5_entites';
import { Pipeline } from '6_shared/api/dataview/types';
import {
  Table,
  Box,
  useTranslate,
  SearchInput,
  getErrorMessage,
  pipelinesManagementApi,
  useGetPermissions,
  useDataflowDiagramPage,
  useDataflowPage,
  useConfig,
} from '6_shared';

import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';
import { DataflowPageContainer } from './DataflowPage.styled';
import { AddDataSourceModal } from './modals/AddDataSourceModal';
import { ConfigureDataSourceModal } from './modals/sourcesManagement/ConfigureDataSourceModal';
import { PipelineInfoModal } from './modals/PipelineInfoModal';
import {
  DeletePipelineModal,
  TableRelationSettingsModal,
  CopyPipelineModal,
  AddDestinationModal,
} from './modals';
import { AddRuleButton } from './AddRuleButton';
import { useDisplayPipeline } from '../lib';
import { FilterModal } from './modals/filterModal';

const { useLazyGetPipelineStructureQuery } = pipelinesManagementApi;

const labels = Array.from(Array(15).keys());

const sourcesStats = {
  update: labels.map(() => 10),
  error: labels.map(() => 10),
  running: labels.map(() => 10),
};

const DataflowPage = () => {
  const translate = useTranslate();
  const displayPipeline = useDisplayPipeline();
  const permissions = useGetPermissions('dataFlow');

  const [getPipelineStructure] = useLazyGetPipelineStructureQuery();
  const [pagination, setPagination] = useState({ offset: 0, limit: 15 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPipelinesCount, setTotalPipelinesCount] = useState(0);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { userRoles } = useConfig();

  const { isDataflowDiagramOpen } = useDataflowDiagramPage();
  const {
    filterFormState,
    selectedTags,
    tablePage,
    setAddDataSourceModalOpen,
    setConfigureDataSourceModalOpen,
    setPipelineInfoModalOpen,
    setDeletePipelineModalOpen,
    setSelectedPipeline,
    setCopyPipelineModalOpen,
    setAddDestinationModalOpen,
    setSelectedTags,
    setTablePage,
  } = useDataflowPage();

  const { pipelinesData, isAllPipelinesFetching, isAllPipelinesError } =
    useGetAllPipelinesByFilters({
      searchQuery,
      tags: filterTags,
      sortOrder,
      pagination,
    });

  useEffect(() => {
    setTablePage(0);
    setPagination?.({ offset: 0, limit: 15 });
  }, [totalPipelinesCount, setPagination]);

  useEffect(() => {
    if (filterFormState) {
      const filterValue = filterFormState.columnFilters?.[0]?.filters?.[0]?.value ?? [];
      setFilterTags(Array.isArray(filterValue) ? filterValue : [filterValue]);
      setPipelines([]);
    } else {
      setFilterTags([]);
      setPipelines([]);
    }
  }, [filterFormState]);

  useEffect(() => {
    setPipelines((prev) => {
      const prevPipelinesData = [...prev];

      pipelinesData?.pipelines.forEach((pipeline) => {
        if (!prev.some((prevPipeline) => prevPipeline.dag_id === pipeline.dag_id)) {
          prevPipelinesData.push(pipeline);
        }
      });

      return prevPipelinesData;
    });
    setTotalPipelinesCount(pipelinesData?.total || 0);
  }, [pipelinesData]);

  useEffect(() => {
    const selectedFilterTags = Object.entries(selectedTags || {}).reduce((acc, [key, value]) => {
      if (value) {
        acc.push(key);
      }
      return acc;
    }, [] as string[]);

    setFilterTags(selectedFilterTags);
  }, [selectedTags]);

  const deletePipelineFromState = (dag_id: string) => {
    setPipelines((prev) => prev.filter((pipeline) => pipeline.dag_id !== dag_id));
  };

  const handlePipelineClick = useCallback(
    async (pipeline: Pipeline) => {
      try {
        if (pipeline.external) {
          if (pipeline.link) window.open(pipeline.link, '_blank');
          return;
        }
        const pipelineStructure = await getPipelineStructure(pipeline.id).unwrap();
        displayPipeline(pipelineStructure);
      } catch (error) {
        console.error(error);
        enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
      }
    },
    [getPipelineStructure, displayPipeline],
  );

  const handleEditPipelineClick = useCallback(
    (pipeline: Pipeline) => {
      handlePipelineClick(pipeline);
    },
    [handlePipelineClick],
  );

  const handleCopyPipelineClick = useCallback((pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setCopyPipelineModalOpen(true);
  }, []);

  const handleDeletePipelineClick = useCallback((pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setDeletePipelineModalOpen(true);
  }, []);

  const handlePipelineInfoClick = useCallback((pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setPipelineInfoModalOpen(true);
  }, []);

  const handlePipelineTagClick = useCallback(
    (tag: string) => {
      setIsLoading(true);

      setSelectedTags({
        ...selectedTags,
        [tag]: !selectedTags?.[tag],
      });
      setPipelines([]);
      setIsLoading(false);
    },
    [selectedTags],
  );

  const handleSearchChange = (newSearchQuery: string | undefined) => {
    if (newSearchQuery?.trim() && newSearchQuery?.trim() !== ' ') {
      setPipelines([]);
    }
    setSearchQuery(newSearchQuery ? newSearchQuery.trim() : '');
  };

  const handleTablePage = (newPage: number) => {
    setTablePage(newPage);
  };

  const contextMenuActions = useMemo<Record<string, any>>(
    () => ({
      Edit: handleEditPipelineClick,
      Info: handlePipelineInfoClick,
      Copy: handleCopyPipelineClick,
      Delete: handleDeletePipelineClick,
    }),
    [
      handleEditPipelineClick,
      handlePipelineInfoClick,
      handleCopyPipelineClick,
      handleDeletePipelineClick,
    ],
  );

  const columns = usePipelinesTableColumns({
    onInfoClick: handlePipelineInfoClick,
    onHistoryClick: () => {},
    selectedTags,
    handlePipelineTagClick,
    permissions,
  });

  const stats = useMemo(() => {
    if (pipelinesData) {
      const output = {
        update: 0,
        running: 0,
        errors: 0,
      };

      pipelinesData.pipelines.forEach((pipeline) => {
        if (pipeline.status === 'updated') output.update++;
        if (pipeline.status === 'running') output.running++;
        if (pipeline.status === 'error' || pipeline.status === 'creation error') output.errors++;
      });

      return {
        ...output,
        update: `${output.update}/${pipelinesData.total}`,
      };
    }

    return {
      update: '0',
      running: '0',
      errors: '0',
    };
  }, [pipelinesData]);

  if (isDataflowDiagramOpen)
    return (
      <DndProvider backend={HTML5Backend}>
        <ErrorBoundary fallback="Error in the dataflow diagram">
          <DataflowDiagramPage />
        </ErrorBoundary>
      </DndProvider>
    );

  return (
    <DataflowPageContainer>
      <Box display="flex" justifyContent="center" gap="1.25rem" width="100%" minHeight="160px">
        <DataSourcesStats
          name={translate('Updated')}
          value={stats.update}
          color="success"
          chartData={sourcesStats.update}
          evolution={{
            value: '0%',
            period: translate('than last year'),
            type: 'none',
          }}
        />
        <DataSourcesStats
          name={translate('Running')}
          value={stats.running}
          color="warning"
          chartData={sourcesStats.running}
          evolution={{
            value: '0%',
            period: translate('than last year'),
            type: 'none',
          }}
        />
        <DataSourcesStats
          name={translate('Errors')}
          value={stats.errors}
          color="error"
          chartData={sourcesStats.error}
          evolution={{
            value: '0%',
            period: translate('than last year'),
            type: 'none',
          }}
        />
      </Box>
      <Card
        sx={{
          px: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box display="flex" justifyContent="space-between" px="20px" mb="20px">
          <Typography sx={{ fontSize: '1.5rem', lineHeight: '1.875rem' }}>
            {translate('Health Check')}
          </Typography>
          <Box display="flex" gap="5px" alignItems="center">
            <SearchInput
              searchedProperty="name"
              onChange={(_, searchVal) => handleSearchChange(searchVal)}
            />
            {(userRoles?.includes('Pages_dataFlow_admin') || permissions?.administrate) && (
              <>
                <Button variant="outlined.icon" onClick={() => setIsFilterModalOpen(true)}>
                  <FilterAlt />
                </Button>
                <Button
                  variant="outlined.icon"
                  onClick={() => setConfigureDataSourceModalOpen(true)}
                  data-testid="dataflow__configure-data-source"
                >
                  <SettingsRounded />
                </Button>
                <AddRuleButton permissions={permissions} />
                <Button
                  variant="contained"
                  sx={{ flexShrink: 0 }}
                  onClick={() => setAddDataSourceModalOpen(true)}
                  disabled={!(permissions.administrate ?? true)}
                >
                  <AddRounded /> {translate('Add source')}
                </Button>
                <Button
                  variant="contained"
                  sx={{ flexShrink: 0 }}
                  onClick={() => setAddDestinationModalOpen(true)}
                  disabled={!(permissions.administrate ?? true)}
                >
                  <AddRounded /> {translate('Add destination')}
                </Button>
              </>
            )}
          </Box>
        </Box>
        <Table
          isLoading={isAllPipelinesFetching || isLoading}
          isError={isAllPipelinesError}
          columns={columns ?? []}
          tableData={pipelines ?? []}
          totalCount={totalPipelinesCount}
          onRowClick={(event, row) => handlePipelineClick(row)}
          permissions={permissions}
          setPagination={setPagination}
          setSortOrder={setSortOrder}
          tablePage={tablePage}
          handleTablePage={handleTablePage}
          contextMenu={(pipeline) => ({
            contextMenuItems: [
              ...(pipeline?.external
                ? []
                : [
                    { title: 'Edit', disabled: !(permissions?.update ?? true) },
                    { title: 'Copy', disabled: !(permissions?.view ?? true) },
                  ]),
              { title: 'Info', disabled: !(permissions?.view ?? true) },
              {
                title: 'Delete',
                disabled: !(permissions?.administrate ?? true),
                props: {
                  sx: { color: (theme) => theme.palette.error.main },
                },
              },
            ],
            onRowContextMenuItemClick: (menuItem, row) => {
              contextMenuActions[menuItem]?.(row);
            },
          })}
          hasPagination
          sortable
        />
      </Card>
      <AddDataSourceModal />
      <AddDestinationModal />
      <DndProvider backend={HTML5Backend}>
        <ConfigureDataSourceModal permissions={permissions} />
      </DndProvider>
      <PipelineInfoModal permissions={permissions} />
      <DeletePipelineModal deletePipelineFromState={deletePipelineFromState} />
      <CopyPipelineModal />
      <TableRelationSettingsModal />

      <FilterModal
        isOpen={isFilterModalOpen}
        setIsOpen={setIsFilterModalOpen}
        columns={columns ?? []}
      />
    </DataflowPageContainer>
  );
};
export default DataflowPage;
