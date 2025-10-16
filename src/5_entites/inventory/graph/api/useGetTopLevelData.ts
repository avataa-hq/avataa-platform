import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { INode } from '@antv/g6';
import { getErrorMessage, graphApi, useSetState, Graph3000Data, MAX_NODES_TO_SHOW } from '6_shared';

const { useLazyGetGraphTopLevelQuery } = graphApi.analysis;

interface IProps {
  initialData?: Graph3000Data | null;
  graphKey?: string;
}

export const useGetTopLevelData = ({ initialData, graphKey }: IProps) => {
  const [sizeExceededModalState, setSizeExceededModalState] = useSetState<{
    isOpen: boolean;
    nodeToExpand: INode | null;
    size: number;
  }>({
    isOpen: false,
    nodeToExpand: null,
    size: 0,
  });
  const [getTopLevel, { data: topLevel, isFetching: isTopLevelFetching }] =
    useLazyGetGraphTopLevelQuery();

  useEffect(() => {
    if (initialData || !graphKey) return;
    const fetchTopLevel = async () => {
      try {
        await getTopLevel({ graphKey: graphKey!, maxSize: MAX_NODES_TO_SHOW }).unwrap();
      } catch (error) {
        if (error?.status === 510) {
          const sizeExceededError = error as {
            status: number;
            data: { detail: { params: { size: number; max_size: number } }; description: string };
          };

          setSizeExceededModalState({
            isOpen: true,
            nodeToExpand: null,
            size: sizeExceededError.data.detail.params.size,
          });
        } else {
          console.error(error);
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        }
      }
    };

    fetchTopLevel();
  }, [setSizeExceededModalState, graphKey, getTopLevel, initialData]);
  return {
    getTopLevel,
    topLevel,
    isTopLevelFetching,
    sizeExceededModalState,
    setSizeExceededModalState,
  };
};
