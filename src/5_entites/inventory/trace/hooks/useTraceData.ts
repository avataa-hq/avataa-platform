import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/reduxHooks';
import { GetPathModel, GraphNodeObjectType, SquashLevel } from '6_shared/api/graph/types';
import { IFindPathData } from '5_entites';
import { INodeByMoIdKeys, IRoute } from '../model';
import { useGetAllPathsForNodes, useGetNodesByMoId, useGetPath } from '../api';

interface IProps {
  objectId: number | null;
  squashLevel: SquashLevel;
  isRightPanelOpen?: boolean;
  traceRouteValue?: IRoute | null;
  setTraceRouteValue?: (value: IRoute | null) => void;
  isFindPathOpen?: boolean;
  findPathData?: IFindPathData | null;
  traceNodesByMoIdKeysValue?: INodeByMoIdKeys | null;
  setTraceNodesByMoIdKeysValue?: (value: INodeByMoIdKeys | null) => void;
}

export const useTraceData = ({
  objectId,
  squashLevel,
  isRightPanelOpen = false,
  traceRouteValue,
  setTraceRouteValue,
  isFindPathOpen = false,
  findPathData,
  traceNodesByMoIdKeysValue,
  setTraceNodesByMoIdKeysValue,
}: IProps) => {
  const dispatch = useAppDispatch();

  const [newObjectId, setNewObjectId] = useState(0);
  const [nodesByMoIdKeys, setNodesByMoIdKeys] = useState<INodeByMoIdKeys[]>([]);
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [tmoData, setTmoData] = useState<Record<string, GraphNodeObjectType>>({});
  const [totalPathLength, setTotalPathLength] = useState(0);
  const [newPathData, setNewPathData] = useState<GetPathModel | undefined>(undefined);

  const {
    nodesByMoIdData,
    isNodesByMoIdDataFetching,
    isNodesByMoIdDataError,
    nodesByMoIdDataRefetchFn,
  } = useGetNodesByMoId({
    objectId: newObjectId,
  });
  const {
    allPathsForNodesData,
    isAllPathsForNodesDataFetching,
    isAllPathsForNodesDataError,
    allPathsForNodesDataRefetchFn,
  } = useGetAllPathsForNodes({
    database_key: traceNodesByMoIdKeysValue?.database_key ?? '',
    node_key: traceNodesByMoIdKeysValue?.node_key ?? '',
    skip: !traceNodesByMoIdKeysValue || findPathData !== null,
  });
  const { pathData, isPathDataFetching, isPathDataError, pathDataRefetchFn } = useGetPath({
    database_key: traceNodesByMoIdKeysValue?.database_key ?? '',
    trace_node_key: traceRouteValue?.trace_node_key ?? '',
    squash_level: squashLevel,
    skip: !traceRouteValue || findPathData !== null,
  });

  useEffect(() => {
    if (!findPathData && !isFindPathOpen && !isRightPanelOpen) {
      setRoutes([]);
      setNewPathData(undefined);
    }
  }, [findPathData, isFindPathOpen, isRightPanelOpen]);

  useEffect(() => {
    if (findPathData) {
      setRoutes(findPathData.routes);

      if (traceRouteValue) {
        setNewPathData(findPathData[traceRouteValue.route]?.pathData as GetPathModel);
      }
    }
  }, [pathData, findPathData, traceRouteValue, setRoutes, setNewPathData]);

  useEffect(() => {
    if (nodesByMoIdData && nodesByMoIdData.length > 0 && pathData) {
      setNewPathData(pathData);
    }
  }, [nodesByMoIdData, pathData]);

  useEffect(() => {
    if (objectId) {
      setNewObjectId(objectId);
    }
  }, [objectId]);

  useEffect(() => {
    if (nodesByMoIdKeys.length > 0) {
      setTraceNodesByMoIdKeysValue?.(nodesByMoIdKeys[0]);
    }
  }, [dispatch, nodesByMoIdKeys, setTraceNodesByMoIdKeysValue]);

  useEffect(() => {
    if (!nodesByMoIdData) return;
    if (!findPathData && nodesByMoIdData.length === 0) {
      setNodesByMoIdKeys([]);
      setTraceNodesByMoIdKeysValue?.(null);
      setTraceRouteValue?.(null);
      setRoutes([]);
      setNewPathData(undefined);
      setTotalPathLength(0);
    }
    if (nodesByMoIdData.length > 0) {
      const nodesKeys = nodesByMoIdData.reduce((acc, item) => {
        const obj = {
          database_key: item.key,
          database_name: item.name,
          node_key: item.nodes[0].key,
          name: item.nodes[0].name,
        };
        acc.push(obj);
        return acc;
      }, [] as INodeByMoIdKeys[]);

      if (nodesKeys.length > 0) {
        setNodesByMoIdKeys(nodesKeys);
        setTraceNodesByMoIdKeysValue?.(nodesKeys[0]);
      }
    }
  }, [nodesByMoIdData, findPathData]);

  useEffect(() => {
    if (nodesByMoIdData && nodesByMoIdData.length > 0 && allPathsForNodesData) {
      const allRoutes = allPathsForNodesData.map((item) => ({
        trace_node_key: item.key,
        route: item.name,
      }));

      if (!findPathData && allRoutes.length > 0) {
        setRoutes(allRoutes);
        setTraceRouteValue?.(allRoutes[0]);
      }
    }
  }, [allPathsForNodesData, dispatch, nodesByMoIdData, setTraceRouteValue, findPathData]);

  useEffect(() => {
    if (newPathData) {
      const tmoObj = newPathData.tmo.reduce((acc, item) => {
        acc[item.tmo_id.toString()] = item;
        return acc;
      }, {} as Record<string, GraphNodeObjectType>);

      setTmoData(tmoObj);
    }
  }, [newPathData]);

  useEffect(() => {
    if (newPathData) {
      const pathLength = newPathData.nodes.reduce((acc, item) => {
        if (
          tmoData[item.tmo]?.geometry_type === 'line' &&
          item.data &&
          item.data.geometry?.path_length
        ) {
          return acc + item.data.geometry.path_length;
        }
        return acc;
      }, 0);
      setTotalPathLength(pathLength);
    }
  }, [newPathData, tmoData]);

  const refetch = useCallback(() => {
    if (isNodesByMoIdDataError) {
      return nodesByMoIdDataRefetchFn();
    }

    if (isAllPathsForNodesDataError) {
      return allPathsForNodesDataRefetchFn();
    }

    if (isPathDataError) {
      return pathDataRefetchFn();
    }

    return undefined;
  }, [
    allPathsForNodesDataRefetchFn,
    isAllPathsForNodesDataError,
    isNodesByMoIdDataError,
    isPathDataError,
    nodesByMoIdDataRefetchFn,
    pathDataRefetchFn,
  ]);

  useEffect(() => {
    if (traceNodesByMoIdKeysValue && nodesByMoIdData?.length === 0) {
      // setTraceGraphKey(traceNodesByMoIdKeysValue.database_key);

      if (!nodesByMoIdKeys.length) {
        setNodesByMoIdKeys([traceNodesByMoIdKeysValue]);
      }
    }
  }, [nodesByMoIdData?.length, nodesByMoIdKeys.length, traceNodesByMoIdKeysValue]);

  return {
    nodesByMoIdData,
    pathData: newPathData,
    nodesByMoIdKeys,
    routes,
    tmoData,
    totalPathLength,
    isFetching: isPathDataFetching || isAllPathsForNodesDataFetching || isNodesByMoIdDataFetching,
    isError: isPathDataError || isAllPathsForNodesDataError || isNodesByMoIdDataError,
    refetch,
    setNewPathData,
  };
};
