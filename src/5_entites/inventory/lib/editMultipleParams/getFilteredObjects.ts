import { ObjectByFilters } from '6_shared';

interface IProps {
  selectedObjectIds: number[];
  objectsByFilters: ObjectByFilters[] | undefined;
}

export const getFilteredObjects = ({ selectedObjectIds, objectsByFilters }: IProps) => {
  return objectsByFilters?.filter((object) => selectedObjectIds.includes(object.id));
};
