import { useMemo } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '../types';

const getUpdatedChildren = (children: TreeNode[]): TreeNode[] => {
  return children.map((child) => {
    let correctValue = 1;
    if (child.sizeValue) {
      if (typeof child.sizeValue === 'number') {
        correctValue = child.sizeValue;
      }
      if (typeof child.sizeValue === 'string' && !Number.isNaN(+child.sizeValue)) {
        correctValue = +child.sizeValue > 0 ? +child.sizeValue : 1;
      }
    }
    return {
      ...child,
      sizeValue: correctValue,
      children: getUpdatedChildren(child.children || []),
    };
  });
};

interface IProps {
  width: number;
  height: number;
  data?: TreeNode[];
}

export const useTreemap = ({ height, width, data }: IProps) => {
  const hierarchy = useMemo(() => {
    const updatedChildren = getUpdatedChildren(data || []);
    const valuesForSize = updatedChildren.map((child) => child.sizeValue) as number[];

    const minValue = Math.min(...valuesForSize);
    const maxValue = Math.max(...valuesForSize);

    const scaleLog = d3
      .scaleLog()
      .domain([Math.max(minValue, 1), Math.max(maxValue, 1)])
      .range([5, 100]);

    return d3.hierarchy<TreeNode>({ name: '', value: 0, children: updatedChildren }).sum((d) => {
      let value = 1;
      if (d.sizeValue != null) value = +d.sizeValue;
      else if (d.value != null) value = +d.value;

      return Math.max(scaleLog(value), 25);
    });
  }, [data]);

  const levels = useMemo(() => {
    const treeGenerator = d3
      .treemap<TreeNode>()
      .size([width, height])
      .padding(2)
      .round(true)
      .tile(d3.treemapBinary);

    return treeGenerator(hierarchy as any).leaves();
  }, [hierarchy, width, height]);

  return { levels };
};
