import { ReactNode } from 'react';

type LayersListItemType = 'folder' | 'layer';

export interface IListItemData {
  id: number;
  name: string;
  type: LayersListItemType;
  icon: ReactNode;
  folder_id?: number | null;
  parent_id?: number | null;
  checked?: boolean;
}

export interface IListItem extends Omit<IListItemData, 'icon'> {}
