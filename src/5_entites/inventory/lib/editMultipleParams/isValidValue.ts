export const isValidValue = (newValue: any): boolean => {
  if (typeof newValue === 'string' && newValue.trim() === '') return false;
  if (newValue === '' || newValue === null || newValue === undefined) return false;
  if (Array.isArray(newValue) && newValue.length === 0) return false;
  if (
    typeof newValue === 'object' &&
    !Array.isArray(newValue) &&
    Object.keys(newValue).length === 0
  ) {
    return false;
  }

  return true;

  // if (typeof newValue === 'string' && newValue.trim() === '') {
  //   return false;
  // }
  // return (
  //   newValue !== '' &&
  //   newValue !== null &&
  //   newValue !== undefined &&
  //   !(Array.isArray(newValue) && newValue.length === 0) &&
  //   !(typeof newValue === 'object' && Object.keys(newValue).length === 0)
  // );
};
