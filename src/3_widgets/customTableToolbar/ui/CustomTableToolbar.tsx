import React, { MutableRefObject, ReactNode, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import AddIcon from '@mui/icons-material/Add';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { ArchiveRounded, UnarchiveRounded, ViewWeekOutlined } from '@mui/icons-material';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridPreferencePanelsValue } from '@mui/x-data-grid-premium';

import {
  Box,
  Search,
  TableExportComponent,
  ActionTypes,
  useTranslate,
  CompositeColumnsOrderItem,
  CompositeSortingItem,
  CompositeIsCustomColumnsSetActiveItem,
  CompositeColumnsVisibilityItem,
  CompositePinnedColumnsItem,
  CompositeIsDefaultSettingsBlockedItem,
  CompositeColumnDimensionsItem,
  ITableColumnSettingsModel,
} from '6_shared';
import { InvColumnSettings, InvFilterSettings } from '4_features';
import { Container, Header, IsActiveIndicator } from './CustomTableToolbar.styled';
import { ToolbarButton } from './ToolbarButton';

interface IProps {
  apiRef: MutableRefObject<GridApiPremium>;
  title?: string;
  tmoId?: number;

  hasSearchComponent?: boolean;
  hasFilterPanel?: boolean;
  hasColumnsPanel?: boolean;
  hasExportComponent?: boolean;
  hasObjectActivitySwitch?: boolean;
  hasCustomFiltersSettingComponent?: boolean;
  hasCustomColumnsSettingComponent?: boolean;
  hasAddObjectComponent?: boolean;
  hasShowParentsData?: boolean;
  isParentsDataShown?: boolean;

  onSearchClick?: (value: string) => void;
  onCancelClick?: () => void;
  loadExportFile?: (body?: any) => void;
  setDelimiter?: (value: string) => void;
  isExportLoading?: boolean;
  onAdding?: () => void;
  isObjectsActive?: boolean;
  onObjectActivitySwitch?: (value: boolean) => void;
  refetchData?: () => void;
  onParentsDataSwitch?: (value: boolean) => void;
  permissions?: Record<ActionTypes, boolean>;

  setCustomColumnDimensions?: (dimensions: CompositeColumnDimensionsItem) => void;
  setCustomColumnsOrder?: (order: CompositeColumnsOrderItem) => void;
  setCustomSorting?: (order: CompositeSortingItem) => void;
  setCustomVisibleColumns?: (columns: CompositeColumnsVisibilityItem) => void;
  setCustomPinnedColumns?: (column: CompositePinnedColumnsItem) => void;
  setIsCustomColumnsSetActive?: (isActive: CompositeIsCustomColumnsSetActiveItem) => void;
  isCustomColumnsSetActive?: Record<string, boolean>;
  setDefaultColumnsSettings?: (setttings: ITableColumnSettingsModel | undefined) => void;

  displayFilterIndicator?: 'block' | 'none';
  displayColumnsIndicator?: 'block' | 'none';
  displayCustomFilterIndicator?: 'block' | 'none';
  displayCustomColumnIndicator?: 'block' | 'none';

  setIsDefaultSettingsBlocked?: (isBlocked: CompositeIsDefaultSettingsBlockedItem) => void;
  isDefaultSettingsBlocked?: Record<string, boolean>;

