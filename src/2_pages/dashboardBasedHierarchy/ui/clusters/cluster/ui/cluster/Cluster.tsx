import { useCallback, useRef, memo, MouseEvent } from 'react';
import { ErrorData, ErrorPage, ISpeedometerData } from '6_shared';

import { Body } from './body/Body';
import { ClusterStyled } from './Cluster.styled';
import { Header } from './header/Header';
import { ClusterSkeleton } from './ClusterSkeleton';

interface IClusterDataModel {
  id: string | number;
  name?: string;
  label?: string | null;
  key?: string;
}

interface ClusterProps<D extends IClusterDataModel> {
  clusterData: D | undefined;
  onClusterClick?: (cluster: D) => void;
  loading?: boolean;
  error?: ErrorData | null;
  refetchFn?: () => void;
  speedometersData: ISpeedometerData[];
  tableDataWeek: ISpeedometerData[];
  tableDataMonth: ISpeedometerData[];
  tableDataYear: ISpeedometerData[];
}

const ClusterComponent = <D extends IClusterDataModel>({
  clusterData,
  onClusterClick,
  loading,
  refetchFn,
  error,
  speedometersData,
  tableDataWeek,
  tableDataMonth,
  tableDataYear,
}: ClusterProps<D>) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const name = (clusterData?.label || clusterData?.name || clusterData?.key) ?? '';

  const onClickCluster = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target !== buttonRef.current && clusterData) {
        onClusterClick?.(clusterData);
      }
    },
    [onClusterClick, clusterData],
  );

  if (loading) {
    return <ClusterSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error} refreshFn={refetchFn} />;
  }

  return (
    <ClusterStyled onClick={onClickCluster}>
      <Header name={name} />
      <Body
        speedometersData={speedometersData}
        tableDataWeek={tableDataWeek}
        tableDataMonth={tableDataMonth}
        tableDataYear={tableDataYear}
      />
    </ClusterStyled>
  );
};

export const Cluster = memo(ClusterComponent);
