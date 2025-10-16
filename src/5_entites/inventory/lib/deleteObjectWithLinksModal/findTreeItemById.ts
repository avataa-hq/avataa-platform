import { TreeViewNode } from '6_shared';

export const findTreeItemById = (item: TreeViewNode | null, id: string): TreeViewNode | null => {
  if (!item) return null;

  if (item.id === id) return item;

  for (const child of item.children) {
    const found = findTreeItemById(child, id);
    if (found) return found;
  }

  return null;
};
