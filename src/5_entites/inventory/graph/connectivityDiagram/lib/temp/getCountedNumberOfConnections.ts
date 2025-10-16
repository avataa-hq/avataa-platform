import { IConnectivityResult, ICustomDiagramEdge } from '../../modal/types';

// Данная функция производит подсчет связей между нодами.
// Она собирает все ноды в один объект, где ключами являются id нод,
// а значением - объект, в котором ключи это id других нод, а значение количество связей и общее количество связей этой ноды
// { 123: { 234: 4, total: 4 } }

export const getCountedNumberOfConnections = (edges: ICustomDiagramEdge[]): IConnectivityResult => {
  const result: IConnectivityResult = {};

  edges.forEach((edge) => {
    const { source, target } = edge;
    if (source?.cell && target?.cell) {
      // Инициализация объектов, если они еще не существуют
      if (!result[source.cell]) result[source.cell] = { total: 0 };
      if (!result[target.cell]) result[target.cell] = { total: 0 };

      // Увеличение счетчика связей между source и target
      if (!result[source.cell][target.cell]) result[source.cell][target.cell] = 0;

      result[source.cell][target.cell] += 1;

      // Увеличение общего количества связей для source
      result[source.cell].total += 1;

      // Увеличение счетчика связей между target и source (если нужно учитывать обратные связи)
      if (!result[target.cell][source.cell]) result[target.cell][source.cell] = 0;

      result[target.cell][source.cell] += 1;

      // Увеличение общего количества связей для target
      result[target.cell].total += 1;
    }
  });

  return result;
};
