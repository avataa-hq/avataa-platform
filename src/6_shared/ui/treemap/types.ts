import * as d3 from 'd3';

export type TreeNode<T extends Record<string, any> = Record<string, any>> = {
  name: string;
  properties?: T;
  value: number;
  valueDecimals?: number;
  sizeValue?: number | string;
  children?: TreeNode[];
};
export type ExtendedHierarchyRectNode = d3.HierarchyRectangularNode<TreeNode>;
