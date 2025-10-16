import { CustomNodeConfig, DEFAULT_NODE_SIZE } from '6_shared';
import type { Graph, INode } from '@antv/g6';

const isCustomNode = (nodes: INode | CustomNodeConfig): nodes is CustomNodeConfig => {
  return (nodes as CustomNodeConfig)?.key !== undefined;
};

interface IProps {
  center: { x: number; y: number };
  nodes: INode[] | CustomNodeConfig[];
  graph: Graph;
  additionPadding?: number;
}

export const gridPlacement = ({ nodes, center, graph, additionPadding = 1 }: IProps) => {
  const { x: centerX, y: centerY } = center;

  const elementsLen = nodes.length;
  const gridSize = 100; // Размер ячейки сетки
  const padding = DEFAULT_NODE_SIZE + elementsLen + additionPadding; // Величина отступа между нодами
  const numCols = Math.ceil(Math.sqrt(elementsLen)); // Количество столбцов, округленное до ближайшего целого числа квадратного корня от числа элементов
  const numRows = Math.ceil(elementsLen / numCols); // Количество строк

  // Распределяем элементы по сетке
  nodes.forEach((node, index) => {
    const colIndex = index % numCols; // Индекс столбца
    const rowIndex = Math.floor(index / numCols); // Индекс строки

    // Рассчитываем координаты для текущей ноды на основе позиции в сетке
    const x =
      centerX! -
      (numCols * gridSize + (numCols - 1) * padding) / 2 +
      colIndex * (gridSize + padding);
    const y =
      centerY! -
      (numRows * gridSize + (numRows - 1) * padding) / 2 +
      rowIndex * (gridSize + padding);

    if (isCustomNode(node)) {
      const foundNode = graph?.findById(node.id);
      if (foundNode) graph?.updateItem(foundNode, { x, y });
    } else {
      const nodeModel = node?.getModel();
      graph?.updateItem(node, { x, y });
      if (nodeModel) {
        nodeModel.x = x; // Обновляем исходную модель ноды с новыми координатами
        nodeModel.y = y;
      }
    }
  });

  graph?.updateCombos(); // Обновляем комбо, если необходимо
};
