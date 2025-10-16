import { GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid-premium';
import { useMemo } from 'react';
import { COLUMN_GROUPING_DISABLED } from '../../model/constants';

const hasDuplicates = (array: any[]) => {
  return new Set(array).size !== array.length;
};

export type GridColDefWithGroups = GridColDef & { group: string };

interface IProps {
  columns: GridColDefWithGroups[];
}

export const useColumnGrouping = ({ columns }: IProps) => {
  const groupedColumns = useMemo<Record<string, string[]>>(() => {
    if (columns.length === 0) return {};
    const groupedIds: Record<string, string[]> = {};
    const columnIds = columns.map((column) => column.field);

    if (hasDuplicates(columnIds)) return {};

    columns.forEach((param) => {
      const { field, group } = param;

      if (group === COLUMN_GROUPING_DISABLED) return;
      if (groupedIds[group]) {
        groupedIds[group].push(field);
      } else {
        groupedIds[group] = [field];
      }
    });
    return groupedIds;
  }, [columns]);

  const columnGroupingModel = useMemo<GridColumnGroupingModel>(() => {
    if (columns.length === 0) return [];

    const columnIds = columns.map((column) => column.field);

    if (hasDuplicates(columnIds)) return [];

    return columns.reduce((acc, curr) => {
      const { group, field } = curr;
      const param = {
        field,
      };

      if (group === COLUMN_GROUPING_DISABLED) return acc;

      const groupIndex = acc.findIndex((item: any) => item.groupId === group);
      if (groupIndex > -1 && group) {
        acc[groupIndex].children.push(param);
      } else {
        acc.push({
          groupId: group,
          headerName: group,
          freeReordering: false,
          children: [param],
          headerClassName: 'groupHeader',
        });
      }

      return acc;
    }, [] as GridColumnGroupingModel);
  }, [columns]);

  return { groupedColumns, columnGroupingModel };
};
