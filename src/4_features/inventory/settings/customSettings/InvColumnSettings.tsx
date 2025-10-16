import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';

import {
  CustomSettingsComponent,
  tableColumnSettingsApi,
  useTranslate,
  ActionTypes,
  ITableColumnSettingsModel,
  CompositeColumnsOrderItem,
  CompositeSortingItem,
  CompositeIsCustomColumnsSetActiveItem,
  CompositeColumnsVisibilityItem,
  CompositePinnedColumnsItem,
  CompositeIsDefaultSettingsBlockedItem,
  CompositeColumnDimensionsItem,
} from '6_shared';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tableApiRef: MutableRefObject<GridApiPremium>;
  tmoId: number;
  permissions?: Record<ActionTypes, boolean>;
  setCustomColumnDimensions?: (dimensions: CompositeColumnDimensionsItem) => void;
  setCustomColumnsOrder?: (order: CompositeColumnsOrderItem) => void;
  setCustomSorting?: (sorting: CompositeSortingItem) => void;
  setCustomVisibleColumns?: (columns: CompositeColumnsVisibilityItem) => void;
  setCustomPinnedColumns?: (column: CompositePinnedColumnsItem) => void;
  setDefaultColumnsSettings?: (setttings: ITableColumnSettingsModel | undefined) => void;
  setIsCustomColumnsSetActive?: (isActive: CompositeIsCustomColumnsSetActiveItem) => void;
  isCustomColumnsSetActive?: Record<string, boolean>;
  setIsDefaultSettingsBlocked?: (isBlocked: CompositeIsDefaultSettingsBlockedItem) => void;
  isDefaultSettingsBlocked?: Record<string, boolean>;
  selectedTab?: string;
}

export const InvColumnSettings = ({
  isOpen,
  setIsOpen,
  tableApiRef,
  tmoId,
  permissions,
  setCustomColumnDimensions,
  setCustomColumnsOrder,
  setCustomSorting,
  setDefaultColumnsSettings,

  setCustomVisibleColumns,
  setCustomPinnedColumns,
  setIsCustomColumnsSetActive,
  isCustomColumnsSetActive,
  setIsDefaultSettingsBlocked,
  isDefaultSettingsBlocked,

  selectedTab,
}: IProps) => {
  const {
    useGetDefaultSettingsByTmoQuery,
    useGetAllSettingsByTmoQuery,
    useDeleteSettingByIdMutation,
    useLazyGetSettingsBySettingIdQuery,
    useCreateNewSettingToTmoMutation,
    useUpdateSettingByIdMutation,
  } = tableColumnSettingsApi;

  const translate = useTranslate();

  const [selectedSetId, setSelectedSetId] = useState<number>(-1);

  const [addNewColumnsSetting] = useCreateNewSettingToTmoMutation();
  const [updateColumnsSetting] = useUpdateSettingByIdMutation();
  const [getSettingsById] = useLazyGetSettingsBySettingIdQuery();
  // const [getDefaultColumnSet] = useLazyGetDefaultSettingsByTmoQuery();

  const { data: allSettingsByTmo, isFetching: isLoadingSettingsList } = useGetAllSettingsByTmoQuery(
    tmoId!,
    {
      skip: !tmoId,
    },
  );
  const { data: defaultSettingsByTmo } = useGetDefaultSettingsByTmoQuery(tmoId!, {
    skip: !tmoId,
  });
  const [deleteSetting] = useDeleteSettingByIdMutation();

  const updateSettings = useCallback(
    (settings: ITableColumnSettingsModel) => {
      if (!settings || !tmoId) return;
      setDefaultColumnsSettings?.(settings);
      const { value, id } = settings;
      setSelectedSetId(id);

      if (value?.tableInitialState) {
        // if (value?.tableInitialState && (!isDefault || (isDefault && !isDefaultBlocked))) {
        const { columns, pinnedColumns, sorting } = value.tableInitialState;
        const { columnVisibilityModel, orderedFields, dimensions } = { ...columns };

        // Set dimensions
        if (dimensions) {
          setCustomColumnDimensions?.({ tmoId, columnDimensions: dimensions });
        }

        // Set visibility
        if (columnVisibilityModel) {
          setCustomVisibleColumns?.({ tmoId, visibleColumns: columnVisibilityModel });
        }

        // Set pinned
        if (pinnedColumns) {
          setCustomPinnedColumns?.({ tmoId, pinnedColumns });
        }

        // Set order
        if (orderedFields) {
          setCustomColumnsOrder?.({ tmoId, columnsOrder: orderedFields });
        }

        // Set sorting
        if (sorting?.sortModel) {
          setTimeout(() => {
            // tableApiRef.current?.setSortModel?.(sorting.sortModel!);
            setCustomSorting?.({ tmoId, sorting: sorting.sortModel! });
          }, 500);
        }

        // Set is custom columns set active
        setIsCustomColumnsSetActive?.({ tmoId, isCustomColumnsSetActive: true });
      }
    },
    [
      tmoId,
      setDefaultColumnsSettings,
      setIsCustomColumnsSetActive,
      setCustomColumnDimensions,
      setCustomVisibleColumns,
      setCustomPinnedColumns,
      setCustomColumnsOrder,
    ],
  );

  const onApplyClick = useCallback(
    async (setId: number) => {
      const currentSetting = await getSettingsById(setId).unwrap();
      updateSettings(currentSetting);
    },
    [getSettingsById, updateSettings],
  );

  useEffect(() => {
    if (!defaultSettingsByTmo?.value) {
      setIsCustomColumnsSetActive?.({ tmoId, isCustomColumnsSetActive: false });
    }
  }, [defaultSettingsByTmo, setIsCustomColumnsSetActive, tmoId]);

  useEffect(() => {
    const hasIdInSettings = allSettingsByTmo?.some((setting) => setting.id === selectedSetId);

    if (!hasIdInSettings && defaultSettingsByTmo) {
      updateSettings(defaultSettingsByTmo);
    }
  }, [allSettingsByTmo, defaultSettingsByTmo, selectedSetId, updateSettings]);

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
      title={translate('Select Columns Set')}
      permissions={permissions}
    />
  );
};
