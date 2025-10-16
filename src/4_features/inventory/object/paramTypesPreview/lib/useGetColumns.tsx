import { GridColDef, GridActionsCellItem, GridRowId } from '@mui/x-data-grid-premium';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  ColoredBooleanCell,
  useTranslate,
  DataModelRow,
  FILE_COLUMN_NAME,
  FILE_COLUMN_TYPE,
  INVENTORY_COLUMN_NAME,
  INVENTORY_COLUMN_TYPE,
  IS_CONSTRAINT,
  IS_REQUIRED,
  STATUS_FIELD,
} from '6_shared';
import { ShowStatus } from '../renderCellComponents';

interface Parameters {
  onDeleteClick: (id: GridRowId) => void;
}

export const useGetColumns = ({ onDeleteClick }: Parameters): GridColDef<DataModelRow>[] => {
  const translate = useTranslate();

  return [
    {
      field: FILE_COLUMN_NAME,
      flex: 1,
      headerName: `${translate('File Column')}`,
      headerAlign: 'center',
    },
    {
      field: FILE_COLUMN_TYPE,
      flex: 1,
      headerName: `${translate('File Column Type')}`,
      headerAlign: 'center',
    },
    {
      field: INVENTORY_COLUMN_TYPE,
      flex: 1,
      headerName: `${translate('Inventory Column Type')}`,
      headerAlign: 'center',
    },
    {
      field: INVENTORY_COLUMN_NAME,
      flex: 1,
      headerName: `${translate('Inventory Column')}`,
      headerAlign: 'center',
    },
    {
      field: IS_CONSTRAINT,
      flex: 1,
      headerName: `${translate('Constraint')}`,
      headerAlign: 'center',
    },
    {
      field: IS_REQUIRED,
      flex: 1,
      headerName: `${translate('Required')}`,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <Box
          sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <ColoredBooleanCell value={value} />
        </Box>
      ),
    },
    {
      field: STATUS_FIELD,
      headerName: `${translate('Status')}`,
      headerAlign: 'center',
      renderCell: ({ value }) => <ShowStatus value={value} />,
      flex: 1,
    },
    {
      field: 'delete',
      headerName: '',
      type: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={translate('Delete')}
          onClick={() => onDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
  ];
};
