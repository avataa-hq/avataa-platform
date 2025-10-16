import { IInventoryObjectModel } from '6_shared';
import { IRenderTree } from '6_shared/models/inventoryMapWidget/types';

// const mockData = [
//   { id: 1, p_id: null, name: 'a' },
//   { id: 2, p_id: 10, name: 'b' },
//   { id: 3, p_id: 1, name: 'c' },
//   { id: 4, p_id: 2, name: 'd' },
//   { id: 5, p_id: 3, name: 'e' },
//   { id: 6, p_id: 4, name: 'f' },
//   { id: 7, p_id: 4, name: 'g' },
//   { id: 8, p_id: 3, name: 'h' },
//   { id: 9, p_id: 1, name: 'i' },
//   { id: 10, p_id: 1, name: 'j' },
// ];

export const getSimilarObjectTree = (options: IInventoryObjectModel[]) => {
  const groupedData: Record<string, any> = {};
  const rootObjects: IRenderTree[] = [];

  // Первый проход: группировка объектов по их id
  options.forEach((item) => {
    const key = item.id.toString();
    if (key != null) groupedData[key] = { ...item, children: [] };
  });

  // Второй проход: связывание объектов в дерево
  options.forEach((item) => {
    const key = item.id.toString();
    const parentId = item.p_id?.toString();

    if (key != null && parentId != null && groupedData[parentId]) {
      const parentItem = groupedData[parentId];
      const childItem = groupedData[key];
      parentItem.children.push(childItem);
    } else {
      rootObjects.push(groupedData[key]);
    }
  });
  return rootObjects;
};
