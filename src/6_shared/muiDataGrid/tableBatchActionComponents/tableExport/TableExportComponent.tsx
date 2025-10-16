import { useState, MouseEvent, useCallback } from 'react';
import { Tooltip, Menu, MenuItem } from '@mui/material';
import DownloadIcon from '@mui/icons-material/DownloadRounded';
import { DataTransferFileExtension, useTranslate } from '6_shared';
import { CustomLoadingButton } from './TableExportComponent.styled';
import { SetDelimiterModal } from '../setDelimeterComponent';

interface IProps {
  disabled?: boolean;
  exportFile: (ext: DataTransferFileExtension) => void;
  setDelimiter: (value: string) => void;
  isLoading: boolean;
}
export const TableExportComponent = ({ disabled, exportFile, setDelimiter, isLoading }: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDelimiterModalOpen, setIsDelimiterModalOpen] = useState<boolean>(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadExcelFile = useCallback(() => {
    exportFile('xlsx');
    handleClose();
  }, [exportFile]);

  const loadCsvFile = useCallback(() => {
    exportFile('csv');
    handleClose();
    setIsDelimiterModalOpen(false);
  }, [exportFile]);

  const translate = useTranslate();

  return (
    <>
      <Tooltip title={translate('Export objects')}>
        <CustomLoadingButton
          color="primary"
          variant="outlined"
          onClick={handleClick}
          disabled={disabled}
          loading={isLoading}
          data-testid="table-header__export-btn"
        >
          <DownloadIcon fontSize="small" color="primary" />
        </CustomLoadingButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={loadExcelFile}>{translate('Download as Excel')}</MenuItem>
        <MenuItem onClick={() => setIsDelimiterModalOpen(true)}>
          {translate('Download as CSV')}
        </MenuItem>
      </Menu>
      <SetDelimiterModal
        open={isDelimiterModalOpen}
        onClose={() => setIsDelimiterModalOpen(false)}
        setDelimiter={(value: string) => setDelimiter(value)}
        sendData={loadCsvFile}
      />
    </>
  );
};
