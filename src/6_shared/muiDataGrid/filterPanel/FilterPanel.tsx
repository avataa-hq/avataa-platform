import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import {
  GridFilterItem,
  GridLogicOperator,
  useGridApiContext,
  GridPanelContent,
  GridPanelFooter,
  GridPanelWrapper,
  GridFilterForm,
  GridFilterFormProps,
  useGridRootProps,
  useGridSelector,
  gridFilterModelSelector,
  gridFilterableColumnDefinitionsSelector,
  GridColDef,
  GridFilterModel,
} from '@mui/x-data-grid-premium';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { useTranslate } from '6_shared';
import { useCallback } from 'react';

interface GetColumnForNewFilterArgs {
  currentFilters: GridFilterItem[];
  columns: GridColDef[];
}

interface GridFilterPanelProps extends Pick<GridFilterFormProps, 'logicOperators' | 'columnsSort'> {
  sx?: SxProps<Theme>;
  getColumnForNewFilter?: (args: GetColumnForNewFilterArgs) => GridColDef['field'] | null;
  filterFormProps?: Pick<
    GridFilterFormProps,
    | 'columnsSort'
    | 'deleteIconProps'
    | 'logicOperatorInputProps'
    | 'operatorInputProps'
    | 'columnInputProps'
    | 'valueInputProps'
    | 'filterColumns'
  >;
  disableAddFilterButton?: boolean;
  disableRemoveAllButton?: boolean;
  setFilters?: (filterModel?: GridFilterModel) => void;
  onRemoveAll?: () => void;
  children?: React.ReactNode;
}

const getGridFilter = (col: any): GridFilterItem => ({
  field: col.field,
  operator: col.filterOperators![0].value,
  id: Math.round(Math.random() * 1e5),
});

declare module '@mui/x-data-grid' {
  interface FilterPanelPropsOverrides {
    setFilters?: (newModel: GridFilterModel) => void;
    onRemoveAll?: () => void;
  }
}

