import { IGroup, IShape } from '@antv/g6';

interface IProps {
  group: IGroup;
  width: number;
  height: number;
  headerHeight: number;
  radius: number;
}

export const drawFrame = ({ group, width, height, headerHeight, radius }: IProps) => {
  const keyshape = group.addShape('rect', {
    attrs: { x: 0, y: 0, width, height, radius, stroke: '1' },
    draggable: true,
    name: 'table-node-keyshape',
  });

  const rowsContainer = group.addGroup({});
  const rowsContainerClip: IShape = rowsContainer.setClip({
    type: 'rect',
    attrs: {
      x: 0,
      y: headerHeight,
      width,
      height: height - headerHeight,
      radius: [0, 0, radius, radius],
    },
  });

  return { keyshape, rowsContainerClip, rowsContainer };
};
