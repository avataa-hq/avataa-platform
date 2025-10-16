import { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Add, MoreVert, Close } from '@mui/icons-material';
import { IParams } from '5_entites';
import * as SC from './ThreeDotsMenu.styled';

interface IProps {
  addNewField: () => void;
  deleteField: (index: number | null) => void;
  idx: number;
  shouldDisplayDeleteFieldButton: boolean;
  param: IParams;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const ThreeDotsMenu = ({
  addNewField,
  deleteField,
  idx,
  shouldDisplayDeleteFieldButton,
  param,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
}: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addFn = () => {
    addNewField();
    setAnchorEl(null);
  };

  const deleteFn = () => {
    deleteField(idx);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Tooltip title="Add field" placement="left">
          <MenuItem onClick={addFn}>
            <Add />
          </MenuItem>
        </Tooltip>
        {shouldDisplayDeleteFieldButton && (
          <Tooltip title="Delete field" placement="left">
            <MenuItem onClick={deleteFn}>
              <SC.DeleteIconStyled />
            </MenuItem>
          </Tooltip>
        )}
        {showDeleteButton && (
          <Tooltip title="Delete parameter" placement="left">
            <MenuItem onClick={() => onDeleteClick?.(param.tprm_id)}>
              <Close />
            </MenuItem>
          </Tooltip>
        )}
        {endButtonSlot}
      </Menu>
    </>
  );
};
