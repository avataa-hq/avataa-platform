/** Function to convert a 3-digit hex to 6-digit hex */
const expandHex = (hex: string) => `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;

export const interpolateHexColor = (color1: string, color2: string, ratio: number) => {
  // Ensure both colors have the same format (6-digit or 8-digit)
  const c1 = color1.length === 4 ? expandHex(color1) : color1;
  const c2 = color2.length === 4 ? expandHex(color2) : color2;

  // Convert the hex colors to RGB
  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);
  const a1 = c1.length === 9 ? parseInt(c1.substring(7, 9), 16) : null;

  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);
  const a2 = c1.length === 9 ? parseInt(c2.substring(7, 9), 16) : null;

  // Interpolate the RGB values based on the ratio
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  const a = a1 !== null && a2 !== null ? Math.round(a1 + (a2 - a1) * ratio) : null;

  // Convert the interpolated RGB values back to hex
  // eslint-disable-next-line no-bitwise
  let interpolatedColor = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

  if (a) interpolatedColor += a.toString(16);

  return interpolatedColor.toUpperCase();
};

export const getColorFromGradient = (
  index: number,
  gradient: string[] = [
    '#9e0142',
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fab500',
    '#fee08b',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#00A143',
    '#3288bd',
    '#5e4fa2',
  ],
) => {
  if (gradient.length < 1) {
    console.error('Provided `gradient` array must contain at least 2 elements');
    return '#000000';
  }

  if (index <= 0) {
    return gradient[0];
  }

  if (index >= 1) {
    return gradient[gradient.length - 1];
  }

  // Map index value to gradient array length
  const mappedIndex = index * (gradient.length - 1);

  const upperColorIndex = Math.ceil(mappedIndex);
  const lowerColorIndex = Math.floor(mappedIndex);

  if (lowerColorIndex === upperColorIndex) return gradient[lowerColorIndex];

  return interpolateHexColor(
    gradient[lowerColorIndex],
    gradient[upperColorIndex],
    mappedIndex - lowerColorIndex,
  );
};
