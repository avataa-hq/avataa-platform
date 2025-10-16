import { Order } from '../model';

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  const aVal = typeof a[orderBy] === 'string' ? (a[orderBy] as string).toLowerCase() : a[orderBy];
  const bVal = typeof b[orderBy] === 'string' ? (b[orderBy] as string).toLowerCase() : b[orderBy];

  if (bVal < aVal) {
    return -1;
  }
  if (bVal > aVal) {
    return 1;
  }
  return 0;
};

const getComparator = <T>(order: Order, orderBy: keyof T): ((a: T, b: T) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export const stableSort = <T>(
  array: readonly T[],
  sortOrder: Order | undefined,
  orderBy?: keyof T,
) => {
  if (!orderBy || !sortOrder) return array;

  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const comparator = getComparator(sortOrder, orderBy);
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};
