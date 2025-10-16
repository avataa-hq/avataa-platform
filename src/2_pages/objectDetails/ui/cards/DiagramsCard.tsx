import { SyntheticEvent, useEffect, useState } from 'react';
import { Autocomplete, Box, CardHeader, TextField } from '@mui/material';
import {
  GetNodesByMoIdModel,
  IosSwitch,
  graphApi,
  useTranslate,
  useAppNavigate,
  useDiagramsPage,
  Graph3000Data,
} from '6_shared';
import { Graph, TraceGraph, useTraceData } from '5_entites';
import { INodeByMoIdKeys, IRoute } from '5_entites/inventory/trace/model';
import { ObjectDetailsCard } from './ObjectDetailsCard';
import { IconButtonStyled } from '../commonComponents';
import { MainModuleListE } from '../../../../config/mainModulesConfig/mainModuleList';

interface DiagramsCardProps {
  objectId: number;
}

const { useGetObjectDiagramsQuery } = graphApi.search;
const { useGetNeighborsMutation } = graphApi.analysis;

export const DiagramsCard = ({ objectId }: DiagramsCardProps) => {
  const translate = useTranslate();
  const navigate = useAppNavigate();

  const { setGraphInitialData, setSelectedDiagram } = useDiagramsPage();

  const {
    pathData,
    routes,
    nodesByMoIdKeys,
    isFetching: isTraceDataFetching,
  } = useTraceData({ objectId, squashLevel: 'Local' });
  const [selectedGraph, setSelectedGraph] = useState<(GetNodesByMoIdModel & Graph3000Data) | null>(
    null,
  );
  const [traceDiagram, setTraceDiagram] = useState<INodeByMoIdKeys | null>(null);
  const [traceRoute, setTraceRoute] = useState<IRoute | null>(null);
  const [showTrace, setShowTrace] = useState(false);

  const { data: objectDiagrams, isFetching } = useGetObjectDiagramsQuery(objectId);
  const [getNeighbors] = useGetNeighborsMutation();

  const handleLinkButtonClick = () => {
    if (!selectedGraph) return;
    navigate(MainModuleListE.diagrams);
    setSelectedDiagram({
      key: selectedGraph.key,
      name: selectedGraph.name,
      status: 'New',
      tmo_id: 0,
      error_description: null,
    });

    setGraphInitialData({
      nodes: selectedGraph.nodes,
      edges: selectedGraph.edges,
      commutation: selectedGraph.commutation,
    });
  };

  useEffect(() => {
    setShowTrace(false);
  }, [objectId]);

  useEffect(() => {
    if (objectDiagrams && objectDiagrams.length) {
      const fetchNeighbors = async () => {
        const neighborsData = await getNeighbors({
          graphKey: objectDiagrams[0].key,
          body: { node_key: objectDiagrams[0].nodes[0]?.key, n: 1 },
        }).unwrap();
        setSelectedGraph({
          ...objectDiagrams[0],
          ...neighborsData,
          nodes: [...objectDiagrams[0].nodes, ...neighborsData.nodes],
        });
      };

      fetchNeighbors();

      // graphRef.current?.showNodeWithNeighbors(objectDiagrams[0].nodes[0]);
    }
  }, [getNeighbors, objectDiagrams]);

  useEffect(() => {
    if (nodesByMoIdKeys && nodesByMoIdKeys.length) {
      setTraceDiagram(nodesByMoIdKeys[0]);
    }
  }, [nodesByMoIdKeys]);

  useEffect(() => {
    if (routes && routes.length) {
      setTraceRoute(routes[0]);
    }
  }, [routes]);

  if (!objectDiagrams?.length) return null;

  const handleGraphSelect = (event: SyntheticEvent, value: GetNodesByMoIdModel | null) => {
    if (value) setSelectedGraph(value);
  };

  const handleTraceDiagramChange = (event: SyntheticEvent, value: INodeByMoIdKeys | null) => {
    if (value) setTraceDiagram(value);
  };

  const handleTraceRouteChange = (event: SyntheticEvent, value: IRoute | null) => {
    if (value) setTraceRoute(value);
  };

  return (
    <ObjectDetailsCard isLoading={isFetching} sx={{ position: 'relative' }}>
      <CardHeader
        action={<IconButtonStyled onClick={handleLinkButtonClick} />}
        title={
          <>
            {!isTraceDataFetching && !!nodesByMoIdKeys?.length && !!routes?.length && (
              <IosSwitch
                sx={{ mr: '10px' }}
                checked={showTrace}
                color="primary"
                onChange={(e) => setShowTrace(e.target.checked)}
              />
            )}
            {translate(showTrace ? 'Trace' : 'Diagram')}
          </>
        }
        sx={{ position: 'relative', zIndex: 2 }}
      />
      <>
        <Box component="div" height="100%" width="100%" top={0} left={0} position="absolute">
          {!showTrace && selectedGraph && (
            <Graph
              graphKey={selectedGraph.key}
              initialData={{
                nodes: selectedGraph.nodes,
                edges: selectedGraph.edges,
                commutation: selectedGraph.commutation,
              }}
            />
          )}
          {showTrace && <TraceGraph pathData={pathData} isDraggable isZoomable />}
        </Box>

        <Box
          component="div"
          position="absolute"
          bottom={10}
          width="60%"
          display="flex"
          flexDirection="column"
          gap="5px"
        >
          {showTrace ? (
            <>
              <Autocomplete
                sx={{
                  backgroundColor: (theme) => theme.palette.background.default,
                  borderRadius: '10px',
                }}
                value={traceDiagram}
                onChange={handleTraceDiagramChange}
                options={nodesByMoIdKeys}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField placeholder="Select diagram" {...params} />
                )}
                getOptionLabel={(option) => option.name}
                getOptionKey={(option) => option.database_key}
                isOptionEqualToValue={(option, value) =>
                  option.database_key === value?.database_key
                }
              />
              <Autocomplete
                sx={{
                  backgroundColor: (theme) => theme.palette.background.default,
                  borderRadius: '10px',
                }}
                value={traceRoute}
                onChange={handleTraceRouteChange}
                options={routes}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField placeholder="Select path" {...params} />
                )}
                getOptionLabel={(option) => option.route}
                getOptionKey={(option) => option.trace_node_key}
                isOptionEqualToValue={(option, value) =>
                  option.trace_node_key === value?.trace_node_key
                }
              />
            </>
          ) : (
            <Autocomplete
              sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                borderRadius: '10px',
              }}
              value={selectedGraph}
              onChange={handleGraphSelect}
              options={objectDiagrams}
              renderInput={({ InputLabelProps, ...params }) => (
                <TextField placeholder="Diagram" {...params} />
              )}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.key}
              isOptionEqualToValue={(option, value) => option.key === value?.key}
            />
          )}
        </Box>
      </>
    </ObjectDetailsCard>
  );
};
