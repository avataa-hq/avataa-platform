export const getTransformedText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  fontRatio = 0.6, // ширина одного символа ≈ 60% от высоты
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const estimatedWidth = testLine.length * fontSize * fontRatio;

    if (estimatedWidth < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};
