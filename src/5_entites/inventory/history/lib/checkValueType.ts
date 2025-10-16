export const checkValueType = (value: any) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }

  if (typeof value === 'number') {
    return value.toString().trim();
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return '';
  }

  return value;
};
