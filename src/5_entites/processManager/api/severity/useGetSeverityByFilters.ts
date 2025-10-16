import { useEffect, useState } from 'react';

import { GetSeverityByFiltersBody, searchApiV2, SeverityCount } from '6_shared';
import { SeverityByFiltersModel } from '6_shared/graphQL';

const { useGetSeverityByFiltersQuery } = searchApiV2;

interface IProps {
  severityLiveDataByFilters?: SeverityByFiltersModel | null;
  bodyForSeverityByFilters?: GetSeverityByFiltersBody[] | null;
}

export const useGetSeverityByFilters = ({
  severityLiveDataByFilters,
  bodyForSeverityByFilters,
}: IProps) => {
  const [severityQuantityDataWithLive, setSeverityQuantityDataWithLive] = useState<SeverityCount[]>(
    [],
  );

  const { data, refetch, ...other } = useGetSeverityByFiltersQuery(bodyForSeverityByFilters!, {
    skip: !bodyForSeverityByFilters || !bodyForSeverityByFilters.length,
  });

  useEffect(() => {
    if (!data) return;
    setSeverityQuantityDataWithLive(data);
  }, [data]);

  useEffect(() => {
    if (!severityLiveDataByFilters) return;
    setSeverityQuantityDataWithLive((prev) => {
      return prev.map((p) => {
        const liveCount = severityLiveDataByFilters.find(
          (live) => live.filterName === p.filter_name,
        );
        if (!liveCount) return p;

        return {
          max_severity: liveCount.maxSeverity,
          filter_name: liveCount.filterName,
          count: liveCount.count,
          LIVE: true,
        };
      });
    });
  }, [severityLiveDataByFilters]);

  const refetchData = () => {
    if (data) refetch();
  };

  return { severityQuantityDataWithLive, refetch: refetchData, ...other };
};
