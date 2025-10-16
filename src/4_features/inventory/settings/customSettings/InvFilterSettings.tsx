import { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';

import {
  CustomSettingsComponent,
  tableFilterSettingsApi,
  useTranslate,
  ActionTypes,
  transformFromDataGrid,
  ColsHash,
  CompositeFiltersItem,
  CompositeIsCustomFilters,
  useInventoryTable,
} from '6_shared';
import { useFilters } from '6_shared/muiDataGrid/lib/hooks';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tableApiRef: MutableRefObject<GridApiPremium>;
  tmoId: number;
  permissions?: Record<ActionTypes, boolean>;
}

export const InvFilterSettings = ({
  isOpen,
  setIsOpen,
  tableApiRef,
  tmoId,
  permissions,
}: IProps) => {
  const {
    useGetDefaultFilterSettingsByTmoQuery,
    useGetAllFilterSettingsByTmoQuery,
    useDeleteFilterSettingByIdMutation,
    useLazyGetFilterSettingsByIdQuery,
    useCreateNewFilterSettingForTmoMutation,
    useUpdateFilterSettingByIdMutation,
  } = tableFilterSettingsApi;
  const translate = useTranslate();

  const { filters, isCustomFiltersSetActive, setIsCustomFiltersSetActive, setSelectedFilter } =
    useInventoryTable();

  const { restoreState, getAllColumns } = tableApiRef?.current || {};
  const currentColumns = getAllColumns?.();

  const [selectedSetId, setSelectedSetId] = useState<number>(-1);

  const [addNewColumnsSetting] = useCreateNewFilterSettingForTmoMutation();
  const [updateColumnsSetting] = useUpdateFilterSettingByIdMutation();
  const [getSettingsById] = useLazyGetFilterSettingsByIdQuery();
  const { data: allSettingsByTmo, isFetching: isLoadingSettingsList } =
    useGetAllFilterSettingsByTmoQuery(tmoId!, {
      skip: !tmoId,
    });
  const { data: defaultSettingsByTmo } = useGetDefaultFilterSettingsByTmoQuery(tmoId!, {
    skip: !tmoId,
  });
  const [deleteSetting] = useDeleteFilterSettingByIdMutation();

  const restoreTableState = useCallback(
    (itemState?: GridInitialStatePremium) => {
      if (!restoreState || !itemState) return;
      restoreState(itemState);
    },
    [restoreState],
  );

  const handleSetFilters = (value: CompositeFiltersItem) => {
    setSelectedFilter(value);
  };

  const handleSetIsCustomFilters = (value: CompositeIsCustomFilters) => {
    setIsCustomFiltersSetActive(value);
  };

  const { setFilters } = useFilters({
    tmoId,
    setTableFilters: handleSetFilters,
    setIsCustomFilters: handleSetIsCustomFilters,
  });

  const columnsHash = useMemo<ColsHash>(() => {
    if (!currentColumns) return {};
    return currentColumns.reduce((acc, col) => {
      acc[col.field] = col;
      return acc;
    }, {} as ColsHash);
  }, [currentColumns]);

  // TODO: fix type mismatch, refactor custom settings components

  useEffect(() => {
    if (defaultSettingsByTmo?.value && !filters[tmoId]) {
      const filterModel =
        // @ts-ignore
        defaultSettingsByTmo?.value?.tableInitialState?.filter?.filterModel ??
        defaultSettingsByTmo?.value;
      const filtersFromDataGrid = transformFromDataGrid(filterModel, columnsHash);
      setFilters({ columnFilters: filtersFromDataGrid });
      restoreTableState({
        filter: { filterModel },
      });

      const defaultSettingId = defaultSettingsByTmo.id;
      setSelectedSetId(defaultSettingId);
      setIsCustomFiltersSetActive({ tmoId, isCustomFiltersSetActive: true });
    }
  }, [defaultSettingsByTmo]);

  const onApplyClick = useCallback(
    async (setId: number) => {
      const currentSetting = await getSettingsById(setId).unwrap();
      const filterModel =
        // @ts-ignore
        currentSetting?.value?.tableInitialState?.filter?.filterModel ?? currentSetting?.value;
      if (currentSetting?.value) {
        const filtersFromDataGrid = transformFromDataGrid(filterModel, columnsHash);
        setFilters({ columnFilters: filtersFromDataGrid });
        tableApiRef.current.setFilterModel(filterModel);

        restoreTableState({
          filter: { filterModel },
        });
        setIsCustomFiltersSetActive({ tmoId, isCustomFiltersSetActive: true });
      }
    },
    [getSettingsById, allSettingsByTmo, columnsHash],
  );

  useEffect(() => {
    if (!isCustomFiltersSetActive[tmoId]) {
      setSelectedSetId(-1);
    }
  }, [isCustomFiltersSetActive]);

  return (
    <CustomSettingsComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      tableApiRef={tableApiRef}
      tmoId={tmoId}
      addNewSettings={addNewColumnsSetting}
      updateSettings={updateColumnsSetting}
      getSettingsById={getSettingsById}
      allSettingsByTmo={allSettingsByTmo}
      isLoadingSettingsList={isLoadingSettingsList}
      defaultSettingsByTmo={defaultSettingsByTmo}
      deleteSetting={deleteSetting}
      selectedSetId={selectedSetId}
      setSelectedSetId={setSelectedSetId}
      onApplyClick={onApplyClick}
      title={translate('Select Filters Set')}
      permissions={permissions}
    />
  );
};
