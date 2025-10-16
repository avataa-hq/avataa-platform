import {
  AssociatedObjectsType,
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositePinnedColumnsItem,
  DataTransferFileExtension,
  defaultColumnVisibilityModel,
  useAssociatedObjects,
  useTranslate,
} from '6_shared';
import { MutableRefObject, ReactNode } from 'react';
import { FormControlLabel, Switch, Typography } from '@mui/material';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { CustomTableToolbar, useGetSettingsIndicator } from '3_widgets';
import { LeftContainer, RightContainer, StyledHeader } from './Header.styled';

interface HeaderProps {
  title: string;
  isDetailed: boolean;
  setIsDetailed: () => void;
  isFlowchart: boolean;
  setIsFlowchart: () => void;
  apiRef: MutableRefObject<GridApiPremium>;
  loadFile: (fileType: DataTransferFileExtension) => void;
  isExportLoading: boolean;
  rightSlot?: ReactNode;
  setCustomVisibleColumns: (columns: CompositeColumnsVisibilityItem) => void;
  setCustomColumnDimensions: (dimensions: CompositeColumnDimensionsItem) => void;
  setCustomColumnsOrder: (order: CompositeColumnsOrderItem) => void;
  setCustomPinnedColumns: (column: CompositePinnedColumnsItem) => void;
  associatedObjectType: AssociatedObjectsType;
}

export const Header = ({
  title,
  isDetailed,
  setIsDetailed,
  isFlowchart,
  setIsFlowchart,
  apiRef,
  loadFile,
  isExportLoading,
  rightSlot,
  setCustomVisibleColumns,
  setCustomColumnDimensions,
  setCustomColumnsOrder,
  setCustomPinnedColumns,
  associatedObjectType,
}: HeaderProps) => {
  const translate = useTranslate();

  const {
    detailedView: { selectedTmo, isObjectsActive, filters, visibleColumns },
    setDetailedViewSearchValue,
    setExportDataDelimiter,
    setIsDetailedViewObjectActive,
  } = useAssociatedObjects();

  const onSearchClick = (value: string) => {
    if (isDetailed && selectedTmo) {
      setDetailedViewSearchValue({ tmoId: selectedTmo, searchValue: value });
    }
  };

  const onCancelClick = () => {
    if (isDetailed && selectedTmo) {
      setDetailedViewSearchValue({ tmoId: selectedTmo, searchValue: '' });
    }
  };

  const onObjectActivitySwitch = (value: boolean) => setIsDetailedViewObjectActive(value);

  const { getFiltersIndicator, getColumnsIndicator } = useGetSettingsIndicator({
    filterSettings: filters[selectedTmo as number],
    columnSettings: visibleColumns[selectedTmo as number],
    defaultColumnsSettings: defaultColumnVisibilityModel,
  });

  return (
    <StyledHeader>
      <LeftContainer>
        <Typography variant="h1">{title}</Typography>
      </LeftContainer>
      <RightContainer>
        <CustomTableToolbar
          apiRef={apiRef}
          hasSearchComponent
          onSearchClick={onSearchClick}
          onCancelClick={onCancelClick}
          loadExportFile={loadFile}
          isExportLoading={isExportLoading}
          tmoId={selectedTmo as number}
          displayFilterIndicator={getFiltersIndicator()}
          displayColumnsIndicator={getColumnsIndicator()}
          displayCustomFilterIndicator="none"
          displayCustomColumnIndicator="none"
          hasCustomFiltersSettingComponent={false}
          hasAddObjectComponent={false}
          hasFilterPanel
          hasColumnsPanel
          hasExportComponent={isDetailed}
          hasObjectActivitySwitch={isDetailed}
          isObjectsActive={isObjectsActive}
          onObjectActivitySwitch={onObjectActivitySwitch}
          setDelimiter={(value: string) => setExportDataDelimiter(value)}
          hasCustomColumnsSettingComponent
          setCustomVisibleColumns={setCustomVisibleColumns}
          setCustomColumnDimensions={setCustomColumnDimensions}
          setCustomColumnsOrder={setCustomColumnsOrder}
          setCustomPinnedColumns={setCustomPinnedColumns}
        />
        {rightSlot}
        {associatedObjectType === 'linked' && (
          <FormControlLabel
            control={
              <Switch
                checked={isDetailed}
                onChange={setIsDetailed}
                name="isDetailed"
                data-testid="associated_objects-detailed_view_switch"
                sx={{ margin: '0 5px 0 15px' }}
              />
            }
            label={translate('Detailed View')}
          />
        )}
        {associatedObjectType === 'children' && (
          <FormControlLabel
            control={
              <Switch
                checked={isFlowchart}
                onChange={setIsFlowchart}
                name="isFlowchart"
                data-testid="associated_objects-flowchart_view_switch"
                sx={{ margin: '0 5px 0 15px' }}
              />
            }
            label={translate('Flowchart view')}
          />
        )}
      </RightContainer>
    </StyledHeader>
  );
};
