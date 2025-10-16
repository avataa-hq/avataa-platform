import { GridColDef } from '@mui/x-data-grid-premium';
import { GoToDetailsCell } from './GoToDetailsCell';

export const useCommonTableColumns = () => {
  const columns: GridColDef[] = [
    {
      field: 'tmo_name',
      headerName: 'Object Type Name',
      flex: 1,
      editable: false,
    },
    {
      field: 'mo_name',
      headerName: 'Object Name',
      flex: 1,
      editable: false,
      renderCell: (params) => <GoToDetailsCell id={params.row.id} name={params.row.mo_name} />,
    },
    {
      field: 'parent_mo_name',
      headerName: 'Parent Name',
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <GoToDetailsCell id={params.row.parent_mo_id} name={params.row.parent_mo_name} />
      ),
    },
    {
      field: 'tprm_name',
      headerName: 'Parameter Type Name',
      flex: 1,
      editable: false,
    },
  ];

  return columns;
};
