import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import {
  IColorRangeModel,
  InventoryObjectTypesModel,
  InventoryParameterTypesModel,
  ProcessManagerPageMode,
  SeverityProcessModel,
} from '6_shared';
import { useSeverityProcessTableData } from '../../../../5_entites/processManager/lib/table/tableData/useSeverityProcessTableData';

interface IProps {
  severityProcessData?: SeverityProcessModel;
  returnableParamTypes?: InventoryParameterTypesModel[];
  colorRangesData: IColorRangeModel[];
  customColumnDimensions: Record<string, GridColumnDimensions>;

  viewType: ProcessManagerPageMode;

  pmCurrentTmo: InventoryObjectTypesModel | null;
}

export const useProcessTableData = ({
  colorRangesData,
  customColumnDimensions,
  returnableParamTypes,
  severityProcessData,
}: IProps) => {
  const { columns, rows, totalRows } = useSeverityProcessTableData({
    colorRangesData,
    returnableParamTypes,
    severityProcessData,
    customColumnDimensions,
  });

  return {
    columns,
    rows,
    totalRows,
  };
};
