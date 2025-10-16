import { DataflowDiagramNode } from '6_shared';
import { SourceLocation } from '6_shared/api/dataview/types';

/**
 * Sets the coordinates of the branches connected to a split node
 * @param splitNode
 * @param branches
 * @returns
 */
export const setSplitBranchesCoordinates = (
  splitNodeLocation: SourceLocation,
  branches: DataflowDiagramNode[],
) => {
  const y = splitNodeLocation.y + 150;
  const xDistance = 180;
  const initialX = splitNodeLocation.x - (branches.length * xDistance) / 2 + xDistance / 2;

  return [...branches].map((branch, i) => ({ ...branch, x: initialX + i * xDistance, y }));
};