  additionalSlot?: ReactNode;
  selectedTab?: string;
}
export const CustomTableToolbar = ({
  apiRef,
  title,
  tmoId,
  loadExportFile,
  setDelimiter,
  isExportLoading,
  onAdding,
  onParentsDataSwitch,
  isObjectsActive,
  onObjectActivitySwitch,
  refetchData,

  hasCustomFiltersSettingComponent,
  hasCustomColumnsSettingComponent,
  hasAddObjectComponent,
  hasSearchComponent,
  hasFilterPanel,
  hasColumnsPanel,
  hasExportComponent,
  hasObjectActivitySwitch,
  permissions,
  onSearchClick,
  onCancelClick,
  hasShowParentsData,
  isParentsDataShown,

  setCustomColumnDimensions,
  setCustomColumnsOrder,
  setCustomSorting,
  setCustomVisibleColumns,
  setCustomPinnedColumns,
  setIsCustomColumnsSetActive,
  isCustomColumnsSetActive,
  setDefaultColumnsSettings,

  displayFilterIndicator = 'none',
  displayColumnsIndicator = 'none',
  displayCustomFilterIndicator = 'none',
  displayCustomColumnIndicator = 'none',

  setIsDefaultSettingsBlocked,
  isDefaultSettingsBlocked,

  additionalSlot,
  selectedTab,
}: IProps) => {
  const translate = useTranslate();
  const [isOpenColumnSettings, setIsOpenColumnSettings] = useState(false);
  const [isOpenFilterSettings, setIsOpenFilterSettings] = useState(false);

  const onFilterPanelOpen = () => {
    const isOpen = apiRef.current?.store.value.preferencePanel.open;
    if (isOpen) apiRef.current?.hideFilterPanel();
    else apiRef.current?.showFilterPanel();
  };

  const onColumnPanelOpen = () => {
    const isOpen = apiRef.current?.store.value.preferencePanel.open;
    if (isOpen) apiRef.current?.hideColumnMenu();
    else apiRef.current?.showPreferences(GridPreferencePanelsValue.columns);
  };

  return (
    <Container>
      <Header variant="h1">{title}</Header>
      <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {hasSearchComponent && (
          <Search
            searchValue=""
            onCancelClick={() => onCancelClick?.()}
            onSearchClick={(value) => onSearchClick?.(value)}
            disabled={!(permissions?.view ?? true)}
          />
        )}

        {hasFilterPanel && (
          <ToolbarButton
            onClick={onFilterPanelOpen}
            title={translate('Filters settings')}
            testId="table-header__filter-settings-btn"
            disabled={!(permissions?.view ?? true)}
          >
            <FilterAltIcon color="primary" />
            <IsActiveIndicator display={displayFilterIndicator} />
          </ToolbarButton>
        )}

        {hasColumnsPanel && (
          <ToolbarButton
            onClick={onColumnPanelOpen}
            title={translate('Columns settings')}
            testId="table-header__columns-settings-btn"
            disabled={!(permissions?.view ?? true)}
          >
            <IsActiveIndicator display={displayColumnsIndicator} />
            <ViewColumnIcon color="primary" />
          </ToolbarButton>
        )}

        {hasExportComponent && loadExportFile && (
          <TableExportComponent
            isLoading={isExportLoading as boolean}
            exportFile={loadExportFile}
            setDelimiter={(value: string) => setDelimiter?.(value)}
            disabled={!(permissions?.update ?? true)}
          />
        )}

        {hasAddObjectComponent && (
          <ToolbarButton
            onClick={onAdding}
            title={translate('Add new object')}
            testId="table-header__add-object-btn"
            disabled={!permissions?.update}
          >
            <AddIcon color="primary" />
          </ToolbarButton>
        )}

        {hasCustomFiltersSettingComponent && tmoId && (
          <>
            <ToolbarButton
              onClick={() => setIsOpenFilterSettings((v) => !v)}
              title={translate('Custom filters sets')}
              testId="table-header__custom-filters-btn"
            >
              <FilterAltOutlinedIcon color="primary" />
              <IsActiveIndicator display={displayCustomFilterIndicator} />
            </ToolbarButton>
            <InvFilterSettings
              isOpen={isOpenFilterSettings}
              setIsOpen={setIsOpenFilterSettings}
              tableApiRef={apiRef}
              tmoId={tmoId}
              permissions={permissions}
            />
          </>
        )}

        {hasCustomColumnsSettingComponent && tmoId && (
          <>
            <ToolbarButton
              onClick={() => setIsOpenColumnSettings((v) => !v)}
              title={translate('Custom columns sets')}
              testId="table-header__custom-columns-btn"
              disabled={!(permissions?.view ?? true)}
              id={`${selectedTab}-custom-columns-btn`}
            >
              <ViewWeekOutlined fontSize="small" color="primary" />
              <IsActiveIndicator display={displayCustomColumnIndicator} />
            </ToolbarButton>
            <InvColumnSettings
              isOpen={isOpenColumnSettings}
              setIsOpen={setIsOpenColumnSettings}
              tableApiRef={apiRef}
              tmoId={tmoId}
              permissions={permissions}
              setCustomColumnDimensions={setCustomColumnDimensions}
              setCustomColumnsOrder={setCustomColumnsOrder}
              setCustomSorting={setCustomSorting}
              setCustomVisibleColumns={setCustomVisibleColumns}
              setCustomPinnedColumns={setCustomPinnedColumns}
              setIsCustomColumnsSetActive={setIsCustomColumnsSetActive}
              isCustomColumnsSetActive={isCustomColumnsSetActive}
              setIsDefaultSettingsBlocked={setIsDefaultSettingsBlocked}
              isDefaultSettingsBlocked={isDefaultSettingsBlocked}
              selectedTab={selectedTab}
              setDefaultColumnsSettings={setDefaultColumnsSettings}
            />
          </>
        )}

        {hasObjectActivitySwitch &&
          (isObjectsActive ? (
            <ToolbarButton
              onClick={() => {
                onObjectActivitySwitch?.(false);
                refetchData?.();
              }}
              title={translate('Show deactivated objects')}
              testId="table-header__deactivated-objects-btn"
              disabled={!(permissions?.view ?? true)}
            >
              <UnarchiveRounded color="primary" />
            </ToolbarButton>
          ) : (
            <ToolbarButton
              onClick={() => {
                onObjectActivitySwitch?.(true);
                refetchData?.();
              }}
              title={translate('Show active objects')}
              testId="table-header__active-objects-btn"
              disabled={!(permissions?.view ?? true)}
            >
              <ArchiveRounded color="primary" />
            </ToolbarButton>
          ))}

        {hasShowParentsData &&
          (isParentsDataShown ? (
            <ToolbarButton
              onClick={() => onParentsDataSwitch?.(false)}
              title={translate('Hide parent parameters')}
              testId="table-header__hide-parent-params-btn"
              disabled={!(permissions?.update ?? true)}
            >
              <FolderOffIcon color="primary" />
            </ToolbarButton>
          ) : (
            <ToolbarButton
              onClick={() => onParentsDataSwitch?.(true)}
              title={translate('Show parent parameters')}
              testId="table-header__show-parent-params-btn"
              disabled={!(permissions?.update ?? true)}
            >
              <DriveFolderUploadIcon color="primary" />
            </ToolbarButton>
          ))}
        {additionalSlot}
      </Box>
    </Container>
  );
};
