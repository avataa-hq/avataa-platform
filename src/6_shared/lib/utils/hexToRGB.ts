export function hexToRGB(
  hexColor: string | number[],
): [number, number, number] | [number, number, number, number] {
  if (Array.isArray(hexColor) && hexColor.length === 3) {
    // Return the array directly if it's a valid RGB array
    return hexColor as [number, number, number];
  }

  if (!hexColor) {
    console.error('not a valid hex color');
    return [0, 0, 0];
  }

  // Remove any leading '#' character
  let hex = typeof hexColor === 'string' ? hexColor.replace(/^#/, '') : '';

  // Check if the hex string is a valid format
  const validFormats = /^(?:[0-9a-fA-F]{3}){1,2}$|^(?:[0-9a-fA-F]{4}){1,2}$/;
  if (!validFormats.test(hex)) {
    console.error('not a valid hex color');
    return [0, 0, 0];
  }

  // Normalize the hex string to 6 or 8 characters
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((char) => char.repeat(2))
      .join('');
  }

  // Parse the hex string to RGB values
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Handle the alpha channel for 8-digit format
  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : undefined;

  return alpha ? [r, g, b, alpha] : [r, g, b];
}
