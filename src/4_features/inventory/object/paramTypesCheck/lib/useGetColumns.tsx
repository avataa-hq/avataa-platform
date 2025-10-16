import { CheckImportedTprmTableRow, useTranslate } from '6_shared';
import { GridColDef, GridRowId } from '@mui/x-data-grid-premium';
import { InventoryImportTprmAutocomplete } from '../../paramTypesPreview';

interface IProps {
  onTprmSelectChange: (id: GridRowId, value: { value: string | number; label: string }) => void;
  tprmSelectOptions: { value: string | number; label: string }[];
}
export const useGetColumns = ({
  onTprmSelectChange,
  tprmSelectOptions,
}: IProps): GridColDef<CheckImportedTprmTableRow>[] => {
  const translate = useTranslate();

  return [
    {
      field: 'tprm',
      flex: 1,
      headerName: `${translate('File Column')}`,
    },
    {
      field: 'selectTprm',
      renderCell: (gridProps) => (
        <InventoryImportTprmAutocomplete
          options={tprmSelectOptions}
          onChange={onTprmSelectChange}
          {...gridProps}
        />
      ),
      valueGetter: (_, row) => row.selectTprm.value,
      flex: 1,
      headerName: `${translate('Inventory Column')}`,
    },
  ];
};
