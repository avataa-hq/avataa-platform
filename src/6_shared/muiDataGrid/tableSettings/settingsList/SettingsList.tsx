import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

import {
  ITableColumnSettingsModel,
  LoadingAvataa,
  useDebounceValue,
  ActionTypes,
  useTranslate,
} from '6_shared';

import {
  SettingsListStyled,
  SettingsListHeader,
  SettingsListTitleBlock,
  LoadingContainer,
} from './SettingsList.styled';
import { SettingsListItem } from './settingsListItem/SettingsListItem';

type FilterByType = 'all' | 'default' | 'public' | 'private' | 'custom';

const filterByName = (array: ITableColumnSettingsModel[], searchValue: string) => {
  if (!searchValue) return array;

  const lowerSearchValue = searchValue.toLowerCase();

  return array.filter((item: ITableColumnSettingsModel) => {
    const itemName = item.name.toLowerCase();
    return itemName.includes(lowerSearchValue);
  });
};

interface IProps {
  allColumnSettingsByTmo?: ITableColumnSettingsModel[];
  isLoadingSettingsList?: boolean;
  selectedId: number;
  onDelete?: (settingId: number) => Promise<void>;
  onItemClick?: (settingId: number) => void;
  isCreatedMode?: boolean;
  title: string;
  permissions?: Record<ActionTypes, boolean>;
}

export const SettingsList = ({
  allColumnSettingsByTmo,
  selectedId,
  onDelete,
  isCreatedMode,
  isLoadingSettingsList,
  onItemClick,
  title,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const [filterBy, setFilterBy] = useState<FilterByType>('all');
  const [settingsList, setSettingsList] = useState<ITableColumnSettingsModel[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const debValue = useDebounceValue(searchValue, 100);

  useEffect(() => {
    if (!allColumnSettingsByTmo) return;
    if (filterBy === 'all') {
      setSettingsList(filterByName(allColumnSettingsByTmo, debValue));
      return;
    }
    const filteredList = allColumnSettingsByTmo.filter((item) => {
      if (filterBy === 'public') return item.public;
      if (filterBy === 'private') return !item.public;
      if (filterBy === 'default') return item.default;
      if (filterBy === 'custom') return !item.default;
      return true;
    });
    setSettingsList(filterByName(filteredList, debValue));
  }, [allColumnSettingsByTmo, filterBy, debValue]);

  return (
    <>
      <SettingsListTitleBlock>
        <Typography variant="h2">{title}</Typography>
        <SettingsIcon color="primary" fontSize="small" />
      </SettingsListTitleBlock>

      {!isCreatedMode && (
        <SettingsListHeader>
          <TextField
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ maxWidth: '180px' }}
            variant="standard"
            placeholder={translate('Search by name')}
            type="text"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setSearchValue('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
          <Select
            sx={{ maxWidth: '180px' }}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterByType)}
          >
            <MenuItem value="all">{translate('All')}</MenuItem>
            <MenuItem value="default">{translate('Default')}</MenuItem>
            <MenuItem value="custom">{translate('Custom')}</MenuItem>
            <MenuItem value="private">{translate('Private')}</MenuItem>
            <MenuItem value="public">{translate('Public')}</MenuItem>
          </Select>
        </SettingsListHeader>
      )}

      <Divider />

      <SettingsListStyled>
        {isLoadingSettingsList && (
          <LoadingContainer>
            <LoadingAvataa />
          </LoadingContainer>
        )}
        {settingsList.map((setting) => (
          <SettingsListItem
            selected={selectedId === setting.id}
            key={setting.id}
            columnSettingsByTmo={setting}
            onDelete={onDelete}
            onItemClick={onItemClick}
            permissions={permissions}
          />
        ))}
      </SettingsListStyled>
    </>
  );
};
