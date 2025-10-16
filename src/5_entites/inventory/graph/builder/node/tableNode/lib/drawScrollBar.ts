import { IGroup } from '@antv/g6';

interface IProps {
  totalRowsLength: number;
  paginatedRowsLength: number;
  itemsPerPage: number;
  startIndex: number;
  totalHeight: number;
  headerHeight: number;
  totalWidth: number;
  group: IGroup;
}
export const drawScrollBar = ({
  totalRowsLength,
  paginatedRowsLength,
  itemsPerPage,
  startIndex,
  totalHeight,
  headerHeight,
  totalWidth,
  group,
}: IProps) => {
  const barStyle = {
    width: 10,
    padding: 0,
    boxStyle: {
      stroke: '#00000022',
    },
    innerStyle: {
      fill: '#00000022',
    },
  };

  const indexHeight =
    paginatedRowsLength > itemsPerPage ? (paginatedRowsLength / totalRowsLength) * totalHeight : 10;
  const scrollIndicatorOffsetY =
    (startIndex / (totalRowsLength - paginatedRowsLength)) * (totalHeight - headerHeight);

  group.addShape('rect', {
    attrs: {
      y:
        headerHeight +
        barStyle.padding +
        scrollIndicatorOffsetY -
        (scrollIndicatorOffsetY / (totalHeight - headerHeight)) * indexHeight,
      x: totalWidth - barStyle.padding - barStyle.width,
      width: barStyle.width,
      height: Math.min(totalHeight, indexHeight),
      radius: 3,
      ...barStyle.innerStyle,
    },
  });
};
