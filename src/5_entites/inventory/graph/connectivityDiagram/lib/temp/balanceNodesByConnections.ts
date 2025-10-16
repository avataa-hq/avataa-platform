import { CablesSides, IBalanceNodesConnections, IConnectivityResult } from '../../modal/types';

// Данная функция распределяет узлы (nodes) по четырём сторонам: left, right, top, bottom, на основе матрицы связей (connectivityMatrix),
// чтобы сбалансировать нагрузку на каждую сторону.
// Она выполняет это жадным способом, добавляя узлы поочередно на ту сторону, где текущая сумма весов связей минимальна.

export const balanceNodesByConnections = (
  connectivityMatrix: IConnectivityResult,
  sleeveId: string,
): IBalanceNodesConnections => {
  const nodes = Object.keys(connectivityMatrix).filter((i) => i !== sleeveId);
  const parts: IBalanceNodesConnections = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };

  // Функция для вычисления веса связей между сторонами
  function calculateSideWeights(partsItems: IBalanceNodesConnections): {
    [key: string]: number;
  } {
    const sideWeights: { [key: string]: number } = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    nodes.forEach((node) => {
      const nodeConnections = connectivityMatrix[node];
      Object.keys(partsItems).forEach((part) => {
        const partNodes = partsItems[part];
        const partWeight = partNodes.reduce(
          (sum, partNode) => sum + (nodeConnections[partNode.id] || 0),
          0,
        );
        sideWeights[part] += partWeight;
      });
    });

    return sideWeights;
  }

  // Жадное распределение: добавляем ноды на сторону с минимальным весом
  nodes.sort((a, b) => connectivityMatrix[b].total - connectivityMatrix[a].total); // Сортируем по "total"

  nodes.forEach((node) => {
    const sideWeights = calculateSideWeights(parts);
    const minSide = Object.keys(sideWeights).reduce(
      (a, b) => (sideWeights[a] < sideWeights[b] ? a : b),
      'left',
    );
    parts[minSide].push({
      id: node,
      side: minSide as CablesSides,
      data: {},
    }); // Добавляем ноду на сторону с минимальным весом
  });

  return parts;
};
