import { Edge, MarkerType } from '@xyflow/react';
import { OutMoLinkData } from '6_shared';
import { useCallback } from 'react';

interface IArgs {
  outMoLinkInfo?: OutMoLinkData[];
  moId: number;
}

export const useGetConnectorToTprmEdges = () => {
  return useCallback(({ outMoLinkInfo, moId }: IArgs) => {
    if (!outMoLinkInfo) return [];

    return outMoLinkInfo.reduce<Edge[]>((acc, current) => {
      const currentId = `vis-edge_object-connector_${moId}_${current.tprm_id}`;

      if (!acc.find((item) => String(item.id) === currentId)) {
        acc.push({
          source: `object-connector_${moId}`,
          target: `object-connector_${moId}_tprm_${current.tprm_id}`,
          id: currentId,
          reconnectable: false,
          markerEnd: { type: MarkerType.ArrowClosed },
          type: 'smoothstep',
        });
      }
      return acc;
    }, []);
  }, []);
};
