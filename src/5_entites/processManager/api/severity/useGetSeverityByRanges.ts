import { useEffect, useState } from 'react';

import { GetSeverityByRangesBody, searchApiV2, SeverityCount } from '6_shared';
import { SeverityByRangesModel } from '6_shared/graphQL';

const { useGetSeverityByRangesQuery } = searchApiV2;

interface IProps {
  liveSeverityByRangesData?: SeverityByRangesModel | null;
  severityByRangesBody?: GetSeverityByRangesBody | null;
}

export const useGetSeverityByRanges = ({
  liveSeverityByRangesData,
  severityByRangesBody,
}: IProps) => {
  const [severityCountWithLive, setSeverityCountWithLive] = useState<SeverityCount[]>([]);

  const {
    data: countBySeverityData,
    isFetching: isLoadingSeverityCountData,
    refetch: refetchSeverityByRanges,
  } = useGetSeverityByRangesQuery(severityByRangesBody!, {
    skip:
      !severityByRangesBody || !severityByRangesBody.rangesObject || !severityByRangesBody.tmoId,
  });

  useEffect(() => {
    if (!countBySeverityData) return;
    setSeverityCountWithLive(() => {
      if (!liveSeverityByRangesData) return countBySeverityData;

      return countBySeverityData.map((p) => {
        const liveCount = liveSeverityByRangesData.find(
          (live) => live.filterName === p.filter_name,
        );
        if (liveCount) {
          return {
            max_severity: liveCount.maxSeverity,
            filter_name: liveCount.filterName,
            count: liveCount.count,
            LIVE: true,
          };
        }
        return p;
      });
    });
  }, [countBySeverityData, liveSeverityByRangesData]);

  const refetchData = () => {
    if (countBySeverityData) refetchSeverityByRanges();
  };

  return {
    severityCountWithLive,
    isLoadingSeverityCountData,
    refetchSeverityByRanges: refetchData,
  };
};
