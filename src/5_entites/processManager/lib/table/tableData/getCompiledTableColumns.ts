import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { dateParser, setColumnType, UNGROUPED_COLUMNS_GROUP_NAME } from '6_shared';
import { ColorDataByTprms, GridColDefWithGroups, ICommonColumnModel } from './types';
import { getRenderCell } from './getRenderCell';
import { getGridFilterOperators } from './getGridFilterOperators';

interface IProps {
  colorsData?: ColorDataByTprms;
  columnsData: ICommonColumnModel[];
  disableTimezoneAdjustment: boolean;
  customColumnDimensions: Record<string, GridColumnDimensions>;
}
export const getCompiledTableColumns = ({
  colorsData,
  columnsData,
  disableTimezoneAdjustment,
  customColumnDimensions,
}: IProps): GridColDefWithGroups[] => {
  return columnsData.flatMap((data) => {
    const { id, name, group, val_type, selectValueOptions } = data;

    const { width, flex, maxWidth, minWidth } = { ...customColumnDimensions?.[id] };

    const coloredColumn = colorsData?.[id];
    const headerName = name;
    const tprmGroup = group?.trim() || UNGROUPED_COLUMNS_GROUP_NAME;
    const type = setColumnType(val_type || '');
    // const maxWidth = headerName.length > 20 ? 180 : Infinity;
    const align = 'left';
    const valueGetter = (value: string) => dateParser(value, type, disableTimezoneAdjustment);
    const valueOptions = selectValueOptions;
    // const valueFormatter = (value: string) => dateFormatter(value, type, disableTimezoneAdjustment);
    const renderCell = (params: GridRenderCellParams) => {
      return getRenderCell({ params, coloredColumn, type });
    };

    return {
      width: width ?? 150,
      ...(maxWidth && maxWidth > 0 && { maxWidth }),
      ...(minWidth && minWidth > 0 && { minWidth }),
      ...(flex && { flex }),
      align,
      editable: false,
      field: String(id),
      headerName,
      headerAlign: 'left',
      group: tprmGroup,
      type,
      valueGetter,
      // valueFormatter,
      renderCell,
      filterOperators: getGridFilterOperators(type),
      valueOptions,
    } as GridColDefWithGroups;
  });
};
