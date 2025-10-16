import { Menu, MenuItem } from '@mui/material';
import { useTranslate, IGroup, IUser } from '6_shared';
import en from '6_shared/localization/translations/en.json';
import { isUser } from '2_pages/adminUserManagement/utilities/utilities';

type TranslationKey = keyof typeof en;

interface IProps {
  anchorElContextMenu?: HTMLElement | null;
  setAnchorElContextMenu?: (value: React.SetStateAction<HTMLElement | null>) => void;
  popupItemObject?: IGroup | IUser | null;
  onPopupMenuItemClick?: (item: TranslationKey) => void;
}

const groupContextMenuWithSubgroups: TranslationKey[] = [
  'Add a Subgroup',
  // 'Reveal Group'
];
const groupContextMenu: TranslationKey[] = ['Add a Subgroup'];
const userContextMenu: TranslationKey[] = ['Reset Credentials'];

const ContextMenu = ({
  anchorElContextMenu,
  setAnchorElContextMenu,
  popupItemObject,
  onPopupMenuItemClick,
}: IProps) => {
  const translate = useTranslate();

  const getMenuList = () => {
    if (popupItemObject && isUser(popupItemObject)) {
      return userContextMenu;
    }
    if (popupItemObject?.subGroups?.length) {
      return groupContextMenuWithSubgroups;
    }
    return groupContextMenu;
  };

  return (
    <Menu
      anchorEl={anchorElContextMenu}
      open={!!anchorElContextMenu}
      onClose={() => setAnchorElContextMenu?.(null)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {getMenuList()?.map((item) => (
        <MenuItem
          key={item}
          onClick={() => onPopupMenuItemClick?.(item)}
          // onDoubleClick={ TODO :: Reveal the group with breadcrumbs }
        >
          {translate(item)}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ContextMenu;
