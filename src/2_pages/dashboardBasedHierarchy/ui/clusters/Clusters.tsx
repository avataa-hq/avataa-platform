import { memo, useMemo, useEffect, useState } from 'react';
import { ErrorData, InventoryAndHierarchyObjectTogether, ISpeedometerData } from '6_shared';
import { Cluster, ClusterSkeleton } from './cluster';

type SpeedometersDataType = {
  [c: string]: {
    [k: number | string]: ISpeedometerData;
  };
};

interface IProps {
  isLoadingCluster: boolean;
  errorCluster: ErrorData;
  refetchCluster: () => void;
  clusterData?: InventoryAndHierarchyObjectTogether[];
  onClusterClick?: (data: InventoryAndHierarchyObjectTogether) => void;
  speedometersData: SpeedometersDataType;
  tableDataWeek: SpeedometersDataType;
  tableDataMonth: SpeedometersDataType;
  tableDataYear: SpeedometersDataType;
  selectedClusterSortName?: string | null;
  selectedClusterSortDirection?: string | null;
  page: number;
  pageSize: number;
}

const organizeDataByClusterId = (
  clusterData: InventoryAndHierarchyObjectTogether[] | undefined,
  speedometersData: SpeedometersDataType,
  tableDataWeek: SpeedometersDataType,
  tableDataMonth: SpeedometersDataType,
  tableDataYear: SpeedometersDataType,
) => {
  if (!clusterData) return {};

  const dataByClusterId: {
    [id: number | string]: {
      speedometersData: ISpeedometerData[];
      tableDataWeek: ISpeedometerData[];
      tableDataMonth: ISpeedometerData[];
      tableDataYear: ISpeedometerData[];
    };
  } = {};

  clusterData.forEach((data) => {
    const clusterId = data.key;

    dataByClusterId[clusterId] = {
      speedometersData: Object.values(speedometersData).map((item) => item[clusterId]),
      tableDataWeek: Object.values(tableDataWeek).map((item) => item[clusterId]),
      tableDataMonth: Object.values(tableDataMonth).map((item) => item[clusterId]),
      tableDataYear: Object.values(tableDataYear).map((item) => item[clusterId]),
    };
  });

  return dataByClusterId;
};

export const Clusters = memo(
  ({
    isLoadingCluster,
    clusterData,
    onClusterClick,
    speedometersData,
    tableDataWeek,
    tableDataMonth,
    tableDataYear,
    selectedClusterSortName,
    selectedClusterSortDirection,
    page,
    pageSize = 3,
    ...rest
  }: IProps) => {
    const [sortedClusters, setSortedClusters] = useState<InventoryAndHierarchyObjectTogether[]>([]);

    useEffect(() => {
      if (
        !selectedClusterSortName ||
        !clusterData ||
        !speedometersData?.[selectedClusterSortName]
      ) {
        return;
      }

      const direction = selectedClusterSortDirection;

      const sortedClusterData = [...clusterData];

      sortedClusterData.sort((a, b) => {
        const speedA = Number(speedometersData[selectedClusterSortName][a.key]?.value);
        const speedB = Number(speedometersData[selectedClusterSortName][b.key]?.value);

        if (typeof speedA === 'number' && typeof speedB === 'number') {
          if (direction === 'up') {
            return speedB - speedA;
          }
          if (direction === 'down') {
            return speedA - speedB;
          }
        }

        return 0;
      });

      setSortedClusters(sortedClusterData);
    }, [clusterData, selectedClusterSortName, selectedClusterSortDirection, speedometersData]);

    const dataByClusterId = useMemo(
      () =>
        organizeDataByClusterId(
          sortedClusters,
          speedometersData,
          tableDataWeek,
          tableDataMonth,
          tableDataYear,
        ),
      [sortedClusters, speedometersData, tableDataWeek, tableDataMonth, tableDataYear],
    );

    const clustersToShow = useMemo(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return sortedClusters?.slice(startIndex, endIndex);
    }, [page, pageSize, sortedClusters]);

    return (
      <>
        {isLoadingCluster &&
          [1, 2, 3, 4].map((item) => <ClusterSkeleton key={item} size="small" />)}
        {!isLoadingCluster &&
          clustersToShow?.map((data, idx) => (
            <Cluster
              onClusterClick={(cluster) =>
                onClusterClick?.(cluster as unknown as InventoryAndHierarchyObjectTogether)
              }
              key={idx}
              clusterData={data}
              speedometersData={dataByClusterId[data.key]?.speedometersData}
              tableDataWeek={dataByClusterId[data.key]?.tableDataWeek}
              tableDataMonth={dataByClusterId[data.key]?.tableDataMonth}
              tableDataYear={dataByClusterId[data.key]?.tableDataYear}
            />
          ))}
      </>
    );
  },
);
