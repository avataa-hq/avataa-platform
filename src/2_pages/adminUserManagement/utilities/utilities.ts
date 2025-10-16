import { ItemType, IUser } from '6_shared';

export const isUser = (item: ItemType): item is IUser => {
  return 'username' in item;
};

export const getItemType = (selectedObject: string) => {
  if (selectedObject === 'Users') return 'user';
  if (selectedObject === 'Groups') return 'group';
  if (selectedObject === 'Roles') return 'role';
  return 'user';
};

export const getItemName = (item: ItemType) => {
  return isUser(item) ? item.username : item?.name ?? '';
};
