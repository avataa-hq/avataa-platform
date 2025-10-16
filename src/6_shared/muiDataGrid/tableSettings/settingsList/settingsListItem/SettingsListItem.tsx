import { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

import { ITableColumnSettingsModel, ActionTypes, useTranslate, capitalize } from '6_shared';

import {
  SettingListItemStyled,
  PublicBlock,
  DefaultBlock,
  NameBlock,
  DeleteBlock,
} from './SettingsListItem.styled';

interface ItemProps {
  columnSettingsByTmo: ITableColumnSettingsModel;
  onItemClick?: (settingId: number) => void;
  onDelete?: (settingId: number) => void;
  selected?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const SettingsListItem = ({
  columnSettingsByTmo,
  onItemClick,
  onDelete,
  selected,
  permissions,
}: ItemProps) => {
  const translate = useTranslate();

  const [isHoverDeleteIcon, setIsHoverDeleteIcon] = useState(false);
  const { id, name, public: isPublic, default: isDefault } = columnSettingsByTmo;
  return (
    <SettingListItemStyled onClick={() => onItemClick?.(id)} selected={selected}>
      <NameBlock>
        <SettingsIcon sx={{ opacity: selected ? '1' : '0.5' }} color="primary" fontSize="small" />
        <Typography variant="body2" fontWeight={700}>
          {name}
        </Typography>
      </NameBlock>
      <DefaultBlock>
        {isDefault && (
          <Typography sx={{ opacity: 0.6 }}>
            <i>{translate(capitalize('default') as 'Default')}</i>
          </Typography>
        )}
      </DefaultBlock>
      <PublicBlock>
        <Typography sx={{ opacity: 0.6 }}>
          <i>
            {isPublic
              ? translate(capitalize('public') as 'Public')
              : translate(capitalize('private') as 'Private')}
          </i>
        </Typography>
      </PublicBlock>
      <DeleteBlock>
        <IconButton
          onMouseEnter={() => setIsHoverDeleteIcon(true)}
          onMouseLeave={() => setIsHoverDeleteIcon(false)}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(id);
          }}
          color={isHoverDeleteIcon ? 'error' : 'info'}
          data-testid={name?.startsWith('at_') ? `${name}_delete-btn` : undefined}
          disabled={!(permissions?.view ?? true)}
        >
          <DeleteIcon color={isHoverDeleteIcon ? 'error' : 'info'} />
        </IconButton>
      </DeleteBlock>
    </SettingListItemStyled>
  );
};
