import { ICustomDiagramEdge, IPort } from '../../modal/types';

// Данная функция получает список портов и сортирует их в зависимости от траектории edge.
// К примеру если edges выходят с верхней ноды и направляются в ноду слева, то порты для них должны располагаться в левой части ноды.

const sortPorts = (a: IPort, b: IPort) => {
  // @ts-ignore
  const correctNameA = a.attrs?.text?.text ? a.attrs?.text?.text : '';
  // @ts-ignore
  const correctNameB = b.attrs?.text?.text ? b.attrs?.text?.text : '';
  return correctNameA.localeCompare(correctNameB, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export const getSortedPorts = (ports: IPort[], edges: ICustomDiagramEdge[], sleeveId: string) => {
  const getOrder = (
    currentPosition: string,
    targetSide: string | undefined,
    targetCell: string | undefined,
  ) => {
    const orderMap: Record<string, Record<string, number>> = {
      bottom: { right: 1, top: 2, sleeve: 3, left: 4 },
      right: { bottom: 1, left: 2, sleeve: 3, top: 4 },
      top: { right: 1, bottom: 2, sleeve: 3, left: 4 },
      left: { bottom: 1, right: 2, sleeve: 3, top: 4 },
    };

    if (targetCell === sleeveId) return orderMap[currentPosition].sleeve;
    return orderMap[currentPosition][targetSide!] || 4; // Default to 4 if no matching side
  };

  const newPorts = ports.map((p) => {
    const isSource = p.id.includes('source');
    const relatedEdge = edges.find((e) =>
      isSource ? e.source?.port === p.id : e.target?.port === p.id,
    );

    if (relatedEdge) {
      const target = isSource ? relatedEdge.target : relatedEdge.source;
      const currentPosition = p.group;
      const newOrder = getOrder(currentPosition, target?.side, target?.cell);
      return { ...p, order: newOrder };
    }

    return p;
  });

  // return newPorts.sort((a, b) => (a.order! > b.order! ? 1 : -1));
  return newPorts.sort(sortPorts);
};
