import { IInventorySearchObjectModel } from '6_shared';
import { GroupName } from '../types';

interface IProps {
  item: IInventorySearchObjectModel;
  groupName: GroupName;
}

export const createOption = ({ item, groupName }: IProps) => {
  return {
    id: item.id.toString(),
    tmo_name: item.tmo_name,
    name: item.name,
    group: groupName,
    geometry: {
      coordinates: item.longitude && item.latitude ? [item.longitude, item.latitude] : null,
      // eslint-disable-next-line no-nested-ternary
      type: item.geometry
        ? item.geometry?.path?.type || null
        : item.longitude && item.latitude
        ? 'Point'
        : null,
    },
  };
};
