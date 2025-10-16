import { useEffect, useState } from 'react';
import {
  GetSeverityAllSubscriptionVariables,
  SeverityByFiltersBody,
  SeverityByFiltersModel,
  SeverityByRangesBody,
  SeverityByRangesModel,
  SeverityProcessLiveDataBody,
  useGetSeverityAllSubscription,
} from '6_shared/graphQL';
import { transformFilterSet, GetRangesForLiveProcessesBody } from '5_entites';
import {
  ColumnFilter,
  GetSeverityByFiltersBody,
  GetSeverityProcessBody,
  IFilterSetModel,
  SeverityProcessModelData,
} from '6_shared';
import { FilterColumn } from '6_shared/graphQL/types/graphqlTypes';

const changeArrayFilterValueToString = (filters?: ColumnFilter[]) => {
  if (!filters || !filters.length) return [];

  return filters?.map((cf) => ({
    ...cf,
    filters: cf.filters?.map((f) => ({
      ...f,
      value: Array.isArray(f.value) ? JSON.stringify(f.value) : f.value,
    })),
  }));
};

interface IProps {
  filterSet: IFilterSetModel | null;
  bodyForProcesses?: GetSeverityProcessBody | null;
  bodyForSeverityByFilters?: GetSeverityByFiltersBody[] | null;
  severityDirection: 'asc' | 'desc';
  getRanges?: GetRangesForLiveProcessesBody;
  getSeverityRanges?: GetRangesForLiveProcessesBody;
}

export const useLiveUpdate = ({
  filterSet,
  bodyForProcesses,
  bodyForSeverityByFilters,
  severityDirection,
  getRanges,
  getSeverityRanges,
}: IProps) => {
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [liveBody, setLiveBody] = useState<GetSeverityAllSubscriptionVariables>({
    filters: { byFilters: null, byRanges: null, processes: null },
  });

  const [liveSeverityRows, setLiveSeverityRows] = useState<SeverityProcessModelData[]>([]);
  const [liveSeverityRowsTotal, setLiveSeverityRowsTotal] = useState<number | undefined>(undefined);
  const [severityLiveDataByFilters, setSeverityLiveDataByFilters] =
    useState<SeverityByFiltersModel>([]);
  const [severityLiveDataByRanges, setSeverityLiveDataByRanges] = useState<SeverityByRangesModel>(
    [],
  );

  // ===== Create Body by Filters
  useEffect(() => {
    if (!bodyForSeverityByFilters || !bodyForSeverityByFilters.length) return;

    const rqBody: SeverityByFiltersBody = {
      filters: bodyForSeverityByFilters.flatMap((b) => {
        if (b.tmoId == null) return [];
        return {
          filterName: b.filterName,
          tmoId: b.tmoId!,
          severityDirection: b.severity_direction,
          columnFilters: changeArrayFilterValueToString(b.columnFilters),
        };
      }),
    };
    setLiveBody((prev) => ({ ...prev, filters: { ...prev.filters, byFilters: rqBody } }));
  }, [bodyForSeverityByFilters]);
  // =====

  // ===== Create Body by Ranges
  useEffect(() => {
    if (!filterSet || !bodyForProcesses?.tmoId) return;

    const byRangeBody: SeverityByRangesBody = {
      filtersList: transformFilterSet(filterSet, 'stringify') as FilterColumn[] | null,
      tmoId: bodyForProcesses.tmoId,
      rangesObject: { ranges: getSeverityRanges?.() ?? [], severityDirection },
    };

    setLiveBody((prev) => ({ ...prev, filters: { ...prev.filters, byRanges: byRangeBody } }));
  }, [bodyForProcesses, filterSet, severityDirection, getSeverityRanges]);
  // =====

  // ===== Create Body for process
  const [processesBody, setProcessesBody] = useState<GetSeverityProcessBody | null>(null);

  useEffect(() => {
    setProcessesBody(bodyForProcesses ?? null);
  }, [bodyForProcesses]);

  useEffect(() => {
    if (!processesBody) return;
    const { limit, columnFilters, findByValue, tmoId, sort, withGroups } = processesBody;

    const forProcessBody: SeverityProcessLiveDataBody = {
      sort,
      findByValue,
      tmoId,
      withGroups,
      rangesObject: { ranges: getRanges?.(false) ?? [], severityDirection },
      limit: { limit: limit?.limit, offset: limit?.offset },
      filtersList: changeArrayFilterValueToString(columnFilters),
    };

    setLiveBody((prev) => ({ ...prev, filters: { ...prev.filters, processes: forProcessBody } }));
  }, [getRanges, processesBody, severityDirection]);

  // =====
  const { data, error, loading } = useGetSeverityAllSubscription({
    variables: liveBody,
    skip: !isLiveUpdate,
  });

  useEffect(() => {
    if (!data) return;
    const { byFilters, processes, byRanges } = data.severity;

    if (processes) {
      const rows: SeverityProcessModelData[] = processes.rows.map((i) => JSON.parse(i));
      setLiveSeverityRowsTotal(processes.totalCount);
      setLiveSeverityRows(rows);
    }
    if (byFilters) setSeverityLiveDataByFilters(byFilters);
    if (byRanges) setSeverityLiveDataByRanges(byRanges);
  }, [data]);

  useEffect(() => {
    if (isLiveUpdate) {
      setIsLiveUpdate(false);

      setTimeout(() => {
        setIsLiveUpdate(true);
      }, 1000);
    }
  }, [liveBody]);

  useEffect(() => {
    if (!isLiveUpdate) {
      setLiveSeverityRows([]);
      setLiveSeverityRowsTotal(0);
    }
  }, [isLiveUpdate]);

  useEffect(() => {
    if (error) {
      setIsLiveUpdate(false);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      setIsLiveUpdate(false);
    };
  }, []);

  return {
    severityLiveDataByFilters,
    severityLiveDataByRanges,
    isLiveUpdate,
    setIsLiveUpdate,
    isLiveDataError: !!error,
    isLiveDataLoading: loading,
    liveSeverityRows,
    liveSeverityRowsTotal,
  };
};
