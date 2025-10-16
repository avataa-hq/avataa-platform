export const formatDistance = (distance: number | null) => {
  if (!distance) return '0 km';
  return `${distance?.toFixed(2)} km`;
};
