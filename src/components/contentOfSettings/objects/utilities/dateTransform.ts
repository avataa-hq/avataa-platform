export const dateTransform = (dateString: Date): string => {
  const date = new Date(dateString);
  const d = date.toLocaleDateString('en-GB', { timeZone: 'UTC' }).split('/').join('.');
  const t = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });
  return `${d} ${t}`;
};
