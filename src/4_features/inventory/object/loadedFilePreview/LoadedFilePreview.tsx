import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { Button } from '@mui/material';
import { Modal, useTranslate } from '6_shared';
import { BigFileWarning } from './BigFileWarning';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  columns: GridColDef[];
  rows: any[];
  onConfirm: () => void;
}

export const LoadedFilePreview = ({ columns, rows, isOpen, onClose, onConfirm }: IProps) => {
  const translate = useTranslate();

  const handleConfirm = () => {
    onConfirm();
  };

  const isLargeFile = rows.length > 250;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('Import Preview')}
      width="60%"
      height="60%"
      ModalContentSx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        gap: '10px',
      }}
      hideBackdrop
      actions={
        <>
          {/* <Button variant="outlined" onClick={onClose}>
            {translate('Cancel')}
          </Button> */}
          <Button variant="contained" onClick={handleConfirm}>
            {translate('Continue')}
          </Button>
        </>
      }
    >
      <>
        {isLargeFile && <BigFileWarning />}
        <DataGridPremium
          sx={{ height: 'auto' }}
          columns={columns}
          rows={isLargeFile ? rows.slice(0, 250) : rows}
          disableVirtualization
        />
      </>
    </Modal>
  );
};
