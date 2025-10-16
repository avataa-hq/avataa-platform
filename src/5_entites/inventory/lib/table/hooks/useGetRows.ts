import {
  ObjectByFilters,
  HAS_FILE,
  HAS_FILES_COLUMN_ID,
  OBJECT_NAME,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_ID_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  OBJECT_PARENT_COLUMN_ID,
  POINT_A_NAME,
  POINT_B_NAME,
} from '6_shared';
import { useMemo } from 'react';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';

interface IProps {
  rowsData?: ObjectByFilters[];
  rowsParentData?: ObjectByFilters[];
}

export const useGetRows = ({ rowsData, rowsParentData }: IProps): GridRowsProp => {
  const rows = useMemo(() => {
    if (!rowsData) return [];

    return rowsData.map((row) => {
      let parentObjectsParameters = {};
      if (row.p_id && rowsParentData) {
        parentObjectsParameters =
          rowsParentData.find((parentRow) => parentRow.id === row.p_id)?.parameters ?? {};
      }

      return {
        ...row.parameters,
        ...parentObjectsParameters,
        [HAS_FILES_COLUMN_ID]: row[HAS_FILES_COLUMN_ID],
        [OBJECT_ID_COLUMN_ID]: row[OBJECT_ID_COLUMN_ID],
        [OBJECT_PARENT_COLUMN_ID]: row.parent_name ?? '-',
        [OBJECT_CREATION_DATE_COLUMN_ID]: row[OBJECT_CREATION_DATE_COLUMN_ID]
          ? `${row[OBJECT_CREATION_DATE_COLUMN_ID]}Z`
          : '-',
        [OBJECT_MODIFICATION_DATE_COLUMN_ID]: row[OBJECT_MODIFICATION_DATE_COLUMN_ID] ?? '-',
        [POINT_A_NAME]: row[POINT_A_NAME] ?? '-',
        [POINT_B_NAME]: row[POINT_B_NAME] ?? '-',
        [OBJECT_NAME]: row[OBJECT_NAME] ?? '-',
        [HAS_FILE]: !!row.document_count,
      };
    });
  }, [rowsData, rowsParentData]);

  return rows;
};
