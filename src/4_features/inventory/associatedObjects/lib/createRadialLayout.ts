import * as d3 from 'd3';
import { AllChildrenResponse } from '6_shared';

interface NodePositions {
  [key: string]: { x: number; y: number };
}
const radiusMultipliers: Record<number, { range: [number, number]; multiplier: number }[]> = {
  2: [
    { range: [0, 7], multiplier: 1 },
    { range: [7, 11], multiplier: 2.2 },
    { range: [11, Infinity], multiplier: 2.8 },
  ],
  3: [
    { range: [0, 4], multiplier: 1 },
    { range: [4, 7], multiplier: 2.2 },
    { range: [7, Infinity], multiplier: 2.8 },
  ],
  4: [
    { range: [0, 4], multiplier: 2.2 },
    { range: [4, 7], multiplier: 2.8 },
    { range: [7, Infinity], multiplier: 3.4 },
  ],
  5: [
    { range: [0, 5], multiplier: 3.4 },
    { range: [5, Infinity], multiplier: 4 },
  ],
};

export const createRadialLayout = (data: AllChildrenResponse) => {
  if (!data || !data.children) {
    console.error('Invalid data structure:', data);
    return {};
  }

  const hierarchyData = d3.hierarchy(data, (d) => d.children);
  hierarchyData.sum((d) => (d.object_id ? d.object_id : 0));

  const treeLayout = d3.tree<AllChildrenResponse>().size([2 * Math.PI, 600]);
  const root = treeLayout(hierarchyData);

  root.each((node) => {
    const angle = node.x;
    const radius = node.y;
    const { depth } = node;
    const childrenCount = node?.parent?.children?.length ?? 0;

    if (depth === 1) {
      node.x = radius * Math.cos(angle);
      node.y = radius * Math.sin(angle);
      return;
    }

    const depthRules = radiusMultipliers[depth];
    if (!depthRules) {
      console.warn(`No rules defined for depth ${depth}`);
      return;
    }

    const rule = depthRules.find(
      ({ range }) => childrenCount >= range[0] && childrenCount < range[1],
    );

    if (rule) {
      const { multiplier } = rule;
      node.x = multiplier * radius * Math.cos(angle);
      node.y = multiplier * radius * Math.sin(angle);
    } else {
      console.warn(`No matching range for depth ${depth} and childrenCount ${childrenCount}`);
    }
  });

  return root.descendants().reduce<NodePositions>((acc, node) => {
    acc[node.data.object_id.toString()] = { x: node.x, y: node.y };
    return acc;
  }, {});
};
