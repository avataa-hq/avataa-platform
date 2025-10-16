export const createFormatter = (maxDigits: number, useCompactNotation: boolean = true) => {
  const safeDigits = Math.max(0, Math.min(20, Math.floor(maxDigits || 0)));

  return Intl.NumberFormat('en', {
    notation: useCompactNotation ? 'compact' : undefined,
    maximumFractionDigits: safeDigits,
  });
};
