export const formatObjectName = (name: string) => {
  if (name == null) return '-';
  return name.toString().trim() !== '' ? name.toString() : 'No name';
};
