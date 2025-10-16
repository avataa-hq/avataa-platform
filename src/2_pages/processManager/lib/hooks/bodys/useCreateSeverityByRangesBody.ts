import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFilter,
  GetSeverityByRangesBody,
  IFilterSetModel,
  useDebounceValue,
  useProcessManager,
} from '6_shared';
import { GetRangesForProcessesBody, transformFilterSet } from '5_entites';

interface IProps {
  tmoId?: number;
  getRanges?: GetRangesForProcessesBody;
  currentMultiFilter: IFilterSetModel | null;
}
export const useCreateSeverityByRangesBody = ({ tmoId, getRanges, currentMultiFilter }: IProps) => {
  const [severityByRangesBody, setSeverityByRangesBody] = useState<GetSeverityByRangesBody | null>(
    null,
  );

  const { multiSearchValue } = useProcessManager();

  const searchValue = useDebounceValue(multiSearchValue);

  const columnFilters = useMemo<ColumnFilter[]>(() => {
    const result: ColumnFilter[] = [];
    if (currentMultiFilter) {
      const filterSet = transformFilterSet(currentMultiFilter);
      if (filterSet) result.push(...filterSet);
    }
    return result;
  }, [currentMultiFilter]);

  useEffect(() => {
    const ranges = getRanges?.();
    const rqBody: GetSeverityByRangesBody = {
      columnFilters,
      tmoId,
      findByValue: searchValue,
      rangesObject: { ranges },
    };

    setSeverityByRangesBody(rqBody);
  }, [columnFilters, getRanges, searchValue, tmoId]);

  return { severityByRangesBody, setSeverityByRangesBody };
};
