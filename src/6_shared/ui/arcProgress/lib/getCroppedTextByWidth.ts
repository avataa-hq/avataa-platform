export const getCroppedTextByWidth = (text: string, width: number) => {
  return text.length > width ? `${text.slice(0, width)}...` : text;
};
