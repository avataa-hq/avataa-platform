export const transformParamValue = ({
  value,
  returnName,
}: {
  value: any;
  returnName?: boolean;
}) => {
  const isObj = value !== null && typeof value === 'object' && !Array.isArray(value);
  if (value !== null && Array.isArray(value)) {
    return value.map((item) => (typeof item === 'object' ? item.id : item));
  }
  // eslint-disable-next-line no-nested-ternary
  return isObj
    ? returnName
      ? value.name
      : value.id
    : typeof value === 'string'
    ? value.trim()
    : value;
};
