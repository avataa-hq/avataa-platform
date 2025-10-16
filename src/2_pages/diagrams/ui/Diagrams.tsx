import { SyntheticEvent, useCallback, useRef, useState } from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

import {
  CustomEdgeConfig,
  CustomNodeConfig,
  DraggableDialog,
  graphApi,
  IInventoryObjectModel,
  LINE_NODE_EDGE_TYPE,
  SearchInput,
  SidebarLayout,
  TABLE_NODE_EDGE_TYPE,
  useAppNavigate,
  useDiagramsPage,
  useGetPermissions,
  useTabs,
  useTranslate,
} from '6_shared';
import { FindPath, GraphComponentRef, Graph, IFindPathData, useTrace } from '5_entites';
import { RightSidePanel } from '3_widgets';
import { ItemTreeList } from '6_shared/ui/itemTreeList';
import { GraphData } from '6_shared/api/graph/types';
import { StatusDotComponent } from '2_pages/graphsSettings/ui/StatusDotComponent';
import { DiagramsStyled } from './Diagrams.styled';

const { useGetGraphsQuery } = {
  ...graphApi.initialisation,
  ...graphApi.analysis,
};

const Diagrams = () => {
  const translate = useTranslate();
  const graphRef = useRef<GraphComponentRef>();
  const navigate = useAppNavigate();

  const {
    selectedDiagram,
    graphInitialData,
    isLoadingDiagram,
    setGraphInitialData,
    setSelectedDiagram,
  } = useDiagramsPage();

  const { selectedTab } = useTabs();

  const { Container, Sidebar, SidebarHeader, SidebarBody } = SidebarLayout;

  const { data: graphs } = useGetGraphsQuery();
  const permissions = useGetPermissions('diagrams');

  const [searchResult, setSearchResult] = useState(graphs);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isFindPathOpen, setIsFindPathOpen] = useState(false);
  const [rightPanelObjectId, setRightPanelObjectId] = useState<number | null>(null);
  const [findPathData, setFindPathData] = useState<IFindPathData | null>(null);

  const {
    traceRouteValue,
    setTraceRouteValue,
    traceNodesByMoIdKeysValue,
    setTraceNodesByMoIdKeysValue,
  } = useTrace();

  const handleDiagramClick = (e: SyntheticEvent, item: GraphData) => {
    setGraphInitialData(null);
    setSelectedDiagram(item);
  };

  const onGraphNodeClick = useCallback(
    (clickedNode?: CustomNodeConfig) => {
      if (clickedNode?.objectData) {
        setTraceRouteValue(null);
        setFindPathData(null);
        setRightPanelObjectId(+clickedNode.objectData.id);
        setIsRightPanelOpen(true);
      }
    },
    [setTraceRouteValue],
  );

  const onGraphEdgeClick = useCallback(
    (clickedEdge?: CustomEdgeConfig, edgeObjectId?: number | null) => {
      if (clickedEdge) {
        if (clickedEdge.type === LINE_NODE_EDGE_TYPE && clickedEdge.objectData?.id) {
          setRightPanelObjectId(+clickedEdge.objectData.id);
          setIsRightPanelOpen(true);
          return;
        }

        if (clickedEdge.type === TABLE_NODE_EDGE_TYPE && edgeObjectId) {
          setRightPanelObjectId(edgeObjectId);
          setIsRightPanelOpen(true);
        }
      }
    },
    [],
  );

  const onFindGraphPath = useCallback((objectData: IInventoryObjectModel | null) => {
    if (objectData) {
      setRightPanelObjectId(objectData.id);
      setIsFindPathOpen(true);
    }
  }, []);

  const getItemEndAdornment = useCallback((item: GraphData) => {
    switch (item.status) {
      case 'New':
      case 'Complete':
      case 'Error':
        return <StatusDotComponent status={item.status} />;
      case 'In Process':
        return (
          <Tooltip title={item.status}>
            <CircularProgress size={15} />
          </Tooltip>
        );
      default:
        return <FiberManualRecord sx={{ width: '15px' }} color="info" />;
    }
  }, []);

  return (
    <DiagramsStyled>
      <SidebarLayout>
        <Sidebar collapsible>
          <SidebarHeader>
            <Box component="div" display="flex" gap="5px" alignItems="center">
              <SearchInput
                data={graphs}
                searchedProperty="name"
                onChange={(value) => setSearchResult(value)}
              />
            </Box>
          </SidebarHeader>
          <SidebarBody>
            <ItemTreeList
              items={searchResult ?? []}
              onItemClick={handleDiagramClick}
              activeItem={selectedDiagram}
              getItemId={(item) => item.key}
              getItemEndAdornment={getItemEndAdornment}
            />
          </SidebarBody>
        </Sidebar>
        <Container
          position="relative"
          sx={{ backgroundColor: (theme) => theme.palette.neutral.surfaceContainerLow }}
        >
          <Graph
            ref={graphRef}
            graphKey={selectedDiagram?.key}
            initialData={graphInitialData}
            showLegend
            showSearch
            showZoomSlider
            isLoading={isLoadingDiagram}
            onNodeClick={onGraphNodeClick}
            onEdgeClick={onGraphEdgeClick}
            onFindPath={onFindGraphPath}
            isRightPanelOpen={isRightPanelOpen}
            setIsRightPanelOpen={setIsRightPanelOpen}
            setRightPanelObjectId={setRightPanelObjectId}
          />
        </Container>
      </SidebarLayout>
      <RightSidePanel
        objectId={rightPanelObjectId}
        isOpen={isRightPanelOpen}
        setIsOpen={() => setIsRightPanelOpen(!isRightPanelOpen)}
        traceRouteValue={traceRouteValue}
        setTraceRouteValue={setTraceRouteValue}
        setIsFindPathOpen={setIsFindPathOpen}
        isFindPathOpen={isFindPathOpen}
        findPathData={findPathData}
        traceNodesByMoIdKeysValue={traceNodesByMoIdKeysValue}
        setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
        addTab={(value) => navigate(value.value)}
        permissions={permissions}
      />
      {isFindPathOpen && (
        <DraggableDialog
          open={isFindPathOpen && selectedTab === 'diagrams'}
          onClose={() => setIsFindPathOpen(false)}
          title={translate('Find a path')}
          minWidth={500}
          minHeight={400}
          width={600}
          height={400}
        >
          <FindPath
            objectId={rightPanelObjectId}
            setTraceRouteValue={setTraceRouteValue}
            setFindPathData={setFindPathData}
            setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
          />
        </DraggableDialog>
      )}
    </DiagramsStyled>
  );
};

export default Diagrams;
