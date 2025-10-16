export const truncateString = (str: string, maxLength: number) => {
  if (typeof str !== 'string') return '';
  if (typeof maxLength !== 'number' || maxLength < 0) return str;

  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};
