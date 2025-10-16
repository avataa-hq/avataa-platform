import {
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowModesModel,
} from '@mui/x-data-grid-premium';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridRowModes } from '@mui/x-data-grid-pro';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

interface IProps {
  rowModesModel: GridRowModesModel;
  handleDeleteClick: (id: GridRowId) => () => void;
  handleSaveClick: (id: GridRowId) => () => void;
  handleCancelClick: (id: GridRowId) => () => void;
  handleEditClick: (id: GridRowId) => () => void;
}
export const useGetColumns = ({
  rowModesModel,
  handleDeleteClick,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
}: IProps): GridColDef[] => {
  return [
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true,
    },
    {
      field: 'val_type',
      headerName: 'Type',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['str', 'int', 'float', 'bool', 'datetime', 'mo_link', 'prm_link'],
    },
    {
      field: 'multiple',
      headerName: 'Multiple',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'required',
      headerName: 'Required',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'searchable',
      headerName: 'Searchable',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'returnable',
      headerName: 'Returnable',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'automation',
      headerName: 'Automation',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'group',
      headerName: 'Group',
      editable: true,
    },
    {
      field: 'constraint',
      headerName: 'Constraint',
      editable: true,
    },
    {
      field: 'prm_link_filter',
      headerName: 'prm_link_filter',
      editable: true,
    },
    {
      field: 'field_value',
      headerName: 'field_value',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
};
