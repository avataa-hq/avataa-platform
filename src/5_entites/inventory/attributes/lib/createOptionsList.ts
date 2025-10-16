import { formatObjectName } from '5_entites/inventory/lib';
import { IInventoryObjectModel, ObjectByFilters } from '6_shared';

export const createOptionsList = (data: IInventoryObjectModel[] | ObjectByFilters[]) => {
  if (!data) return [];

  return data
    .filter((item) => item && item.id)
    .map((item) => ({
      id: item.id,
      name: formatObjectName(item.name),
    }));
};
