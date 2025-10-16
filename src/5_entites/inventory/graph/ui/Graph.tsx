import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  AnalysisNode,
  CustomEdgeConfig,
  CustomNodeConfig,
  Graph3000Data,
  IInventoryObjectModel,
  LoadingAvataa,
  LoadingContainer,
  TABLE_NODE_TYPE,
  useColorsConfigure,
  useDiagrams,
  useTabs,
} from '6_shared';
import { IEdge, INode, Item } from '@antv/g6';
import { enqueueSnackbar } from 'notistack';
import { ColorSelecting, ColorSettings } from '3_widgets';
import { useRightPanelResizeObserver } from '5_entites';
import { DiagramsStyled, GraphStyled, SearchContainer } from './Graph.styled';
import {
  EdgeController,
  Graph3000,
  useGetLineNodeEdgeContextMenu,
  useGetNodeContextMenu,
  useGraphColorRanges,
} from '../builder';
import { useGetGraphConfig } from '../builder/graph/config';
import { useDataProviders, useGetTopLevelData } from '../api';
import {
  onGraphEdgeMouseClick,
  onGraphEdgeMouseEnter,
  onGraphEdgeMouseLeave,
  onGraphNodeMouseClick,
  onGraphNodeMouseEnter,
  onGraphNodeMouseLeave,
  getObjectId,
} from '../events';
import { GraphSearch } from './search/GraphSearch';
import { ZoomControls } from './ZoomControls';
import { GraphLegend } from './legend';
import { SizeExceededErrorModal } from './modals';

interface IProps {
  onNodeClick?: (clickedNode?: CustomNodeConfig) => void;
  onEdgeClick?: (clickedEdge?: CustomEdgeConfig, edgeObjectId?: number | null) => void;
  onFindPath?: (objectData: IInventoryObjectModel | null) => void;

  graphKey?: string;
  isLoading?: boolean;
  initialData?: Graph3000Data | null;
  showLegend?: boolean;
  showSearch?: boolean;
  showZoomSlider?: boolean;
  isRightPanelOpen?: boolean;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setRightPanelObjectId?: (objectId: number | null) => void;
}

export interface GraphComponentRef {
  showNodeWithNeighbors: (nodeToShow: AnalysisNode, neighbors?: number) => void | Promise<void>;
  setItemState: (item: string | Item, state: 'active', enabled: boolean) => void;
}

