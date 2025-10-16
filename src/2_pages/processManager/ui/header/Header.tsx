import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { Typography, Box, Tooltip } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ReplayIcon from '@mui/icons-material/Replay';

import {
  useExportProcesses,
  useGetRangesForProcessesBody,
  useProcessManagerTableActions,
  KanbanUsers,
} from '5_entites';
import {
  GetSeverityByRangesBody,
  GetSeverityProcessBody,
  SeverityCount,
  useTranslate,
  ActionTypes,
  IFilterColumn,
  ITableColumnSettingsModel,
  useObjectCRUD,
  useProcessManager,
  ProcessManagerPageMode,
  useProcessManagerTable,
  DataTransferFileExtension,
  useLeftPanelWidget,
} from '6_shared';
import Severity from '5_entites/processManager/ui/severity/Severity';

import { CustomTableToolbar } from '3_widgets';
import CloseIcon from '@mui/icons-material/Close';
import { gridVisibleColumnFieldsSelector } from '@mui/x-data-grid-premium';
import { GridLogicOperator } from '@mui/x-data-grid';
import { Bottom, CustomButton, HeaderStyled, Top, TopLeft, TopRight } from './Header.styled';
import { ViewButtons } from './viewButtons/ViewButtons';

interface IProps {
  selectedGroup?: string | null;
  columnButtonsDisabled: boolean;
  tableApiRef: MutableRefObject<GridApiPremium>;
  liveSeverityByRangesData?: SeverityCount[];
  setSeverityBody?: Dispatch<SetStateAction<GetSeverityByRangesBody | null>>;
  tableProcessBody?: GetSeverityProcessBody | null;
  onCloseAllCurrentProcessesClick: () => void;
  permissions?: Record<ActionTypes, boolean>;
  pmTmoId?: number;
  exportDataDelimiter?: string;
  selectedRowsIds?: number[];
  selectedTab?: string;
  pageMode?: ProcessManagerPageMode;
  handlePageModeChange?: (newMode: ProcessManagerPageMode) => void;
  isActiveKanban?: boolean;
  setDefaultColumnsSettings?: (setttings: ITableColumnSettingsModel | undefined) => void;

  onReload?: () => void;
  isLoading?: boolean;
}

