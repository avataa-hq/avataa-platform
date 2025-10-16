import { useMemo } from 'react';
import { SeverityProcessModel, SeverityProcessModelData } from '6_shared';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { GridColDefWithGroups } from './types';

interface IProps {
  severityProcessData?: SeverityProcessModel;
  columns: GridColDefWithGroups[];

  userTasksData?: Record<string, any>[];
}
export const useGetRowsData = ({ severityProcessData, columns }: IProps) => {
  const rows = useMemo<GridRowsProp<SeverityProcessModelData>>(() => {
    if (!severityProcessData || !columns || !columns.length) return [];
    const getId = (id: string | undefined, groupName: string | undefined) => {
      if (id != null) {
        if (groupName != null) return `${String(id)}${groupName}`;
        return String(id);
      }
      return undefined;
    };
    return severityProcessData.rows.map((r, idx) => {
      return {
        ...r,
        id: getId(r.id, r?.groupName) || String(idx),
        groupName: r?.groupName,
      };
    });
  }, [severityProcessData, columns]);

  return { rows };
};
