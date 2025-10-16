export const cutTypeFromFileName = (name: string) => {
  if (!name.includes('.')) {
    return name.trim();
  }

  const lastDotIndex = name.trim().lastIndexOf('.');

  return lastDotIndex !== -1 ? name.trim().slice(0, lastDotIndex) : name.trim();
};
