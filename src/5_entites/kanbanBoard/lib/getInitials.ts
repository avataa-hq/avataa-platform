export const getInitials = (name: string | undefined) => {
  if (!name) return '';
  return name
    .trim()
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('');
};
