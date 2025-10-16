import { AnalysisCommutation, AnalysisNode, CustomNodeConfig, TABLE_NODE_TYPE } from '6_shared';

const sortComputation = (a: AnalysisNode, b: AnalysisNode) => {
  // @ts-ignore
  const correctNameA = a.label && a.lebel !== '' ? a.label : a.name;
  // @ts-ignore
  const correctNameB = b.label && b.label !== '' ? b.label : b.name;
  return correctNameA.localeCompare(correctNameB, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export const transformCommutationsToTableNodes = (
  commutations: AnalysisCommutation[],
  tableNodeId?: string,
): CustomNodeConfig[] => {
  return (
    commutations?.map(({ nodes: commutationNodes, ...commutation }) => {
      const id =
        commutations?.length === 1 && tableNodeId
          ? tableNodeId
          : commutationNodes?.[0]?.key ?? Math.random().toString();

      const sortedCommutationNodes = [...commutationNodes].sort(sortComputation);

      return {
        ...commutation,
        // It's important to set the new node id as the first commutation node id, because it will be used for expand/collapse.
        // Otherwise, there may be bugs in expand/collapse functionality.
        id,
        key: id,
        tmo: commutation.tmo_id,
        label: commutation.parent_name,
        type: TABLE_NODE_TYPE,
        // @ts-ignore
        tableRows: sortedCommutationNodes.map(({ key, name, label, connected_with, data }) => {
          const objectName = label && label !== '' ? label : name;
          return {
            key,
            label: objectName ?? '',
            connectedWith: connected_with,
            objectId: data?.id ?? 0,
          };
        }),
      };
    }) ?? []
  );
};
