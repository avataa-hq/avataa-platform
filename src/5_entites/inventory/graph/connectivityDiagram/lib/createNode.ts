import { Graph } from '@antv/x6';

interface ICreateNodeProps {
  graph: Graph;
  id: string;
  label?: string;
  shape?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  ports?: any;
  data?: any;
  fontSize?: number;
  fill?: string;
}

export const createNode = ({
  graph,
  id,
  shape = 'cable-node',
  label,
  x,
  y,
  width,
  height,
  ports,
  data,
  fontSize,
  fill,
}: ICreateNodeProps) => {
  const node = graph.addNode({
    shape,
    id,
    x,
    y,
    width,
    height,
    label,
    ports,
    data,
  });
  fontSize && node.setAttrs({ label: { fontSize } });
  fill && node.setAttrs({ body: { stroke: fill }, labelBackground: { fill } });
  return node;
};
