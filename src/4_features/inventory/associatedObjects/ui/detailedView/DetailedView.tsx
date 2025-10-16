import { useEffect, MutableRefObject, useMemo } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { Tab } from '@mui/material';
import {
  Box,
  ActionTypes,
  InventoryParameterTypesModel,
  IGetObjectsByFiltersModel,
  LoadingAvataa,
  CompositeColumnsVisibilityItem,
  useTranslate,
  useAssociatedObjects,
} from '6_shared';
import { useGetColumns, useGetRows } from '5_entites';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { useGetHasFilesColumn } from '5_entites/inventory/lib/table/hooks/useGetHasFileColumn';
import { ITmoModel } from '../../lib';
import { DetailedTableCenteredContainer, DetailedTableLoadContainer } from './DetailedTable.styled';
import { DetailedTable } from './DetailedTable';

const getComposedName = (tmoId: string, tprmName?: string) => `${tmoId}@${tprmName ?? ''}`;

const getElementsWithCorrectLabel = (array: ITmoModel[]) => {
  const duplicateTmoNames: Set<string> = new Set();

  array.forEach((item) => {
    const isDuplicate = array.some(
      (otherItem) => otherItem !== item && otherItem.tmoName === item.tmoName,
    );
    if (isDuplicate) {
      duplicateTmoNames.add(item.tmoName);
    }
  });

  const res = array.map((item) => ({
    ...item,
    label: duplicateTmoNames.has(item.tmoName)
      ? `${item.tmoName} (${item.tprmName ?? ''})`
      : item.tmoName,
  }));

  return res;
};

interface DetailedViewProps {
  tmoModel: ITmoModel[];
  apiRef: MutableRefObject<GridApiPremium>;
  isDataLoading: boolean;
  permissions?: Record<ActionTypes, boolean>;
  inventoryColumns?: InventoryParameterTypesModel[];
  inventoryRows?: IGetObjectsByFiltersModel;
  isLoading: boolean;
  setIsFindPathOpen?: (value: boolean) => void;
}

export const DetailedView = ({
  tmoModel,
  apiRef,
  isDataLoading,
  permissions,
  inventoryColumns,
  inventoryRows,
  isLoading,
  setIsFindPathOpen,
}: DetailedViewProps) => {
  const translate = useTranslate();

  const {
    detailedView,
    associatedObjectType,
    setSelectedTmo,
    setComposedSelectedTmo,
    setIsCheckboxSelection,
    setDetailedViewColumns,
    setSelectedRows,
  } = useAssociatedObjects();

  const {
    selectedTmo,
    visibleColumns,
    composedSelectedTmo,
    tprmNameWhenOpen,
    isCheckboxSelection,
    columnDimensions,
    customColumnsOrder,
  } = detailedView;

  const handleChange = (newValue: string, tprmName: string) => {
    setSelectedTmo(+newValue);
    setComposedSelectedTmo({ tmoId: newValue, tprmName });
  };
  useEffect(() => {
    if (!tmoModel.length) return;
    const setModel = (model: ITmoModel[]) => {
      const neededModel = model.find((tmo) => tmo.moIds?.length) ?? model[0];
      setSelectedTmo(neededModel.tmoId);

      setComposedSelectedTmo({ tmoId: neededModel.tmoId, tprmName: neededModel.tprmName });
    };

    if (!selectedTmo) {
      setModel(tmoModel);
      return;
    }

    if (selectedTmo) {
      const hasSelected = tmoModel.find((tmo) => tmo.tmoId === selectedTmo);
      if (!hasSelected) setModel(tmoModel);
    }
  }, [tmoModel, selectedTmo, associatedObjectType]);

  useEffect(() => {
    if (tmoModel.length && !composedSelectedTmo && tprmNameWhenOpen) {
      const neededTmo = tmoModel.find(({ tmoName }) =>
        tmoName.toLowerCase().includes(tprmNameWhenOpen.toLowerCase()),
      );
      if (neededTmo) {
        setComposedSelectedTmo({ tmoId: neededTmo.tmoId, tprmName: neededTmo.tprmName });
      } else {
        setComposedSelectedTmo({ tmoId: tmoModel[0].tmoId, tprmName: tmoModel[0].tprmName });
      }
    }
  }, [tmoModel, composedSelectedTmo, tprmNameWhenOpen]);

  const columns = useGetColumns({
    colsData: inventoryColumns,
    tmoId: selectedTmo!,
    visibleColumns,
    columnDimensions,
    customColumnsOrder: customColumnsOrder[selectedTmo as number],
  });

  const rows = useGetRows({ rowsData: inventoryRows?.objects });

  const allRowIds = useMemo(() => rows.map((row) => row.id), [rows]);

  const hasFilesColumn = useGetHasFilesColumn({
    isCheckboxSelection,
    setIsCheckboxSelection: (value: boolean) => setIsCheckboxSelection(value),
    setColumnsVisibility: (value: CompositeColumnsVisibilityItem) => setDetailedViewColumns(value),
    setSelectedRows: (value: GridRowSelectionModel) => setSelectedRows(value),
    allRowIds,
    tmoId: selectedTmo!,
    visibleColumns,
  });

  const totalColumns = [hasFilesColumn, ...columns];

  const renderTabs = () => {
    const tmoWithCorrectLabel = getElementsWithCorrectLabel(tmoModel);
    return tmoWithCorrectLabel.map((item) => {
      const { tmoName, tmoId, tprmName, label } = item;
      const compostedName = getComposedName(String(tmoId), tprmName);
      return (
        <Tab
          onClick={() => {
            handleChange(String(tmoId), tprmName ?? '');
          }}
          key={compostedName}
          label={label ?? tmoName}
          value={compostedName}
        />
      );
    });
  };

  const renderTabPanels = () => {
    return tmoModel.map((item) => {
      const { tmoId, tprmName } = item;
      const composedName = getComposedName(String(tmoId), tprmName);
      return (
        <TabPanel key={composedName} value={composedName}>
          <DetailedTable
            tmoId={+tmoId}
            rows={rows}
            columns={totalColumns}
            totalCount={inventoryRows ? inventoryRows.total_hits : 0}
            apiRef={apiRef}
            permissions={permissions}
            setIsFindPathOpen={setIsFindPathOpen}
          />
        </TabPanel>
      );
    });
  };

  if (!isLoading && !isDataLoading && !tmoModel.length) {
    return <DetailedTableCenteredContainer>{translate('No data')}</DetailedTableCenteredContainer>;
  }

  return (
    <Box sx={{ height: '95%', position: 'relative' }}>
      {(isLoading || isDataLoading) && (
        <DetailedTableLoadContainer>
          <LoadingAvataa />
        </DetailedTableLoadContainer>
      )}
      <TabContext value={String(composedSelectedTmo)}>
        <Box>
          <TabList>{renderTabs()}</TabList>
        </Box>
        {renderTabPanels()}
      </TabContext>
    </Box>
  );
};
