export const transformGroupName = (value: any) => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return 'No group';
  if (typeof value === 'object') {
    return 'No group';
  }
  if (value === '[object Object]') {
    return 'No group';
  }
  return value;
};
