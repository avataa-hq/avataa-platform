import { useEffect, useMemo, useState } from 'react';
import { InventoryParameterTypesModel, SeverityProcessModel, IColorRangeModel } from '6_shared';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { ColorDataByTprms } from './types';
import { useGetColsData } from './useGetColsData';
import { useGetRowsData } from './useGetRowsData';

interface IProps {
  severityProcessData?: SeverityProcessModel;
  returnableParamTypes?: InventoryParameterTypesModel[];
  colorRangesData: IColorRangeModel[];
  customColumnDimensions: Record<string, GridColumnDimensions>;
}

export const useSeverityProcessTableData = ({
  severityProcessData,
  returnableParamTypes,
  colorRangesData,
  customColumnDimensions,
}: IProps) => {
  const [tprms, setTprms] = useState<string[]>([]);

  // ===== Get TPRMS (column name) to request their names
  useEffect(() => {
    if (!returnableParamTypes) return;
    const tprmsArray = returnableParamTypes.map((param) => String(param.id));

    setTprms(tprmsArray);
  }, [returnableParamTypes]);
  // =====

  // ===== Getting an object of color parameters where the key is tprm and the value is its parameters
  const coloringDataByColumnId = useMemo<ColorDataByTprms>(() => {
    return colorRangesData.reduce((acc, rpt) => {
      if (tprms.includes(String(rpt.tprmId))) {
        const { tprmId, ...other } = rpt;
        acc[tprmId.toString()] = { ...other };
      }
      return acc;
    }, {} as ColorDataByTprms);
  }, [colorRangesData, tprms]);
  // =====

  const columnsData = useGetColsData({
    coloringDataByColumnId,
    returnableParamTypes,
    customColumnDimensions,
  });

  const rowsData = useGetRowsData({
    severityProcessData,
    columns: columnsData.columns,
  });

  return {
    ...columnsData,
    ...rowsData,
    totalRows: severityProcessData?.totalCount || 0,
  };
};
