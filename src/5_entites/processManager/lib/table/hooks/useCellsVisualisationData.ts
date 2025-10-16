import { IColorRangeFindByFilterBody, colorRangesApi } from '6_shared';

const { useFindRangesByFilterQuery } = colorRangesApi;

export const useCellsVisualisationData = ({
  ids,
  tmo_ids,
  tprm_ids,
  is_default,
  limit = 100, // TODO pagination
  offset = 0,
  only_description,
  val_types,
}: IColorRangeFindByFilterBody) => {
  const { data: colorRangesData, isSuccess: colorRangesDataSuccess } = useFindRangesByFilterQuery(
    {
      ids,
      tmo_ids,
      tprm_ids,
      is_default,
      limit,
      offset,
      only_description,
      val_types,
    },
    {
      skip: !tmo_ids || !tprm_ids || !tprm_ids.length,
    },
  );

  return { colorRangesData, colorRangesDataSuccess };
};
