import { useEffect, useState } from 'react';
import {
  Fade,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Box,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { IMenuPosition, useDebounceValue, useTranslate } from '6_shared';

interface IProps {
  userContextMenuPosition: IMenuPosition | null;
  onClose: () => void;
  onUserConextMenuItemClick: (username: string) => void;
  userNamesList: string[];
  kanbanTaskUserName: string | null;
}

export const UserContextMenu = ({
  userContextMenuPosition,
  onClose,
  onUserConextMenuItemClick,
  userNamesList,
  kanbanTaskUserName,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  useEffect(() => {
    setSearchQuery(kanbanTaskUserName || '');
    setIsTyping(false);
  }, [kanbanTaskUserName]);

  const filteredNames = isTyping
    ? userNamesList.filter((name) =>
        name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      )
    : userNamesList;

  const onMenuItemClick = (username: string) => {
    onUserConextMenuItemClick(username);
    setSearchQuery('');
    setIsTyping(false);
  };

  const onClearSearchClick = () => {
    // onUserConextMenuItemClick('');
    setSearchQuery('');
    setIsTyping(false);
  };

  return (
    <Menu
      TransitionComponent={Fade}
      transitionDuration={600}
      anchorReference="anchorPosition"
      aria-hidden={false}
      anchorPosition={
        userContextMenuPosition
          ? { top: userContextMenuPosition.mouseY, left: userContextMenuPosition.mouseX }
          : undefined
      }
      open={!!userContextMenuPosition}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      sx={{
        '& .MuiPaper-root': {
          maxHeight: 300,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <TextField
        variant="standard"
        placeholder={`${translate('Search')}...`}
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsTyping(true);
        }}
        sx={{
          padding: '0 10px',
          '.MuiInputBase-root': {
            padding: '10px 0',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{ width: '30px', height: '30px' }}
                onClick={() => onClearSearchClick()}
              >
                <Close sx={{ fill: theme.palette.neutralVariant.onSurface }} fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box
        component="div"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <MenuItem onClick={() => onMenuItemClick('Unassigned')} key="unassigned">
          Unassigned
        </MenuItem>

        {filteredNames.length > 0 ? (
          filteredNames.map((name) => (
            <MenuItem onClick={() => onMenuItemClick(name)} key={name}>
              {name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No results</MenuItem>
        )}
      </Box>
    </Menu>
  );
};
