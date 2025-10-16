import {
  GridColDef,
  GridColumnVisibilityModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid-premium';
import {
  COLUMN_GROUPING_DISABLED,
  CompositeColumnsVisibilityItem,
  HAS_FILE,
  HasFilesColumnHeader,
} from '6_shared';
import { useGetRenderCell } from '../useGetRenderCell';

interface IProps {
  tmoId?: number;
  visibleColumns?: Record<string, GridColumnVisibilityModel>;
  isCheckboxSelection: boolean;
  setIsCheckboxSelection: (isCheckboxSelection: boolean) => void;
  setColumnsVisibility: (value: CompositeColumnsVisibilityItem) => void;
  setSelectedRows: (arg: GridRowSelectionModel) => void;
  allRowIds: number[];
}

export const useGetHasFilesColumn = ({
  setSelectedRows,
  isCheckboxSelection,
  setIsCheckboxSelection,
  setColumnsVisibility,
  visibleColumns,
  allRowIds,
  tmoId,
}: IProps) => {
  const { getRenderCellForHasFileColumn } = useGetRenderCell();

  return {
    field: HAS_FILE,
    width: 50,
    renderCell: getRenderCellForHasFileColumn,
    group: COLUMN_GROUPING_DISABLED,
    headerAlign: 'left',
    disableReorder: true,
    disableExport: true,
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
    renderHeader: () => (
      <HasFilesColumnHeader
        setSelectedRows={setSelectedRows}
        setColumnsVisibility={setColumnsVisibility}
        isCheckboxSelection={isCheckboxSelection}
        setIsCheckboxSelection={setIsCheckboxSelection}
        visibleColumns={visibleColumns}
        allRowIds={allRowIds}
        tmoId={tmoId}
      />
    ),
  } as GridColDef;
};
