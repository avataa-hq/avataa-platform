import { CustomEdgeType } from '6_shared';
import { Dispatch, SetStateAction, useCallback } from 'react';

interface IArgs {
  id: string;
  color: string;
  setEdges: Dispatch<SetStateAction<CustomEdgeType[]>>;
}

export const useChangeEdgeColor = () => {
  return useCallback(({ id, color, setEdges }: IArgs) => {
    setEdges((edgs) =>
      edgs.map((edg) => {
        if (edg.id === id) {
          return {
            ...edg,
            data: {
              ...edg.data,
              edgeColor: color,
              logical: edg.data?.logical ?? undefined,
            },
          } as CustomEdgeType;
        }
        return edg;
      }),
    );
  }, []);
};