export const Header = ({
  selectedGroup,
  columnButtonsDisabled,
  tableApiRef,
  liveSeverityByRangesData,
  setSeverityBody,
  tableProcessBody,
  onCloseAllCurrentProcessesClick,
  permissions,
  pmTmoId,
  exportDataDelimiter,
  selectedRowsIds,
  selectedTab,
  pageMode,
  handlePageModeChange,
  isActiveKanban,
  setDefaultColumnsSettings,

  onReload,
  isLoading,
}: IProps) => {
  const translate = useTranslate();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  const { isDefaultSettingsBlocked } = useProcessManagerTable();
  const { setMultiSearchValue, setSelectedGroup } = useProcessManager();

  const { setIsObjectCRUDModalOpen } = useObjectCRUD();

  const { selectedMultiFilter } = useLeftPanelWidget();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return () => {};

    const updateWidth = () => {
      const width = container.offsetWidth;
      setIsNarrow(width < 753);
    };

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(container);

    updateWidth();

    return () => observer.disconnect();
  }, []);

  const {
    handleSetCustomColumnDimensions,
    handleSetPinnedColumns,
    handleSetIsDefaultSettingsBlocked,
    handleSetCustomColumnsOrder,
    handleSetCustomSortingModel,
    handleSetCustomVisibleColumns,
  } = useProcessManagerTableActions();

  const onSearchClick = useCallback(
    (value: string) => {
      setMultiSearchValue(value);
    },
    [setMultiSearchValue],
  );

  const { exportData, isExportLoading } = useExportProcesses();
  const { getRangesForProcessesBody } = useGetRangesForProcessesBody();

  const onLoadExportFile = useCallback(
    (fileType: DataTransferFileExtension) => {
      if (tableProcessBody) {
        const { columnFilters, tmoId, sort, withGroups, findByValue } = tableProcessBody;

        const getFilterList = () => {
          const filterList = [...(columnFilters ?? [])] as IFilterColumn[];

          if (selectedRowsIds?.length) {
            const selectedRowsFilter = {
              columnName: 'id',
              rule: 'and' as GridLogicOperator,
              filters: [{ operator: 'isAnyOf', value: selectedRowsIds }],
            };
            filterList.push(selectedRowsFilter);
          }
          return filterList;
        };

        const filters_list = getFilterList();

        exportData({
          tmo_id: tmoId,
          columns: gridVisibleColumnFieldsSelector(tableApiRef),
          find_by_value: findByValue,
          with_groups: withGroups,
          filters_list,
          ranges_object: {
            ranges: getRangesForProcessesBody(false),
          },
          file_type: fileType,
          sort,
          csv_delimiter: exportDataDelimiter,
        });
      }
    },
    [
      tableProcessBody,
      exportData,
      tableApiRef,
      getRangesForProcessesBody,
      exportDataDelimiter,
      selectedRowsIds,
    ],
  );

  const onAddObjectModalOpen = () => {
    if (pmTmoId) {
      setIsObjectCRUDModalOpen(true);
    }
  };
  return (
    <HeaderStyled>
      <Top ref={containerRef} isNarrow={isNarrow}>
        {pageMode !== 'tasks' && (
          <>
            <TopLeft isNarrow={isNarrow}>
              <CustomTableToolbar
                permissions={permissions}
                apiRef={tableApiRef}
                tmoId={pmTmoId}
                hasSearchComponent
                hasFilterPanel
                hasColumnsPanel
                hasCustomColumnsSettingComponent
                hasAddObjectComponent
                onAdding={onAddObjectModalOpen}
                setCustomSorting={handleSetCustomSortingModel}
                setCustomColumnsOrder={handleSetCustomColumnsOrder}
                setCustomColumnDimensions={handleSetCustomColumnDimensions}
                setCustomVisibleColumns={handleSetCustomVisibleColumns}
                setCustomPinnedColumns={handleSetPinnedColumns}
                onSearchClick={onSearchClick}
                onCancelClick={() => setMultiSearchValue('')}
                hasExportComponent
                loadExportFile={onLoadExportFile}
                isExportLoading={isExportLoading}
                setIsDefaultSettingsBlocked={handleSetIsDefaultSettingsBlocked}
                isDefaultSettingsBlocked={isDefaultSettingsBlocked}
                selectedTab={selectedTab}
                setDefaultColumnsSettings={setDefaultColumnsSettings}
                additionalSlot={
                  <>
                    <Tooltip title={translate('Close all filtered processes')}>
                      <span>
                        <CustomButton
                          variant="outlined"
                          onClick={onCloseAllCurrentProcessesClick}
                          disabled={columnButtonsDisabled || !(permissions?.administrate ?? true)}
                        >
                          <CloseIcon fontSize="small" />
                        </CustomButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Reload">
                      <span>
                        <CustomButton loading={isLoading} variant="outlined" onClick={onReload}>
                          <ReplayIcon fontSize="small" />
                        </CustomButton>
                      </span>
                    </Tooltip>
                  </>
                }
              />
            </TopLeft>
            <TopRight isNarrow={isNarrow}>
              <Severity
                liveSeverityByRangesData={liveSeverityByRangesData}
                setSeverityBody={setSeverityBody}
                isNarrow={isNarrow}
              />
            </TopRight>
          </>
        )}
      </Top>
      <Bottom>
        {pageMode === 'list' && (
          <Box
            sx={{ opacity: selectedGroup ? 1 : 0.5 }}
            component="div"
            display="flex"
            gap="10px"
            alignItems="center"
          >
            <CustomButton disabled={selectedGroup === null} onClick={() => setSelectedGroup(null)}>
              {selectedGroup ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </CustomButton>
            <Typography variant="h2">{selectedGroup || translate('All')}</Typography>
          </Box>
        )}

        {pageMode === 'grid' && (
          <Box component="div" display="flex" gap="10px" alignItems="center">
            <Typography variant="h2">{selectedMultiFilter?.name || translate('All')}</Typography>
            <KanbanUsers onSearchClick={onSearchClick} />
          </Box>
        )}
        {pageMode === 'tasks' && (
          <Box component="div" display="flex" gap="10px" alignItems="center">
            <Typography variant="h2">User Tasks</Typography>
          </Box>
        )}
        <ViewButtons
          handlePageModeChange={handlePageModeChange}
          isActiveKanban={isActiveKanban}
          pageMode={pageMode}
        />
      </Bottom>
    </HeaderStyled>
  );
};
