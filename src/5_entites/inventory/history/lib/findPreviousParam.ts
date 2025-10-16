import { IObjectHistoryData } from '5_entites';
import { IGetParameterEventsByObjectId } from '6_shared';

export const findPreviousParam = (
  historyData: IObjectHistoryData[],
  param: IGetParameterEventsByObjectId,
) => {
  if (!historyData || historyData.length === 0) {
    return undefined;
  }

  const previousParam = historyData.find((item) =>
    item.params.some((p) => p.parameter_type_id === param.parameter_type_id),
  );

  return previousParam || undefined;
};
