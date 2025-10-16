import { formatObjectName } from '../formatObjectName';

export const createOptionsIDList = <T extends { id: number; tmo_id: number; name: string }>(
  data: T[],
) => {
  return data.map((item) => ({
    id: item.id,
    tmoId: item.tmo_id,
    objectName: item.name,
    name: formatObjectName(item.name),
  }));
};
