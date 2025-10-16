export const calculateAverageLinePath = (geometryPath: number[][]) => {
  let sumLat = 0;
  let sumLng = 0;

  geometryPath.forEach((coords) => {
    sumLng += coords[0];
    sumLat += coords[1];
  });
  const avgLat = sumLat / geometryPath.length;
  const avgLng = sumLng / geometryPath.length;

  return { lat: avgLat, lng: avgLng };
};
