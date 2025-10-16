import { GridRowClassNameParams, GridValidRowModel } from '@mui/x-data-grid-premium';
import { HAS_FILES_COLUMN_ID } from '6_shared';

export const getRowClassName = (params: GridRowClassNameParams<GridValidRowModel>) => {
  let classNames = '';
  if (params.indexRelativeToCurrentPage % 2 === 0) {
    classNames += 'row-even ';
  } else {
    classNames += 'row-odd ';
  }

  if (params.row[HAS_FILES_COLUMN_ID] > 0) {
    classNames += ' has-file';
  }

  if (params.row['9881']?.startsWith('at_')) {
    classNames += ' inventory-table__test-object';
  }

  return classNames.trim();
};