export const FilterPanel = React.forwardRef<HTMLDivElement, GridFilterPanelProps>(
  function InventoryColumnsPanel(props, ref) {
    const translate = useTranslate();
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const lastFilterRef = React.useRef<any>(null);
    const placeholderFilter = React.useRef<GridFilterItem | null>(null);

    const {
      logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
      columnsSort,
      filterFormProps,
      getColumnForNewFilter,
      children,
      disableAddFilterButton = false,
      disableRemoveAllButton = false,
      setFilters,
      onRemoveAll,
      sx,
      ...other
    } = props;

    const applyFilter = useCallback(
      (item: GridFilterItem) => {
        apiRef.current.upsertFilterItem(item);
      },
      [apiRef],
    );

    const applyFilterLogicOperator = React.useCallback(
      (operator: GridLogicOperator) => {
        apiRef.current.setFilterLogicOperator(operator);
      },
      [apiRef],
    );

    const getDefaultFilter = React.useCallback((): GridFilterItem | null => {
      let nextColumnWithOperator;
      if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
        // To allow override the column for default (first) filter
        const nextFieldName = getColumnForNewFilter({
          currentFilters: filterModel?.items || [],
          columns: filterableColumns,
        });

        if (nextFieldName === null) {
          return null;
        }

        nextColumnWithOperator = filterableColumns.find(({ field }) => field === nextFieldName);
      } else {
        nextColumnWithOperator = filterableColumns.find((colDef) => colDef.filterOperators?.length);
      }

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel?.items, filterableColumns, getColumnForNewFilter]);

    const getNewFilter = React.useCallback((): GridFilterItem | null => {
      if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
        return getDefaultFilter();
      }

      const currentFilters = filterModel.items.length
        ? filterModel.items
        : [getDefaultFilter()].filter(Boolean);

      // If no items are there in filterModel, we have to pass defaultFilter
      const nextColumnFieldName = getColumnForNewFilter({
        currentFilters: currentFilters as GridFilterItem[],
        columns: filterableColumns,
      });

      if (nextColumnFieldName === null) {
        return null;
      }

      const nextColumnWithOperator = filterableColumns.find(
        ({ field }) => field === nextColumnFieldName,
      );

      if (!nextColumnWithOperator) {
        return null;
      }

      return getGridFilter(nextColumnWithOperator);
    }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);

    const items = React.useMemo<GridFilterItem[]>(() => {
      if (filterModel.items.length) {
        return filterModel.items;
      }

      if (!placeholderFilter.current) {
        placeholderFilter.current = getDefaultFilter();
      }

      return placeholderFilter.current ? [placeholderFilter.current] : [];
    }, [filterModel.items, getDefaultFilter]);

    const hasMultipleFilters = items.length > 1;

    const addNewFilter = () => {
      const newFilter = getNewFilter();
      if (!newFilter) {
        return;
      }
      apiRef.current.upsertFilterItems([...items, newFilter]);
    };

    const deleteFilter = React.useCallback(
      (item: GridFilterItem) => {
        const shouldCloseFilterPanel = items.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
          apiRef.current.hideFilterPanel();
        }
      },
      [apiRef, items.length],
    );

    const handleRemoveAll = () => {
      if (items.length === 1 && items[0].value === undefined) {
        apiRef.current.deleteFilterItem(items[0]);
        apiRef.current.hideFilterPanel();
      }
      apiRef.current.setFilterModel({ ...filterModel, items: [] });
    };

    React.useEffect(() => {
      if (
        logicOperators.length > 0 &&
        filterModel.logicOperator &&
        !logicOperators.includes(filterModel.logicOperator)
      ) {
        applyFilterLogicOperator(logicOperators[0]);
      }
    }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);

    React.useEffect(() => {
      if (items.length > 0) {
        lastFilterRef.current!.focus();
      }
    }, [items.length]);

    return (
      <GridPanelWrapper
        ref={ref}
        sx={{
          ...sx,
          '& .MuiDataGrid-filterFormColumnInput': { flex: 1.2 },
          '& .MuiDataGrid-filterFormOperatorInput': { flex: 1 },
          '& .MuiDataGrid-filterFormValueInput': { flex: 1 },
          '& .MuiDataGrid-filterFormLogicOperatorInput': { flex: 0.8 },
        }}
        {...other}
      >
        <GridPanelContent>
          {items.map((item, index) => (
            <GridFilterForm
              key={item.id == null ? index : item.id}
              item={item}
              applyFilterChanges={applyFilter}
              deleteFilter={deleteFilter}
              hasMultipleFilters={hasMultipleFilters}
              showMultiFilterOperators={index > 0}
              // multiFilterOperator={filterModel.logicOperator}
              disableMultiFilterOperator={index !== 1}
              applyMultiFilterOperatorChanges={applyFilterLogicOperator}
              focusElementRef={index === items.length - 1 ? lastFilterRef : null}
              logicOperators={logicOperators}
              columnsSort={columnsSort}
              {...filterFormProps}
            />
          ))}
        </GridPanelContent>
        {!rootProps.disableMultipleColumnsFiltering &&
        !(disableAddFilterButton && disableRemoveAllButton) ? (
          <GridPanelFooter>
            {!disableAddFilterButton ? (
              <rootProps.slots.baseButton
                onClick={addNewFilter}
                startIcon={<rootProps.slots.filterPanelAddIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelAddFilter')}
              </rootProps.slots.baseButton>
            ) : (
              <span />
            )}

            {!disableRemoveAllButton ? (
              <rootProps.slots.baseButton
                onClick={() => {
                  handleRemoveAll();
                  onRemoveAll?.();
                }}
                startIcon={<rootProps.slots.filterPanelRemoveAllIcon />}
                {...rootProps.slotProps?.baseButton}
              >
                {apiRef.current.getLocaleText('filterPanelRemoveAll')}
              </rootProps.slots.baseButton>
            ) : null}
            <rootProps.slots.baseButton
              onClick={() => setFilters?.(filterModel)}
              startIcon={<ArrowCircleRightOutlinedIcon />}
              {...rootProps.slotProps?.baseButton}
            >
              {translate('Apply filters')}
            </rootProps.slots.baseButton>
          </GridPanelFooter>
        ) : null}
      </GridPanelWrapper>
    );
  },
);
