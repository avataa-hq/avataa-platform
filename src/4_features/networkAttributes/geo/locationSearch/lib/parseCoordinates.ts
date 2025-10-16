export const parseCoordinates = (input: string): number[] | null => {
  if (/\d+\/\d+/.test(input)) {
    return null;
  }

  const match = input.replace(/,/g, '.').match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (match && match.length >= 2) {
    const [coord1, coord2] = match.map((coord) => parseFloat(coord));

    if (coord1 >= -90 && coord1 <= 90 && coord2 >= -180 && coord2 <= 180) {
      const [lat, long] = [coord1, coord2];

      if (lat > 90 || lat < -90 || long > 180 || long < -180) return null;

      return [long, lat];
    }
    const [lat, long] = [coord2, coord1];

    if (lat > 90 || lat < -90 || long > 180 || long < -180) return null;

    return [long, lat];
  }

  return null;
};
