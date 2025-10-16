import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Tooltip } from '@mui/material';
import { Box } from '6_shared';
import * as SC from './PermissionsList.styled';
import { SecurityLowLevelRoles } from '../../types';

interface IProps {
  permissions: SecurityLowLevelRoles[];
  checked: SecurityLowLevelRoles[];
  title: string;
  handleToggle: (value: SecurityLowLevelRoles) => () => void;
}

export const PermissionsList = ({ permissions, checked, title, handleToggle }: IProps) => {
  return (
    <SC.PermissionsListStyled>
      <SC.PermissionsListTitle>{title}</SC.PermissionsListTitle>

      <SC.PaperStyled>
        <List>
          {permissions.map((role: SecurityLowLevelRoles) => {
            const labelId = `transfer-list-item-${role.id}-label`;

            const toggleCheckbox = () => {
              if (!role.disabled?.status) {
                handleToggle(role)();
              }
            };

            return (
              <ListItem key={role.id} role="listitem" onClick={toggleCheckbox}>
                {role.disabled?.status ? (
                  <Tooltip
                    title={`Unable to change, root element id ${role.disabled.rootItemId}`}
                    placement="top"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.some((item) => item.id === role.id)}
                          tabIndex={-1}
                          disableRipple
                          disabled={role.disabled.status}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={role.nameForUser}
                        sx={{ opacity: 0.5, fontWeigh: 400 }}
                      />
                    </Box>
                  </Tooltip>
                ) : (
                  <>
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.some((item) => item.id === role.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <SC.ListItemTextStyled id={labelId} primary={role.nameForUser} />
                  </>
                )}
              </ListItem>
            );
          })}
        </List>
      </SC.PaperStyled>
    </SC.PermissionsListStyled>
  );
};
