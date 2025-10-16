import { useEffect, useMemo, useState } from 'react';
import {
  CAMUNDA_COLUMNS_GROUP_NAME,
  camundaColumns,
  InventoryParameterTypesModel,
  useTimezoneAdjustment,
} from '6_shared';
import { GridColumnGroupingModel } from '@mui/x-data-grid-premium';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { ColorDataByTprms, GridColDefWithGroups, ICommonColumnModel } from './types';
import { getCompiledTableColumns } from './getCompiledTableColumns';

const sortColumns = (a: GridColDefWithGroups, b: GridColDefWithGroups) => {
  if (a.field === 'groupName') return -1;
  if (b.field === 'groupName') return 1;

  if (a.group === CAMUNDA_COLUMNS_GROUP_NAME) return 1;
  if (b.group === CAMUNDA_COLUMNS_GROUP_NAME) return -1;

  const aHasGroup = a.group && a.group.length > 0;
  const bHasGroup = b.group && b.group.length > 0;

  if (aHasGroup && !bHasGroup) return -1;
  if (!aHasGroup && bHasGroup) return 1;

  if (a.group < b.group) return -1;
  if (a.group > b.group) return 1;
  if (a.group < b.group) return -1;
  if (a.group > b.group) return 1;
  return 0;
};

const getGroupedParams = (columns: GridColDefWithGroups[]) => {
  return columns.reduce((acc: GridColumnGroupingModel, curr) => {
    const { group, field } = curr;
    const param = { field };

    const groupIndex = acc.findIndex((item: any) => item.groupId === group);
    if (groupIndex > -1) {
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
  }, []);
};

interface IProps {
  coloringDataByColumnId: ColorDataByTprms;
  returnableParamTypes?: InventoryParameterTypesModel[];
  customColumnDimensions: Record<string, GridColumnDimensions>;
}
export const useGetColsData = ({
  coloringDataByColumnId,
  returnableParamTypes,
  customColumnDimensions,
}: IProps) => {
  const [columns, setColumns] = useState<GridColDefWithGroups[]>([]);
  const [columnGroupingModel, setColumnGroupingModel] = useState<GridColumnGroupingModel>([]);
  const [groupedColumns, setGroupedColumns] = useState<Record<string, string[]>>({});
  const { disableTimezoneAdjustment } = useTimezoneAdjustment();

  const assembledColumnsWithCamunda = useMemo<ICommonColumnModel[]>(() => {
    const allColumns: ICommonColumnModel[] = [];

    returnableParamTypes?.forEach((tprm) => {
      const { id, name, val_type, group, constraint } = tprm;
      let selectValueOptions: string[] | undefined;
      try {
        const parsedConstraint =
          val_type === 'enum' && constraint && constraint.length
            ? JSON.parse(constraint.replace(/'/g, '"'))
            : undefined;
        selectValueOptions = Array.isArray(parsedConstraint) ? parsedConstraint : undefined;
      } catch (error) {
        // Unfortunately, this is the only way to handle errors
      }

      allColumns.push({
        id: String(id),
        name,
        val_type,
        group,
        selectValueOptions,
      });
    });

    return [...allColumns, ...camundaColumns];
  }, [returnableParamTypes]);

  // ===== Get columns where the numeric column names (tprms) are replaced with readable names.
  useEffect(() => {
    const assembledColumns = getCompiledTableColumns({
      colorsData: coloringDataByColumnId,
      columnsData: assembledColumnsWithCamunda,
      disableTimezoneAdjustment,
      customColumnDimensions,
    });
    setColumnGroupingModel(getGroupedParams(assembledColumns));
    setColumns(assembledColumns.sort(sortColumns));
  }, [
    assembledColumnsWithCamunda,
    coloringDataByColumnId,
    customColumnDimensions,
    disableTimezoneAdjustment,
  ]);
  // =======================

  // Get columns by groups for grouped visibility
  useEffect(() => {
    const groupedIds: Record<string, string[]> = {};
    columns.forEach((param) => {
      const { field, group } = param;
      if (groupedIds[group]) groupedIds[group].push(field);
      else groupedIds[group] = [field];
    });
    setGroupedColumns(groupedIds);
  }, [columns]);
  // =======================
  return { columns, columnGroupingModel, groupedColumns };
};
