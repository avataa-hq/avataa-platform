import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { AnalysisNode, LoadingAvataa, graphApi, useTranslate } from '6_shared';
import { IFindPathData, INodeByMoIdKeys, IRoute } from '5_entites';
import * as SC from './ShowCommonPath.styled';
import { useFindCommonPath } from '../../api';

const { useLazyGetNodesByMoIdQuery, useLazyGetAllPathsForNodesQuery } = graphApi.trace;

interface IProps {
  objectIds: number[];
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setFindPathData?: (data: IFindPathData | null) => void;
  setTraceNodesByMoIdKeysValue?: (value: INodeByMoIdKeys | null) => void;
}

export const ShowCommonPath = ({
  objectIds,
  setIsRightPanelOpen,
  setTraceRouteValue,
  setFindPathData,
  setTraceNodesByMoIdKeysValue,
}: IProps) => {
  const translate = useTranslate();

  const [traceGraphKey, setTraceGraphKey] = useState('');
  const [nodeKeyA, setNodeKeyA] = useState<string>('');
  const [nodeKeyB, setNodeKeyB] = useState<string>('');

  const [selectedNodeA, setSelectedNodeA] = useState<AnalysisNode | null>(null);
  const [selectedNodeB, setSelectedNodeB] = useState<AnalysisNode | null>(null);

  const [traceNodeKeyA, setTraceNodeKeyA] = useState('');
  const [traceNodeKeyB, setTraceNodeKeyB] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [getNodeByMoId] = useLazyGetNodesByMoIdQuery();
  const [getAllPathsForNodes] = useLazyGetAllPathsForNodesQuery();

  const { findCommonPathData, isFindCommonPathFetching, isFindCommonPathError } = useFindCommonPath(
    {
      database_key: traceGraphKey,
      trace_node_a_key: traceNodeKeyA,
      trace_node_b_key: traceNodeKeyB,
      squash_level: 'Full',
      skip: traceNodeKeyA === '' || traceNodeKeyB === '',
    },
  );

  useEffect(() => {
    if (!findCommonPathData) return;
    if (findCommonPathData.nodes.length === 0) {
      setTraceRouteValue?.(null);
      setFindPathData?.(null);
      setTraceNodesByMoIdKeysValue?.(null);
    }

    if (findCommonPathData.nodes.length) {
      setFindPathData?.({
        'Common path': {
          pathData: findCommonPathData,
          route: 'Common path',
          routeLength: 0,
          trace_node_key: '1',
        },
        routes: [],
      } as unknown as IFindPathData);

      setTraceRouteValue?.({
        trace_node_key: '1',
        route: 'Common path',
      });
      setIsRightPanelOpen?.(true);
      // dispatch(setRightPanelTitle('Trace'));
    }
  }, [findCommonPathData, setFindPathData, setIsRightPanelOpen]);

  useEffect(() => {
    if (traceGraphKey !== '' && nodeKeyA !== '' && nodeKeyB !== '') {
      const getAllPathsForNodesData = async () => {
        setIsLoading(true);
        const firstPathData = await getAllPathsForNodes({
          database_key: traceGraphKey,
          body: {
            node_key: nodeKeyA,
          },
        }).unwrap();

        if (firstPathData.length) {
          setTraceNodeKeyA(firstPathData[0].key);
        }

        const secondPathData = await getAllPathsForNodes({
          database_key: traceGraphKey,
          body: {
            node_key: nodeKeyB,
          },
        }).unwrap();

        if (secondPathData.length) {
          setTraceNodeKeyB(secondPathData[0].key);
        }

        setIsLoading(false);
      };

      getAllPathsForNodesData();
    }
  }, [getAllPathsForNodes, nodeKeyA, nodeKeyB, traceGraphKey]);

  useEffect(() => {
    if (objectIds.length === 2) {
      const getObjectsData = async () => {
        setIsLoading(true);
        const firstObjectDiagramsData = await getNodeByMoId(objectIds[0]).unwrap();
        if (firstObjectDiagramsData.length) {
          setTraceGraphKey(firstObjectDiagramsData[0].key);
          setTraceNodesByMoIdKeysValue?.({
            database_key: firstObjectDiagramsData[0].key,
            database_name: firstObjectDiagramsData[0].name,
            name: firstObjectDiagramsData[0].name,
            node_key: firstObjectDiagramsData[0].key,
            tmo: firstObjectDiagramsData[0]?.nodes[0]?.tmo || 0,
          });
          setTraceGraphKey(firstObjectDiagramsData[0].key);
          if (firstObjectDiagramsData[0].nodes.length) {
            setNodeKeyA(firstObjectDiagramsData[0].nodes[0].key);
            setSelectedNodeA(firstObjectDiagramsData[0].nodes[0]);
          }
        }

        const secondObjectDiagramsData = await getNodeByMoId(objectIds[1]).unwrap();
        if (secondObjectDiagramsData.length !== 0) {
          if (secondObjectDiagramsData.length && secondObjectDiagramsData[0].nodes.length) {
            setNodeKeyB(secondObjectDiagramsData[0].nodes[0].key);
            setSelectedNodeB(secondObjectDiagramsData[0].nodes[0]);
          }
        }

        setIsLoading(false);
      };

      getObjectsData();
    }
  }, [getNodeByMoId, objectIds]);

  useEffect(() => {
    if (isFindCommonPathError) {
      enqueueSnackbar({
        variant: 'error',
        message: translate('An error has occurred, please try again'),
      });
    }
  }, [isFindCommonPathError, translate]);

  return (
    <SC.ShowCommonPathStyled>
      <SC.Body>
        <SC.LeftSide>
          <Typography marginBottom="10px">Node A</Typography>
          <SC.TextWrapper>
            <Typography marginLeft="10px">{selectedNodeA && selectedNodeA.name}</Typography>
          </SC.TextWrapper>
        </SC.LeftSide>
        <SC.RightSide>
          <Typography marginBottom="10px">Node B</Typography>
          <SC.TextWrapper>
            <Typography marginLeft="10px">{selectedNodeB && selectedNodeB.name}</Typography>
          </SC.TextWrapper>
        </SC.RightSide>
      </SC.Body>
      <SC.Footer>
        {(isLoading || isFindCommonPathFetching) && !isFindCommonPathError && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}
        {!isLoading && !isFindCommonPathFetching && !isFindCommonPathError && (
          <SC.LoadingContainer>
            {(!selectedNodeA || !selectedNodeB) && (
              <Typography>{translate('No trace data')}</Typography>
            )}
            {findCommonPathData?.nodes.length === 0 && (
              <Typography>{translate('No common path')}</Typography>
            )}
          </SC.LoadingContainer>
        )}
      </SC.Footer>
    </SC.ShowCommonPathStyled>
  );
};