export const Graph = forwardRef(
  (
    {
      onNodeClick,
      onEdgeClick,
      onFindPath,
      graphKey,
      showLegend,
      showSearch,
      showZoomSlider,
      isLoading,
      initialData,
      isRightPanelOpen,
      setIsRightPanelOpen,
      setRightPanelObjectId,
    }: IProps,
    graphComponentRef,
  ) => {
    const graphContainerRef = useRef<HTMLDivElement | null>(null);
    const graphRef = useRef<Graph3000 | null>(null);

    const { currentTmoId, isOpenColorSelecting } = useColorsConfigure();
    const { selectedTab } = useTabs();
    const { defaultGraphLinks, setCurrentGraphKey } = useDiagrams();

    const { rightPanelWidth } = useRightPanelResizeObserver();

    const [currentZoom, setCurrentZoom] = useState(0);

    const { getGraphConfig, outerLayout } = useGetGraphConfig({
      setIsRightPanelOpen,
      setRightPanelObjectId,
    });
    const dataProviders = useDataProviders(graphKey ?? '');
    const {
      getTopLevel,
      isTopLevelFetching,
      topLevel,
      sizeExceededModalState,
      setSizeExceededModalState,
    } = useGetTopLevelData({
      graphKey,
    });
    const getNodeContextMenu = useGetNodeContextMenu();
    const getLineNodeEdgeContextMenu = useGetLineNodeEdgeContextMenu();

    const {
      graphTmosWithColorRanges,
      palettes,
      isFetching: isGraphColorRangesFetching,
      selectColorRange,
    } = useGraphColorRanges(graphKey ?? '');

    useEffect(() => {
      if (!graphKey) return;
      setCurrentGraphKey(graphKey);
    }, [graphKey]);

    useImperativeHandle<unknown, GraphComponentRef>(
      graphComponentRef,
      () => ({
        showNodeWithNeighbors: async (nodeToShow: AnalysisNode, neighbors?: number) => {
          await graphRef.current?.showNodeWithNeighbors(nodeToShow, neighbors);
        },
        setItemState: (item: string | Item, state: 'active', enabled: boolean) => {
          const comboId = graphRef.current
            ?.getCombos()
            .find((combo) => combo.getID() === item)
            ?.getID();

          setTimeout(() => {
            if (comboId !== item) {
              graphRef.current?.setItemState(item, state, enabled);
            }
          }, 1000);
        },
      }),
      [],
    );

    useEffect(() => {
      if (!graphContainerRef.current) return () => null;
      const graphConfig = getGraphConfig();
      const nodeContextMenu = getNodeContextMenu({
        onCollapse: async (item: INode) => {
          graphRef.current?.collapseNode(item);
        },
        onExpand: async (item: INode) => {
          graphRef.current?.expandNode(item);
        },
        onShowNeighbors: async (item: INode) => {
          await graphRef.current?.showNodeNeighbors(item);
        },
        onFindAPath: async (item: INode) => {
          const objectData = item._cfg?.model?.objectData as IInventoryObjectModel | undefined;
          if (!objectData) {
            enqueueSnackbar({
              variant: 'error',
              message: 'No data to find a path',
            });
          } else {
            onFindPath?.(objectData);
          }
        },
      });
      const lineNodeEdgeContextMenu = getLineNodeEdgeContextMenu({
        onCollapse: async (edge) => {
          graphRef.current?.collapseNode(edge as unknown as INode);
        },
        onExpand: async (edge) => {
          await graphRef.current?.expandLineNodeEdge(edge);
        },
      });

      const graph = new Graph3000({
        container: graphContainerRef.current,
        width: graphContainerRef.current?.scrollWidth,
        height: graphContainerRef.current?.scrollHeight || 500,
        plugins: [nodeContextMenu, lineNodeEdgeContextMenu],
        ...graphConfig,
      });

      const edgeController = new EdgeController();
      graph.setEdgeController(edgeController);

      graphRef.current = graph;

      graph.get('canvas').set('localRefresh', false);

      return () => {
        graphRef.current = null;
        graph.destroy();
      };
    }, [getGraphConfig, getNodeContextMenu, onFindPath]);

    useEffect(() => {
      Object.entries(dataProviders).forEach(([key, value]) => {
        graphRef.current?.setDataProvider(key as any, value);
      });
    }, [dataProviders]);

    useEffect(() => {
      // region ===== NODE EVENTS =====
      graphRef.current?.on('node:mouseenter', (e) => {
        if (graphRef.current) onGraphNodeMouseEnter(e, graphRef.current);
      });
      graphRef.current?.on('node:mouseleave', (e) => {
        if (graphRef.current) onGraphNodeMouseLeave(e, graphRef.current);
      });
      graphRef.current?.on('node:click', (e) => {
        if (graphRef.current) onGraphNodeMouseClick(e, graphRef.current);
        onNodeClick?.(e.item?.getModel() as CustomNodeConfig | undefined);
      });
      // graphRef.current?.on('node:dragend', ({ x, y, item }) => {
      //   if (item) {
      //     graphRef.current?.updateItem(item, { fx: x, fy: y });
      //   }
      // });
      // endregion ===== \\ =====

      // region ===== EDGE EVENTS =====
      graphRef.current?.on('edge:mouseenter', (e) => {
        if (graphRef.current) onGraphEdgeMouseEnter(e, graphRef.current);
      });
      graphRef.current?.on('edge:mouseleave', (e) => {
        if (graphRef.current) onGraphEdgeMouseLeave(e, graphRef.current);
      });
      graphRef.current?.on('edge:click', (e) => {
        if (e.item) {
          const objectId = getObjectId(e.item as IEdge);
          if (graphRef.current) onGraphEdgeMouseClick(e, graphRef.current, objectId);
          onEdgeClick?.(e.item?.getModel() as CustomEdgeConfig | undefined, objectId);
        }
      });
      // endregion ===== \\ =====

      // region ===== GRAPH EVENTS =====
      graphRef.current?.on('afterremoveitem', (e) => {
        const removedNode = e.item as unknown as CustomNodeConfig;

        if (removedNode?.type === TABLE_NODE_TYPE) {
          graphRef.current?.addBehaviors('zoom-canvas', 'default');
        }
      });
      graphRef.current?.on('wheelzoom', (e) => {
        const zoom = graphRef.current?.getZoom();
        if (zoom != null) setCurrentZoom(zoom);
      });
      // endregion ===== \\ =====

      graphRef.current?.on('node:drag', (e) => {
        const item = e.item as INode;

        const itemModel = item.getModel();
        const itemEdges = item.getEdges();

        if (itemModel.type !== 'cabel-node') return;
        const { x, y } = itemModel;
        if (x === undefined || y === undefined) return;

        let direction = '';

        // Определение направления
        if (Math.abs(x) > Math.abs(y)) {
          if (x > 0) {
            direction = 'left';
          } else {
            direction = 'right';
          }
        } else if (y > 0) {
          direction = 'up';
        } else {
          direction = 'down';
        }

        // if (x > 0 && Math.abs(x) > Math.abs(y)) {
        //   direction = 'left'; // right
        // } else if (x < 0 && Math.abs(x) > Math.abs(y)) {
        //   direction = 'right'; // left
        // } else if (y > 0 && Math.abs(y) > Math.abs(x)) {
        //   direction = 'up'; // down
        // } else if (y < 0 && Math.abs(y) > Math.abs(x)) {
        //   direction = 'down'; // up
        // }

        const directionMultipliers: Record<string, number> = {
          up: 0,
          right: 1,
          down: 2,
          left: 3,
        };

        const multiplier = directionMultipliers[direction];

        itemEdges.forEach((edge, idx) => {
          const anchorValue = multiplier * itemEdges.length + idx;
          graphRef.current?.updateItem(edge, {
            sourceAnchor: anchorValue,
            targetAnchor: anchorValue,
          });
        });
      });

      return () => {
        graphRef.current?.off();
        outerLayout.destroy();
      };
    }, [onEdgeClick, onNodeClick, outerLayout]);

    useEffect(() => {
      graphRef.current?.readData(initialData ?? topLevel ?? { nodes: [] });
      graphRef.current?.layout();
      graphRef.current?.fitCenter();
      graphRef.current?.zoom(1);
    }, [topLevel, initialData]);

    useEffect(() => {
      const resizeGraph = () => {
        if (!graphRef.current || graphRef.current.get('destroyed')) return;
        if (!graphContainerRef.current) return;
        graphRef.current.changeSize(
          graphContainerRef.current.scrollWidth,
          graphContainerRef.current.scrollHeight - 30,
        );
      };
      window?.addEventListener('resize', resizeGraph);

      return () => {
        window?.removeEventListener('resize', resizeGraph);
      };
    }, []);

    useEffect(() => {
      const newData = { ...defaultGraphLinks, ...graphTmosWithColorRanges };
      graphRef.current?.setConfig({ graphTmosWithColorRanges });
      // @ts-ignore
      graphRef.current?.applyColorPalette({ graphTmosWithColorRanges: newData });
    }, [graphTmosWithColorRanges, defaultGraphLinks]);

    const handleGraphSearch = async (nodeTree: AnalysisNode[]) => {
      const lastNode = nodeTree[nodeTree.length - 1];

      await graphRef.current?.showNodeWithNeighbors(lastNode);
    };

    return (
      <DiagramsStyled>
        <GraphStyled ref={graphContainerRef} />
        {(isTopLevelFetching || isGraphColorRangesFetching || isLoading) && (
          <LoadingContainer>
            <LoadingAvataa />
          </LoadingContainer>
        )}
        {showSearch && (
          <SearchContainer
            onClick={(e) => {
              if (e.ctrlKey && e.shiftKey) {
                // const edges = graphRef.current?.getEdges()?.map((edg) => edg.getModel());
                // const nodes = graphRef.current?.getNodes()?.map((nd) => nd.getModel());
                graphRef.current?.freezeDataLayout();
                graphRef.current?.layout();
              }
            }}
            sx={{ right: isRightPanelOpen ? `${rightPanelWidth + 20}px` : '20px' }}
          >
            <GraphSearch graphKey={graphKey ?? ''} onChange={handleGraphSearch} />
          </SearchContainer>
        )}
        <ZoomControls
          withSlider={showZoomSlider}
          graph={graphRef.current}
          currentZoom={currentZoom}
        />
        {showLegend && (
          <GraphLegend
            graphTmosWithColors={graphTmosWithColorRanges ?? {}}
            isRightPanelOpen={isRightPanelOpen}
            rightPanelWidth={rightPanelWidth}
          />
        )}
        <SizeExceededErrorModal
          onSearch={handleGraphSearch}
          diagramKey={graphKey ?? ''}
          isOpen={sizeExceededModalState.isOpen}
          size={sizeExceededModalState.size}
          onClose={() => setSizeExceededModalState({ isOpen: false, size: 0, nodeToExpand: null })}
          onShowAll={async () => {
            if (sizeExceededModalState.nodeToExpand) {
              await graphRef.current?.expandNode(sizeExceededModalState.nodeToExpand, 0);
            } else {
              await getTopLevel({ graphKey: graphKey ?? '' });
            }
          }}
        />
        {selectedTab === 'diagrams' && (
          <>
            {isOpenColorSelecting.diagrams && (
              <ColorSelecting
                palettes={palettes?.filter((palette) => {
                  const paletteTmoId = Number(palette.tmoId);
                  return !Number.isNaN(paletteTmoId) && paletteTmoId === currentTmoId[selectedTab];
                })}
                selectedPaletteId={
                  graphTmosWithColorRanges?.[currentTmoId[selectedTab]]?.colorRanges?.id ?? 0
                }
                tprms={graphTmosWithColorRanges?.[currentTmoId[selectedTab]]?.params}
                handleApplyColors={selectColorRange}
              />
            )}
            <ColorSettings />
          </>
        )}
      </DiagramsStyled>
    );
  },
);
