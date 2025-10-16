import { GraphObjectData, ICustomTableRow } from '6_shared';
import { IConnectivityDiagramData, ICustomDiagramEdge, IEdgeData } from '../../modal/types';

// Данная функция распределения edges. Так как получаемые данные приходят в виде таблицы,
// то можно на основе объектов которые были в таблице определить какие связи могут быть соединенны между собой,
// таким образом, если две связи шли к одному объекту в таблице - это связь одного кабеля и значит что этои связи можно упразднить до одной,
// где source будет нода 1 - из которой выходила эджа в табличный объект, а target будет нода 2, которая так же вела к этому объекту.
// если у объекта лишь одна связь, то значит она будет вести от ноды-источника, в центральную ноду - муфту

export const getEdgesWithCorrectConnections = (
  sleeveTableRows: ICustomTableRow[],
  edges: IConnectivityDiagramData['fibers'],
  sleeveId: string,
): ICustomDiagramEdge[] => {
  const result: ICustomDiagramEdge[] = [];

  const tableRowsEdgesMatrix: Record<string, ICustomDiagramEdge[]> = sleeveTableRows.reduce(
    (acc, row) => {
      acc[row.key] = [];
      return acc;
    },
    {} as Record<string, ICustomDiagramEdge[]>,
  );
  edges.forEach((fiber) => {
    const { sourceKey, targetKey, source, target, id: edgeId, color, label, objectData } = fiber;

    const correctLabel = typeof label === 'string' ? label : undefined;
    const edgeData: IEdgeData = {
      color,
      ...(correctLabel ? { label: correctLabel } : undefined),
      objectData: objectData as GraphObjectData | null | undefined,
      strokeWidth: 2,
    };

    if (source && targetKey && tableRowsEdgesMatrix[targetKey as string]) {
      tableRowsEdgesMatrix[targetKey as string].push({
        id: edgeId!,
        source: { cell: source as string, label: correctLabel },
        data: edgeData,
      });
    }

    if (target && sourceKey && tableRowsEdgesMatrix[sourceKey as string]) {
      tableRowsEdgesMatrix[sourceKey as string].push({
        id: edgeId!,
        source: { cell: target as string, label: correctLabel },
        data: edgeData,
      });
    }
  });

  Object.values(tableRowsEdgesMatrix).forEach((edgeData, idx) => {
    if (edgeData.length === 1) {
      const elem = edgeData[0];
      if (elem.source) {
        result.push({ ...elem, target: { cell: sleeveId } });
      }
      if (elem.target) {
        result.push({ ...elem, target: { cell: sleeveId }, source: { cell: elem.target.cell } });
      }
    }
    if (edgeData.length === 2) {
      const [first, second] = edgeData;

      if (first.source && second.source) {
        result.push({
          source: first.source,
          target: second.source,
          id: `${first.id}${second.id}${idx}`,
          data: {
            ...first.data,
            sourceLabel: first.data?.label,
            targetLabel: second.data?.label,
            sourceColor: first.data?.color,
            targetColor: second.data?.color,
            sourceObjectData: first.data?.objectData,
            targetObjectData: second.data?.objectData,
          },
        });
      }
      if (first.source && second.target) {
        result.push({
          source: first.source,
          target: second.target,
          id: `${first.id}${second.id}${idx}`,
          data: {
            ...first.data,
            sourceLabel: first.data?.label,
            targetLabel: second.data?.label,
            sourceColor: first.data?.color,
            targetColor: second.data?.color,
            sourceObjectData: first.data?.objectData,
            targetObjectData: second.data?.objectData,
          },
        });
      }

      if (first.target && second.source) {
        result.push({
          source: second.source,
          target: first.target,
          id: `${first.id}${second.id}${idx}`,
          data: {
            ...second.data,
            sourceLabel: second.data?.label,
            targetLabel: first.data?.label,
            sourceColor: second.data?.color,
            targetColor: first.data?.color,
            sourceObjectData: second.data?.objectData,
            targetObjectData: first.data?.objectData,
          },
        });
      }
    }
  });
  return result;
};
