export const getBoundsPadding = (source: number, zoom: number, padding: number = 0) => {
  const percentPadding = (source / 100) * padding;
  const zoomFactor = 2 ** zoom;
  return percentPadding / zoomFactor;
};
