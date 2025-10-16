import { Menu, MenuItem } from '@mui/material';

import { useTranslate, ActionTypes, useGetPermissions } from '6_shared';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import en from '6_shared/localization/translations/en.json';

type TranslationKey = keyof typeof en;

interface IProps {
  anchorElContextMenu?: HTMLElement | null;
  setAnchorElContextMenu?: (value: React.SetStateAction<HTMLElement | null>) => void;
  popupItemObject?: HierarchyObject | null;
  onPopupMenuItemClick?: (item: TranslationKey) => void;
  forObjectTypes?: boolean;
  isImportDisabled?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

// const contextMenuVariant1 = ['Details', 'Files', 'Show Events', 'Import', 'Export'];
// const contextMenuVariant2 = [
//   'Get child elements',
//   'Details',
//   'Files',
//   'Show Events',
//   'Import',
//   'Export',
// ];
// const contextMenuVariant3 = ['Get child elements', 'Show Events', 'Import', 'Export'];

// const contextMenuForObjectType: IContextMenuDataItem[] = [
// { label: 'Files', onClick: defaultActionOnClick },
// { label: 'Show Events', onClick: defaultActionOnClick },
// { label: 'Import', onClick: openDownloadModal },
// { label: 'Export', onClick: defaultActionOnClick },
// ];

const contextMenuVariantWithoutMockData1: { label: TranslationKey; rule?: string | string[] }[] = [
  { label: 'Details', rule: ['details', 'view'] },
];
const contextMenuVariantWithoutMockData2: { label: TranslationKey; rule?: string | string[] }[] = [
  { label: 'Get child elements', rule: 'view' },
  { label: 'Details', rule: ['details', 'view'] },
];
const contextMenuVariantWithoutMockData3: { label: TranslationKey; rule?: string | string[] }[] = [
  { label: 'Get child elements', rule: 'view' },
];

const contextMenuForObjectTypeWithoutMock: { label: TranslationKey; rule?: string | string[] }[] = [
  { label: 'Import', rule: 'update' },
];

export const ContextMenu = ({
  anchorElContextMenu,
  setAnchorElContextMenu,
  popupItemObject,
  onPopupMenuItemClick,
  forObjectTypes = false,
  isImportDisabled = true,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const detailsPermissions = useGetPermissions('details');

  const getMenuList = (hierarchyObject: HierarchyObject | null | undefined) => {
    if (forObjectTypes) return contextMenuForObjectTypeWithoutMock;
    if (hierarchyObject) {
      const { object_id, level } = hierarchyObject;

      if (object_id != null && level !== 2 && level !== 3) {
        return contextMenuVariantWithoutMockData1;
      }

      if (level === 2 || level === 3) {
        if (object_id != null) return contextMenuVariantWithoutMockData2;
        if (object_id == null) return contextMenuVariantWithoutMockData3;
      }
    }

    return null;
  };

  const getPermissionFromLabel = (label: string) => {
    switch (true) {
      case label === 'Details':
        return detailsPermissions?.view ?? true;
      case label === 'Get child elements':
        return permissions?.view ?? true;
      case label === 'Import':
        return permissions?.update ?? true;
      default:
        return false;
    }
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
      {getMenuList(popupItemObject)?.map((item) => (
        <MenuItem
          key={item.label}
          onClick={() => onPopupMenuItemClick?.(item.label)}
          disabled={(forObjectTypes && isImportDisabled) || !getPermissionFromLabel(item.label)}
        >
          {translate(item.label)}
        </MenuItem>
      ))}
    </Menu>
  );
};
