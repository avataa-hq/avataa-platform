import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useTranslate } from '6_shared';
import keycloak from 'keycloak';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserRoles } from 'routing';

interface AvatarMenuProps {
  open: boolean;
  anchorEl: MenuProps['anchorEl'];
  onClose: () => void;
}

export const AvatarMenu = ({ open, anchorEl, onClose }: AvatarMenuProps) => {
  const translate = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();

  const { isAdmin } = useUserRoles();

  const handleLogOut = async () => {
    await keycloak.logout();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => onClose()}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {location.pathname.startsWith('/admin') && (
        <MenuItem
          onClick={() => {
            navigate('/main');
            onClose();
          }}
          disableRipple
        >
          <ExitToAppIcon sx={{ mr: 1 }} />
          {translate('Details app')}
        </MenuItem>
      )}
      {!location.pathname.startsWith('/admin') && isAdmin && (
        <MenuItem
          onClick={() => {
            navigate('/admin');
            onClose();
          }}
          disableRipple
        >
          <AdminPanelSettingsIcon sx={{ mr: 1 }} />
          {translate('Admin panel')}
        </MenuItem>
      )}
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleLogOut} disableRipple>
        <LogoutIcon sx={{ mr: 1 }} />
        {translate('Logout')}
      </MenuItem>
    </Menu>
  );
};
