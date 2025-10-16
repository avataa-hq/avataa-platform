export const isArraysEqual = (arr1: any, arr2: any) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const item of arr1) {
    if (!arr2.includes(item)) {
      return false;
    }
  }

  return true;
};
