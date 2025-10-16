export const expandHexCode = (hex: string) => {
  if (hex.length === 4) {
    const newHex = hex.replace(/([a-f0-9])/gi, '$1$1');
    return newHex;
  }
  return hex;
};

const colorBetweenGenerator = (startColor: string, endColor: string, percentage: number) => {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexColorRegex.test(startColor) || !hexColorRegex.test(endColor)) {
    throw new Error('Invalid color');
  }

  let percentageValue = percentage;
  if (percentageValue > 100) {
    percentageValue = 100;
  }
  if (percentageValue < 0) {
    percentageValue = 0;
  }

  const start = expandHexCode(startColor);
  const end = expandHexCode(endColor);

  const startRed = parseInt(start.substring(1, 3), 16);
  const startGreen = parseInt(start.substring(3, 5), 16);
  const startBlue = parseInt(start.substring(5, 7), 16);

  const endRed = parseInt(end.substring(1, 3), 16);
  const endGreen = parseInt(end.substring(3, 5), 16);
  const endBlue = parseInt(end.substring(5, 7), 16);

  const diffRed = endRed - startRed;
  const diffGreen = endGreen - startGreen;
  const diffBlue = endBlue - startBlue;

  const newRed = startRed + (diffRed * percentageValue) / 100;
  const newGreen = startGreen + (diffGreen * percentageValue) / 100;
  const newBlue = startBlue + (diffBlue * percentageValue) / 100;

  const newColor = `#${Math.round(newRed).toString(16).padStart(2, '0')}${Math.round(newGreen)
    .toString(16)
    .padStart(2, '0')}${Math.round(newBlue).toString(16).padStart(2, '0')}`;

  return newColor;
};

export default colorBetweenGenerator;
