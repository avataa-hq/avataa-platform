import {
  GridColDef,
  GridColumnHeaderParams,
  GridSortDirection,
  GridSortModel,
  GridValidRowModel,
  MuiEvent,
} from '@mui/x-data-grid-premium';
import { MouseEvent, MutableRefObject } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid/colDef/gridCheckboxSelectionColDef';
import { CompositeSortingItem } from '../../model';
import { HAS_FILE } from '../../model/constants';

interface IProps {
  tmoId?: number;
  apiRef: MutableRefObject<GridApiPremium>;
  currentModel?: GridSortModel;
  setTableSorting?: (value: CompositeSortingItem) => void;
}

export const useSorting = ({ tmoId, currentModel, setTableSorting, apiRef }: IProps) => {
  const setSorting = (newModel: GridSortModel) => {
    if (!tmoId) return;
    setTableSorting?.({ tmoId, sorting: newModel });
  };

  const onColumnHeaderClick = (
    col: GridColumnHeaderParams<GridValidRowModel, any, any>,
    e: MuiEvent<MouseEvent<HTMLElement, globalThis.MouseEvent>>,
  ) => {
    if (col.field === GRID_CHECKBOX_SELECTION_FIELD || col.field === HAS_FILE) return;

    const { state } = apiRef.current;
    let sortDirection: GridSortDirection;

    const sortCol = state.sorting.sortModel.find((sm) => sm.field === col.field);
    if (!sortCol) sortDirection = 'asc';
    else if (sortCol.sort === 'asc') sortDirection = 'desc';

    let correctSorting: GridSortModel = [];

    const isShift = e.shiftKey;

    if (isShift) {
      if (!currentModel || !currentModel.length) {
        correctSorting = sortDirection ? [{ field: col.field, sort: sortDirection }] : [];
      } else {
        const currentElement = currentModel.find((elem) => elem.field === col.field);
        if (currentElement) {
          correctSorting = currentModel.flatMap((item) => {
            if (item.field === col.field) {
              if (!sortDirection) return [];
              return { ...item, sort: sortDirection };
            }
            return item;
          });
        } else {
          correctSorting = sortDirection
            ? [...currentModel, { field: col.field, sort: sortDirection }]
            : [];
        }
      }
    } else {
      correctSorting = sortDirection ? [{ field: col.field, sort: sortDirection }] : [];
    }

    setSorting(correctSorting);
  };
  const onColumnMenuSortingItemClick = (sort: GridSortDirection, col: GridColDef) => {
    setSorting(sort ? [{ field: col.field, sort }] : []);
  };

  return { setSorting, onColumnHeaderClick, onColumnMenuSortingItemClick };
};
