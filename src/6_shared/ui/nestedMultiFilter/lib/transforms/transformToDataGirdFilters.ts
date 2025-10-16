import { type GridFilterItem } from '@mui/x-data-grid';
import { INestedMultiFilterItem } from '../../types';
import { COLUMN_NAME_SEPARATOR, defaultOperators } from '../../config';

const transformSomeOperators = (operator: string, type: string) => {
  const currentOperatorsDict = defaultOperators[type];
  return operator;
};

export const getGridFilterItems = (
  multiFilterFilters: INestedMultiFilterItem[],
): GridFilterItem[] => {
  const gridItem: GridFilterItem[] = [];
  multiFilterFilters.forEach((item) => {
    item.filters.forEach((f, idx) => {
      const uniqueId = `${item.column.id}${COLUMN_NAME_SEPARATOR}${item.column.name}${COLUMN_NAME_SEPARATOR}${idx}`;
      gridItem.push({
        operator: transformSomeOperators(f.operator, item.column.type),
        value: f.value,
        id: uniqueId,
        field: item.column.id,
      });
    });
  });
  return gridItem;
};
