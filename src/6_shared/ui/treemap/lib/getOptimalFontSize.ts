import { ExtendedHierarchyRectNode } from '../types';

export const getOptimalFontSize = (rectNode: ExtendedHierarchyRectNode) => {
  const availableWidth = rectNode.x1 - rectNode.x0;
  const maxFontSize = 14;
  const minFontSize = 10;
  let fontSize = maxFontSize;
  const textLength = rectNode.data.name?.length || 0;
  const maxTextWidth = availableWidth * 0.7;

  if (textLength * fontSize > maxTextWidth) {
    fontSize = Math.max(minFontSize, Math.floor(maxTextWidth / textLength));
  }

  return fontSize;
};
