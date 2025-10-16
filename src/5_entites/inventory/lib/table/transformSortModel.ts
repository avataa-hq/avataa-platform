import { GridSortModel } from '@mui/x-data-grid-premium';

export const transformSortModel = (sortModel: GridSortModel) => {
  if (!sortModel) return undefined;

  return sortModel.map((item) => ({
    columnName: item.field,
    ascending: item.sort === 'asc',
  }));
};
