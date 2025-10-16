export const processSearchQuery = (searchQuery: string): string => {
  return searchQuery
    .replace(/(\d+)\/\d+/, '$1')
    .replace(/[()"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};
