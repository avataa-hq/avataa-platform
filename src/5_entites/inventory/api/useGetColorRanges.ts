import { useCellsVisualisationData } from '5_entites/processManager/lib/table/hooks/useCellsVisualisationData';

interface IProps {
  tmo_ids: string[] | undefined;
  tprm_ids: string[] | undefined;
}

export const useGetColorRanges = ({ tmo_ids, tprm_ids }: IProps) => {
  const { colorRangesData } = useCellsVisualisationData({
    tmo_ids,
    tprm_ids,
    is_default: true,
    only_description: false,
  });

  return { colorRangesData };
};
