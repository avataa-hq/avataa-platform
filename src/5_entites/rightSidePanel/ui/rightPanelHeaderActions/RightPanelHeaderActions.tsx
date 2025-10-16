import { useState } from 'react';
import { Box, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  CalendarMonth,
  FileDownload,
  Settings,
} from '@mui/icons-material';
import { ActionTypes, useTranslate } from '6_shared';
import { ExportGraphFormat } from '5_entites';
import * as SC from './RightPanelHeaderActions.styled';

interface IProps {
  isTraceButtonsDisabled: boolean;
  handleTraceTableModal: () => void;
  selectedTab?: string;
  sortDirection?: 'asc' | 'desc';
  onSortHistoryClick?: () => void;
  rightPanelTitle?: string;
  onExportTraceImageClick?: (format: ExportGraphFormat) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const RightPanelHeaderActions = ({
  isTraceButtonsDisabled,
  handleTraceTableModal,
  selectedTab,
  sortDirection,
  onSortHistoryClick,
  rightPanelTitle,
  onExportTraceImageClick,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const hamdleExportTraceImageClick = (format: ExportGraphFormat) => {
    onExportTraceImageClick?.(format);
    handleMenuClose();
  };

  return (
    <>
      {rightPanelTitle === 'Attributes' && selectedTab !== 'map' && selectedTab !== 'diagrams' && (
        <SC.IconButtonStyled
          disabled={!(permissions?.update ?? true)}
          onClick={() => {
            const button = document.querySelector(
              '[data-testid="table-header__custom-columns-btn"]',
            );
            if (button instanceof HTMLButtonElement && !button.disabled) {
              button.click();
            }
          }}
        >
          <Settings />
        </SC.IconButtonStyled>
      )}

      {rightPanelTitle === 'History' && (
        <Tooltip title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}>
          <SC.IconButtonStyled onClick={onSortHistoryClick}>
            {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
          </SC.IconButtonStyled>
        </Tooltip>
      )}

      {rightPanelTitle === 'Trace' && (
        <Tooltip title={translate('Trace table')}>
          <SC.IconButtonStyled
            onClick={handleTraceTableModal}
            disabled={isTraceButtonsDisabled}
            data-testid="right-panel-trace__trace-table"
          >
            <CalendarMonth />
          </SC.IconButtonStyled>
        </Tooltip>
      )}

      {rightPanelTitle === 'Trace' && (
        <Box component="div">
          <Tooltip title={translate('Export image')}>
            <SC.IconButtonStyled
              id="icon-button"
              aria-controls={isMenuOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : undefined}
              onClick={handleMenuClick}
              disabled={isTraceButtonsDisabled}
              data-testid="right-panel-trace__export-image"
            >
              <FileDownload />
            </SC.IconButtonStyled>
          </Tooltip>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'icon-button',
            }}
          >
            <MenuItem onClick={() => hamdleExportTraceImageClick('jpeg')}>
              {translate('Download as JPEG')}
            </MenuItem>
            <MenuItem onClick={() => hamdleExportTraceImageClick('png')}>
              {translate('Download as PNG')}
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );
};
