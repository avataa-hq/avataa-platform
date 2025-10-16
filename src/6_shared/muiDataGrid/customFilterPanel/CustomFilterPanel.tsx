import { GridColDef, useGridApiContext } from '@mui/x-data-grid-premium';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { GridFilterModel } from '@mui/x-data-grid/models/gridFilterModel';
import { Body, CustomFilterPanelStyled } from './CustomFilterPanel.styled';
import {
  INestedFilterColumn,
  INestedMultiFilterForm,
  NestedMultiFilter,
  transformFromDataGridModel,
} from '../../ui';
import {
  COLUMN_NAME_SEPARATOR,
  FilterDataType,
  COLUMN_TYPE_SEPARATOR,
} from '../../ui/nestedMultiFilter/config';

export type ColsHash = Record<string, GridColDef>;

const transformGridColumnId = (
  gridFilter: GridFilterModel,
  columnHash: ColsHash,
): GridFilterModel => {
  const { items } = gridFilter;

  const newItems = items.map((i, idx) => {
    const currentColumn = columnHash[i.field];

    const { id, field } = i;

    let correctId = id;
    let correctField = field;

    if (id && typeof id !== 'string') {
      if (currentColumn) {
        const { headerName } = currentColumn;
        correctId = `${id}${COLUMN_NAME_SEPARATOR}${headerName}${COLUMN_NAME_SEPARATOR}${idx}`;
      }
    }
    if (!field.includes(COLUMN_TYPE_SEPARATOR)) {
      if (currentColumn) {
        correctField = `${field}${COLUMN_TYPE_SEPARATOR}${currentColumn.type}`;
      }
    }
    return { ...i, id: correctId, field: correctField };
  });
  return { ...gridFilter, items: newItems };
};

export const transformFromDataGrid = (gridFilter: GridFilterModel, columnHash: ColsHash) => {
  const gridWithCorrectId = transformGridColumnId(gridFilter, columnHash);
  return transformFromDataGridModel(gridWithCorrectId);
};

interface IProps {
  onApply?: (filterForm: INestedMultiFilterForm) => void;
  onClearAll?: () => void;
}

declare module '@mui/x-data-grid' {
  interface FilterPanelPropsOverrides extends IProps {}
}

export const CustomFilterPanel = forwardRef<HTMLDivElement, IProps>(
  ({ onApply, onClearAll }, ref) => {
    const apiRef = useGridApiContext();

    const currentColumns = apiRef.current.getAllColumns();
    const { filterModel } = apiRef.current.state.filter;

    const [filterState, setFilterState] = useState<INestedMultiFilterForm>({
      columnFilters: [],
    });

    const columnsList = useMemo<INestedFilterColumn[]>(() => {
      if (!currentColumns || !currentColumns.length) return [];

      return currentColumns.flatMap((cc) =>
        cc.filterable
          ? ({
              id: cc.field,
              name: (cc.headerName ?? '') as string,
              type: cc.type as FilterDataType,
              // @ts-ignore
              selectOptions: cc?.valueOptions,
            } as INestedFilterColumn)
          : [],
      );
    }, [currentColumns]);

    const columnsHash = useMemo<ColsHash>(() => {
      return currentColumns.reduce((acc, col) => {
        acc[col.field] = col;
        return acc;
      }, {} as ColsHash);
    }, [currentColumns]);

    const onApplyFilter = (filterForm: INestedMultiFilterForm) => {
      apiRef.current.hideFilterPanel();
      setFilterState(filterForm);
      onApply?.(filterForm);
    };
    const onClear = () => {
      setFilterState((prev) => ({ ...prev, columnFilters: [] }));
      apiRef.current.setFilterModel({ items: [] });

      onClearAll?.();
      apiRef.current.hideFilterPanel();
    };

    useEffect(() => {
      const filterMulti = transformFromDataGrid(filterModel, columnsHash);
      setFilterState((prev) => ({ ...prev, columnFilters: filterMulti }));
    }, [filterModel, columnsHash]);

    useEffect(() => {
      filterState.columnFilters.forEach((filter) => {
        const { id } = filter.column;
        apiRef.current?.setColumnHeaderFilterFocus(id);
      });
    }, [apiRef, filterState.columnFilters, currentColumns]);

    return (
      <CustomFilterPanelStyled ref={ref}>
        <Body>
          <NestedMultiFilter
            onApply={onApplyFilter}
            onClear={onClear}
            disableTitle
            disableExpandAllButton
            multiFilterData={{ columnsData: { list: columnsList }, filterState }}
          />
        </Body>
      </CustomFilterPanelStyled>
    );
  },
);
