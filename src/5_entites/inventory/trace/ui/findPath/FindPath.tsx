import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { GraphSearch, IFindPathData } from '5_entites';
import {
  AnalysisNode,
  LoadingAvataa,
  SquashLevel,
  useGetPermissions,
  useTranslate,
} from '6_shared';
import * as SC from './FindPath.styled';
import { useGetObjectDiagrams, useGetPathBetweenNodes } from '../../api';
import { INodeByMoIdKeys, IRoute } from '../../model';

interface IProps {
  objectId: number | null;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setFindPathData?: (data: IFindPathData | null) => void;
  setTraceNodesByMoIdKeysValue?: (value: INodeByMoIdKeys | null) => void;
}

export const FindPath = ({
  objectId,
  setIsRightPanelOpen,
  setTraceRouteValue,
  setFindPathData,
  setTraceNodesByMoIdKeysValue,
}: IProps) => {
  const translate = useTranslate();

  const [traceGraphKey, setTraceGraphKey] = useState('');
  const [selectedNode, setSelectedNode] = useState<AnalysisNode | null>(null);
  const [nodeKeyB, setNodeKeyB] = useState<string>('');
  const [squashLevel, setSquashLevel] = useState<SquashLevel>('Local');

  const squashLevels: SquashLevel[] = ['Full', 'Local', 'None', 'Graph', 'Straight'];

  const diagramsPermissions = useGetPermissions('diagrams');

  const { objectDiagramsData, isObjectDiagramsFetching, isObjectDiagramsError } =
    useGetObjectDiagrams({
      objectId: objectId || 0,
    });

  const { pathBetweenNodesData, isPathBetweenNodesDataFetching, isPathBetweenNodesDataError } =
    useGetPathBetweenNodes({
      database_key: traceGraphKey,
      node_key_a: selectedNode?.key ?? '',
      node_key_b: nodeKeyB,
      squash_level: squashLevel,
      skip: traceGraphKey === '' || !selectedNode || nodeKeyB === '',
    });

  useEffect(() => {
    if (!pathBetweenNodesData) return;
    if (pathBetweenNodesData.length === 0) {
      setTraceRouteValue?.(null);
      setFindPathData?.(null);
      setTraceNodesByMoIdKeysValue?.(null);
    }

    const routes: IRoute[] = [];

    const findPathData = pathBetweenNodesData.reduce((acc, item, idx) => {
      const route = {
        trace_node_key: idx.toString(),
        route: `Path ${idx + 1}`,
      };

      routes.push(route);

      const newObj = {
        trace_node_key: idx.toString(),
        route: `Path ${idx + 1}`,
        routeLength: item.length,
        pathData: {
          nodes: item.nodes,
          edges: item.edges,
          tmo: item.tmo,
        },
      };

      acc[`Path ${idx + 1}`] = newObj;
      return acc;
    }, {} as Omit<IFindPathData, 'routes'>);

    findPathData.routes = routes;

    if (routes.length > 0) {
      setTraceRouteValue?.(routes[0]);
      setFindPathData?.(findPathData as IFindPathData);
      setIsRightPanelOpen?.(true);
      // dispatch(setRightPanelTitle('Trace'));
    }
  }, [
    pathBetweenNodesData,
    setFindPathData,
    setIsRightPanelOpen,
    setTraceRouteValue,
    objectId,
    setTraceNodesByMoIdKeysValue,
  ]);

  useEffect(() => {
    if (!objectDiagramsData) return;
    if (objectDiagramsData.length > 0) {
      setTraceNodesByMoIdKeysValue?.({
        database_key: objectDiagramsData[0].key,
        database_name: objectDiagramsData[0].name,
        name: objectDiagramsData[0].name,
        node_key: objectDiagramsData[0].key,
        tmo: objectDiagramsData[0]?.nodes[0]?.tmo || 0,
      });
      setTraceGraphKey(objectDiagramsData[0].key);
      if (objectDiagramsData[0].nodes.length > 0) {
        setSelectedNode(objectDiagramsData[0].nodes[0]);
      }
    }
  }, [objectDiagramsData, setTraceNodesByMoIdKeysValue]);

  useEffect(() => {
    if (isPathBetweenNodesDataError) {
      enqueueSnackbar({ variant: 'error', message: translate('No data to find a path') });
    }
  }, [isPathBetweenNodesDataError, translate]);

  const handleSquashLevelChange = (event: SelectChangeEvent) => {
    setSquashLevel(event.target.value as SquashLevel);
  };

  return (
    <SC.FindPathStyled>
      <SC.Body>
        <SC.LeftSide>
          <Typography marginBottom="10px">{translate('Point A')}</Typography>
          <SC.TextWrapper>
            <Typography marginLeft="10px">{selectedNode && selectedNode.name}</Typography>
          </SC.TextWrapper>
        </SC.LeftSide>
        <SC.RightSide>
          <Typography marginBottom="10px">
            {translate('Select')} {translate('Point B')}
          </Typography>
          <GraphSearch
            graphKey={traceGraphKey}
            onChange={() => {}}
            slotPropsSx={{
              transform: 'none',
              minWidth: 0,
            }}
            setNodeKeyB={setNodeKeyB}
          />
        </SC.RightSide>
      </SC.Body>
      <SC.Footer>
        <SC.LoadingContainer>
          {(isObjectDiagramsFetching && !isObjectDiagramsError) ||
            (isPathBetweenNodesDataFetching && !isPathBetweenNodesDataError && <LoadingAvataa />)}
          {!isPathBetweenNodesDataFetching &&
            !isPathBetweenNodesDataError &&
            !isObjectDiagramsFetching &&
            !isObjectDiagramsError &&
            (objectDiagramsData?.length === 0 || pathBetweenNodesData?.length === 0) && (
              <Typography>{translate('No data to find a path')}</Typography>
            )}
        </SC.LoadingContainer>

        <FormControl fullWidth sx={{ alignSelf: 'flex-start', width: '50%' }}>
          <InputLabel id="select-label">{translate('Squash level')}</InputLabel>
          <Select
            labelId="select-label"
            value={squashLevel}
            label={translate('Squash level')}
            onChange={handleSquashLevelChange}
            disabled={isPathBetweenNodesDataFetching || !(diagramsPermissions?.view ?? true)}
            sx={{ height: '38px' }}
          >
            {squashLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {translate(level)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SC.Footer>
    </SC.FindPathStyled>
  );
};
