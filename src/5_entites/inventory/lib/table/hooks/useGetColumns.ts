import {
  InventoryParameterTypesModel,
  useTimezoneAdjustment,
  COLUMN_NAME_LENGTH_BREAKPOINT,
  COLUMNS_NUMBER_BREAKPOINT,
  ESTIMATE_SYMBOL_WIDTH,
  LONG_COLUMN_WIDTH,
  NOT_TPRM_COLUMNS_GROUP_NAME,
  NOT_TPRM_COLUMNS_NUMBER,
  OBJECT_NAME,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_ID_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  OBJECT_PARENT_COLUMN_ID,
  PARENT_PARAM_COLUMNS_GROUP_NAME,
  POINT_A_NAME,
  POINT_B_NAME,
  UNGROUPED_COLUMNS_GROUP_NAME,
  dateParser,
  setColumnType,
} from '6_shared';
import {
  GridColDef,
  GridRenderCellParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-premium';
import { useCallback, useMemo } from 'react';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { useGetRenderCell } from '../useGetRenderCell';

interface IProps {
  colsData?: InventoryParameterTypesModel[];
  tmoId?: number;
  visibleColumns?: Record<string, GridColumnVisibilityModel>;
  customColumnsOrder?: string[];
  isParentsData?: boolean;
  parentColsData?: InventoryParameterTypesModel[];
  columnDimensions?: Record<string, Record<string, GridColumnDimensions>>;
}

export const useGetColumns = ({
  colsData,
  tmoId,
  visibleColumns,
  customColumnsOrder,
  parentColsData,
  isParentsData,
  columnDimensions,
}: IProps): GridColDef[] => {
  const { getRenderCell, getRenderCellForAttributes } = useGetRenderCell();
  const { disableTimezoneAdjustment } = useTimezoneAdjustment();

  const visibleColumnsNumber = useMemo(() => {
    if (!visibleColumns || !colsData || !tmoId) return null;

    if (!visibleColumns[tmoId]) {
      return colsData.length;
    }

    const hiddenColumnsQty = Object.entries(visibleColumns[tmoId]).filter(
      ([key, value]) => value === false && !Number.isNaN(+key),
    ).length;
    return colsData.length + NOT_TPRM_COLUMNS_NUMBER - hiddenColumnsQty;
  }, [colsData, tmoId, visibleColumns]);

  const getColumnWidthByTitle = useCallback(
    (title: string) => {
      if (!visibleColumnsNumber) return null;
      if (visibleColumnsNumber >= COLUMNS_NUMBER_BREAKPOINT) {
        if (title.length > COLUMN_NAME_LENGTH_BREAKPOINT) {
          return LONG_COLUMN_WIDTH;
        }
        return title.length * ESTIMATE_SYMBOL_WIDTH * 1.1;
      }
      return undefined;
    },
    [visibleColumnsNumber],
  );

  const getColumnWidth = useCallback(
    (id: string, name: string) => {
      if (
        tmoId &&
        columnDimensions &&
        columnDimensions[tmoId] &&
        columnDimensions[tmoId][id]?.width
      )
        return columnDimensions[tmoId][id].width;
      return getColumnWidthByTitle(name);
    },
    [columnDimensions, getColumnWidthByTitle, tmoId],
  );

  const getColumnFlex = useCallback(
    (id: string) => {
      if (
        tmoId &&
        columnDimensions &&
        columnDimensions[tmoId] &&
        columnDimensions[tmoId][id]?.width
      )
        return undefined;

      if (
        tmoId &&
        columnDimensions &&
        columnDimensions[tmoId] &&
        columnDimensions[tmoId][id]?.flex
      ) {
        return columnDimensions[tmoId][id].flex;
      }
      return visibleColumnsNumber && visibleColumnsNumber < COLUMNS_NUMBER_BREAKPOINT
        ? 1
        : undefined;
    },
    [columnDimensions, tmoId, visibleColumnsNumber],
  );

  const notTprmColProto = {
    editable: false,
    align: 'left',
    headerAlign: 'left',
    sortable: true,
    filterable: true,
    disableReorder: true,
    group: NOT_TPRM_COLUMNS_GROUP_NAME,
  };

  const getAttributeCol = (id: string, name: string, type: string, linkId?: string) => {
    return {
      field: id,
      headerName: name,
      width: getColumnWidth(id, name),
      flex: getColumnFlex(id),
      type,
      renderCell: linkId
        ? (params: GridRenderCellParams) => getRenderCellForAttributes(params, linkId)
        : undefined,
      // May cause an error. Was (value) => dateParser(value?.value ?? value, type)
      valueGetter: (value: string) => dateParser(value, type, disableTimezoneAdjustment),
      ...notTprmColProto,
    };
  };

  const objectIdColumn = getAttributeCol(OBJECT_ID_COLUMN_ID, 'Object ID', 'number');
  const parentNameColumn = getAttributeCol(
    OBJECT_PARENT_COLUMN_ID,
    'Parent Name',
    'string',
    'p_id',
  );
  const creationDateColumn = getAttributeCol(
    OBJECT_CREATION_DATE_COLUMN_ID,
    'Creation Date',
    'dateTime',
  );
  const modificationDateColumn = getAttributeCol(
    OBJECT_MODIFICATION_DATE_COLUMN_ID,
    'Modification Date',
    'dateTime',
  );
  const pointANameColumn = getAttributeCol(POINT_A_NAME, 'Point A', 'string', 'point_a_id');
  const pointBNameColumn = getAttributeCol(POINT_B_NAME, 'Point B', 'string', 'point_b_id');
  const objectNameColumn = getAttributeCol(OBJECT_NAME, 'Object name', 'string');

  const getTprmColumns = useCallback(
    (data: InventoryParameterTypesModel[], columnRole: 'main' | 'parent') => {
      return data.map((column) => {
        const { id, group, name, val_type, constraint } = column;

        let valueOptions: string[] | undefined;
        try {
          const parsedConstraint =
            constraint && constraint.length ? JSON.parse(constraint.replace(/'/g, '"')) : undefined;
          valueOptions = Array.isArray(parsedConstraint) ? parsedConstraint : undefined;
        } catch (error) {
          // Unfortunately, this is the only way to handle errors
        }

        const type = setColumnType(val_type);
        const idAsString = String(id);

        const groupName =
          group && group.trim() ? String(group).trim() : UNGROUPED_COLUMNS_GROUP_NAME;
        return {
          field: idAsString,
          headerName: name,
          group: columnRole === 'main' ? groupName : PARENT_PARAM_COLUMNS_GROUP_NAME,
          width: getColumnWidth(idAsString, name),
          flex: getColumnFlex(idAsString),
          editable: false,
          sortable: columnRole === 'main',
          filterable: columnRole === 'main',
          type,
          align: type === 'boolean' ? 'center' : 'left',
          headerAlign: 'left',
          valueOptions,
          valueGetter: (value: string) => dateParser(value, type, disableTimezoneAdjustment),
          renderCell: (params: GridRenderCellParams) => getRenderCell({ params, type, val_type }),
        };
      });
    },
    [getColumnFlex, getColumnWidth, getRenderCell, disableTimezoneAdjustment],
  );

  const mainCols = useMemo(() => {
    if (!colsData) return [];

    return getTprmColumns(colsData, 'main');
  }, [colsData, getTprmColumns]);

  const parentCols = useMemo(() => {
    if (!parentColsData || !isParentsData) return [];

    return getTprmColumns(parentColsData, 'parent');
  }, [parentColsData, isParentsData, getTprmColumns]);

  const hasDuplicates = (array: any[]) => {
    return new Set(array).size !== array.length;
  };

  const columns = useMemo(() => {
    const tprms = [...mainCols, ...parentCols];

    const columnIds = tprms.map((column) => column.field);

    if (hasDuplicates(columnIds)) return [];

    const cols = [
      ...tprms,
      parentNameColumn,
      objectIdColumn,
      creationDateColumn,
      modificationDateColumn,
      pointANameColumn,
      pointBNameColumn,
      objectNameColumn,
    ].sort((a, b) => (a.group < b.group ? -1 : 1)) as GridColDef[];

    if (customColumnsOrder && customColumnsOrder.length) {
      return cols.sort((a, b) => {
        const indexA = customColumnsOrder.indexOf(a.field);
        const indexB = customColumnsOrder.indexOf(b.field);

        return indexA - indexB;
      });
    }

    return cols;
  }, [mainCols, parentCols, visibleColumnsNumber, customColumnsOrder]);

  if (!colsData || !tmoId) return [];

  return columns;
};
