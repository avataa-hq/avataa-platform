import { isValidValue } from './isValidValue';

interface IProps {
  paramTypeIds: number[];
  data: Record<string, any>;
}

export const getFilteredData = ({ paramTypeIds, data }: IProps) => {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => paramTypeIds.includes(Number(key)) && isValidValue(value),
    ),
  );
};
