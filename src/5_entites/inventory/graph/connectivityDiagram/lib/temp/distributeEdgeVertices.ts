import { Edge, Graph, Node } from '@antv/x6';
import { ICustomDiagramEdge } from '../../modal/types';

interface IVert {
  x: number;
  y: number;
}

export const distributeEdgeVertices = (
  graph: Graph,
  edges: ICustomDiagramEdge[],
  sleeveNode: Node,
) => {
  const graphNodes = graph.getNodes();

  graphNodes.forEach((node) => {
    const { ports } = node;

    ports.items.forEach((portItem, idx) => {
      const relatedEdge = edges.find(
        (e) => e.source?.port === portItem.id || e.target?.port === portItem.id,
      );

      if (relatedEdge) {
        const edgeModel = graph.getCellById(relatedEdge.id) as Edge | undefined;
        const edgePolyline = edgeModel?.getPolyline();

        if (edgePolyline) {
          const { bottom, top, right, left, center, width, height } = sleeveNode.getBBox();
          const startX = edgePolyline.start.x;
          const startY = edgePolyline.start.y;
          const endX = edgePolyline.end.x;
          const endY = edgePolyline.end.y;

          let offsetX = edgePolyline.start.x;
          let offsetY = edgePolyline.end.y;

          const fromTop = startY < top;
          const fromBottom = startY > bottom;
          const fromLeft = startX < left;
          const fromRight = startX > right;

          const toTop = endY < top;
          const toBottom = endY > bottom;
          const toLeft = endX < left;
          const toRight = endX > right;
          const toInside = endY < bottom && endY > top && endX < right && endX > left;

          const isFromTopToBottom = fromTop && toBottom;
          const isFromTopToLeft = fromTop && toLeft;
          const isFromTopToRight = fromTop && toRight;

          const isFromLeftToTop = fromLeft && toTop;
          const isFromLeftToBottom = fromLeft && toBottom;
          const isFromLeftToRight = fromLeft && toRight;
          const isFromLeftToInside = fromLeft && toInside;

          const isFromBottomToTop = fromBottom && toTop;
          const isFromBottomToLeft = fromBottom && toLeft;
          const isFromBottomToRight = fromBottom && toRight;

          const isFromRightToTop = fromRight && toTop;
          const isFromRightToBottom = fromRight && toBottom;
          const isFromRightToLeft = fromRight && toLeft;
          const isFromRightToInside = fromRight && toInside;

          const insidePadding = 15;
          const sideBySidePaddingX = idx * (width / 200);
          const sideBySidePaddingY = idx * (height / 200);
          const centerYPadding = center.y + idx * (height / 100);
          const centerXPadding = center.x + idx * (width / 100);

          const topVers: IVert[] = [];
          const rightVers: IVert[] = [];
          const bottomVers: IVert[] = [];
          const leftVers: IVert[] = [];

          // ==================FROM TOP==============
          if (fromTop && toInside) {
            offsetX = startX;
            offsetY = top + insidePadding;
            topVers.push({ x: offsetX, y: offsetY });
          }

          if (fromTop && toTop) {
            topVers.push({ x: startX, y: top + sideBySidePaddingY });
            topVers.push({ x: endX, y: top + sideBySidePaddingY });
          }
          if (isFromTopToBottom) {
            topVers.push({ x: startX, y: top - 10 });
            topVers.push({ x: offsetX, y: centerYPadding + 15 });
            topVers.push({ x: endX, y: centerYPadding + 15 });
            topVers.push({ x: endX, y: bottom });
          }
          if (isFromTopToLeft || isFromTopToRight) {
            topVers.push({ x: startX, y: endY });
          }

          //= ==================FROM BOTTOM====================
          if (fromBottom && toInside) {
            offsetX = startX;
            offsetY = bottom - insidePadding;
            bottomVers.push({ x: startX, y: bottom - insidePadding });
          }

          if (fromBottom && toBottom) {
            bottomVers.push({ x: startX, y: bottom - sideBySidePaddingY });
            bottomVers.push({ x: endX, y: bottom - sideBySidePaddingY });
          }

          if (isFromBottomToTop) {
            bottomVers.push({ x: startX, y: bottom });
            bottomVers.push({ x: startX, y: centerYPadding });
            bottomVers.push({ x: endX, y: centerYPadding });
            bottomVers.push({ x: endX, y: top });
          }
          if (isFromBottomToLeft || isFromBottomToRight) {
            bottomVers.push({ x: startX, y: endY });
          }

          //= ==================FROM LEFT====================

          if (isFromLeftToInside) {
            offsetY = startY;
            offsetX = left + insidePadding;
            leftVers.push({ x: left + insidePadding, y: startY });
          }

          if (fromLeft && toLeft) {
            leftVers.push({ x: left + sideBySidePaddingX, y: startY });
            leftVers.push({ x: left + sideBySidePaddingX, y: endY });
          }

          if (isFromLeftToRight) {
            leftVers.push({ x: left, y: startY });
            leftVers.push({ x: centerXPadding, y: startY });
            leftVers.push({ x: centerXPadding, y: endY });
            leftVers.push({ x: right, y: endY });
          }
          if (isFromLeftToTop || isFromLeftToBottom) {
            leftVers.push({ x: endX, y: startY });
          }

          //= ==================FROM RIGHT====================

          if (isFromRightToInside) {
            offsetY = edgePolyline.start.y;
            offsetX = right - insidePadding;
            rightVers.push({ x: offsetX, y: offsetY });
          }
          if (fromRight && toRight) {
            rightVers.push({ x: right - sideBySidePaddingX, y: startY });
            rightVers.push({ x: right - sideBySidePaddingX, y: endY });
          }

          if (isFromRightToLeft) {
            rightVers.push({ x: right, y: startY });
            rightVers.push({ x: centerXPadding, y: startY });
            rightVers.push({ x: centerXPadding, y: endY });
            rightVers.push({ x: left, y: endY });
          }

          if (isFromRightToTop || isFromRightToBottom) {
            rightVers.push({ x: endX, y: startY });
          }

          if (toInside) {
            const targetInsideNode = graph.addNode({
              id: node.id + idx,
              width: 10, // Размер ноды 10x10
              height: 10,
              x: offsetX,
              y: offsetY,
              shape: 'circle', // Форма круга
              // ports: [{ id: '1' }],
              attrs: {
                body: {
                  fill: 'red', // Красный цвет круга
                  stroke: 'none', // Без обводки
                },
              },
              markup: [
                {
                  tagName: 'circle', // Основной круг
                  selector: 'body',
                },
                {
                  tagName: 'path', // Диагональная линия 1 (слева сверху направо вниз)
                  selector: 'cross1',
                  attrs: {
                    d: 'M 2.5 2.5 L 7.5 7.5', // Диагональная линия креста
                    stroke: 'white',
                    strokeWidth: 1.5, // Толщина линии
                  },
                },
                {
                  tagName: 'path', // Диагональная линия 2 (справа сверху налево вниз)
                  selector: 'cross2',
                  attrs: {
                    d: 'M 7.5 2.5 L 2.5 7.5', // Вторая диагональная линия
                    stroke: 'white',
                    strokeWidth: 1.5, // Толщина линии
                  },
                },
              ],
            });

            edgeModel?.setTarget(targetInsideNode);
          }

          const allVers = [...topVers, ...rightVers, ...bottomVers, ...leftVers];

          edgeModel?.setVertices([...topVers, ...rightVers, ...bottomVers, ...leftVers]);
        }
      }
    });
  });
};
