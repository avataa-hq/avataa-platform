import { useCallback, useRef, useMemo, DragEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { useDrop } from 'react-dnd';

import { JoinFullRounded } from '@mui/icons-material';
import { Box, CommonColors, SvgIconProps, useTheme } from '@mui/material';

import {
  getMouseSvgCoords,
  LinkedNodesDiagram,
  Node,
  useSetState,
  DragHereBox,
  getPaletteColor,
  ThemeColors,
  LinkedNodesDiagramOptions,
  useTranslate,
  PopulatedLink,
  capitalize,
  LinkedNodesDiagramEvents,
  useDataflowDiagram,
  DataflowDiagramNode,
  DataflowDiagramNodeType,
} from '6_shared';

import { NodeMenuPopover } from './NodeMenuPopover';
import { DiagramNode } from './DiagramNode';
import { getRuleManagerIcon as unmemoizedGetRuleManagerIcon } from '../lib';
import { LinkLabel } from './LinkLabel';

export interface DataflowDiagramProps {
  onNewLink?: (
    newLink: PopulatedLink<DataflowDiagramNode>,
    resolve: (newLink: PopulatedLink<DataflowDiagramNode>) => void,
    reject: Function,
  ) => void;
  onNewNode?: (
    newNode: DataflowDiagramNode,
    resolve: (value: DataflowDiagramNode | null) => void,
    reject: Function,
  ) => void;
  onPreviewClick?: (node: DataflowDiagramNode) => void;
  onNodeDelete?: (node: DataflowDiagramNode) => void;
  onNodeDragEnd?: (node: DataflowDiagramNode) => void;
}

interface DataflowDiagramImperativeHandle {
  getNodes: () => DataflowDiagramNode[];
}

const initialPopoverState = {
  nodeMenu: null,
};

type PopoverState = Record<keyof typeof initialPopoverState, HTMLElement | null>;

/**
 * Displays ETA diagram. Accepts dropped ReactDnD elements of type 'ETA_NODE'.
 */
export const DataflowDiagram = ({
  onNewLink,
  onNewNode,
  onPreviewClick,
  onNodeDelete,
  onNodeDragEnd,
}: DataflowDiagramProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDiagramChangedRef = useRef<boolean>(false);

  const {
    nodes,
    links,
    addNewLink,
    addNewNode,
    setIsDiagramChanged,
    setNewLinkPromise,
    setNewNodePromise,
    setSelectedNode,
    updateNode,
  } = useDataflowDiagram();

  const [popoverState, setPopoverState] = useSetState<PopoverState>(initialPopoverState);

  // ----------------------------- DnD -----------------------------
  const [{ newNodeProps }, drop] = useDrop<
    { type: DataflowDiagramNodeType; id?: number },
    any,
    {
      newNodeProps: Omit<DataflowDiagramNode, 'id' | 'x' | 'y'> | null;
    }
  >(() => ({
    accept: 'ETA_NODE',
    collect: (monitor) => {
      const item = monitor.getItem();
      const etaNodeProps = item
        ? {
            ...(item.id && { id: item.id }),
            transform_type: item.type,
            name: item.type,
            connections: { from: [], to: [] },
            status: 'draft' as DataflowDiagramNode['status'],
          }
        : null;
      return {
        newNodeProps: etaNodeProps,
      };
    },
  }));

  // ---------------------- Handling events --------------------------

  const isConnectionValid = useCallback<
    NonNullable<LinkedNodesDiagramOptions<DataflowDiagramNode>['isConnectionValid']>
  >((source, target) => {
    if (
      target.connections.from.length < 2 &&
      source.connections.to.length < 1 &&
      target.transform_type === 'join'
    )
      return true;
    if (target.connections.from.length > 0) return false;
    if (target.transform_type === 'extract') return false;

    return true;
  }, []);

  const handleDiagramChange = useCallback(() => {
    if (!isDiagramChangedRef.current) {
      setIsDiagramChanged(true);
      isDiagramChangedRef.current = true;
    }
  }, []);

  const handleNodeDrop = useCallback(
    async (event: DragEvent<SVGSVGElement>) => {
      if (!svgRef.current || !newNodeProps) return;

      const { x, y } = getMouseSvgCoords(event as any, svgRef.current);

      const node = { id: Math.random(), x, y, ...newNodeProps };

      if (!node.transform_type || !node.name) return;

      try {
        await new Promise((resolve: (value: DataflowDiagramNode | null) => void, reject) => {
          setNewNodePromise({ value: node, resolve, reject });

          if (node.transform_type !== 'extract') {
            addNewNode(null);
          }

          onNewNode?.(node, resolve, reject);
        });
      } catch (error) {
        console.error(error);
      }
    },
    [newNodeProps, onNewNode],
  );

  const handleLinkCreation = useCallback<
    (event: any, link: PopulatedLink<DataflowDiagramNode>) => Promise<void>
  >(
    async (event, link) => {
      if (!isConnectionValid(link.source, link.target) || !Number.isInteger(link.source.id)) return;

      // Check if a link between the same two nodes already exists
      for (let i = 0; i < links.length; i++) {
        if (
          (links?.[i]?.source === link.source.id && links?.[i]?.target === link.target.id) ||
          (links?.[i]?.source === link.target.id && links?.[i]?.target === link.source.id)
        )
          return;
      }

      try {
        await new Promise(
          (resolve: (newLink: PopulatedLink<DataflowDiagramNode>) => void, reject) => {
            setNewLinkPromise({
              value: {
                ...link,
                ...(link.target.transform_type === 'join' &&
                  link.target.connections.from.length < 1 && { root: true }),

                ...(link.target.transform_type === 'join' &&
                  link.target.connections.from.length >= 1 && { root: false }),
              },
              resolve,
              reject,
            });

            if (link.target.transform_type === 'join' && link.target.connections.from.length < 1) {
              addNewLink(null);
            }

            onNewLink?.(link, resolve, reject);
          },
        );

        handleDiagramChange();
      } catch (error) {
        console.error(error);
      }
    },
    [handleDiagramChange, isConnectionValid, links, onNewLink],
  );

  const handleNodeClick = useCallback(
    (e: any, node: DataflowDiagramNode & Node) => {
      setPopoverState({ nodeMenu: e.target });
      setSelectedNode(node);
    },
    [setPopoverState],
  );

  const handleNodeDragEnd = useCallback<
    NonNullable<LinkedNodesDiagramEvents<DataflowDiagramNode>['onNodeDragEnd']>
  >(
    (e, node) => {
      const oldNode = nodes.find((n) => n.id === node.id);
      if (oldNode?.x !== node.x || oldNode?.y !== node.y) {
        updateNode(node);

        onNodeDragEnd?.(node);
      }
    },
    [nodes, onNodeDragEnd],
  );

  const deleteNode = (node: DataflowDiagramNode) => {
    onNodeDelete?.(node);
    if (
      node.connections.from.length > 0 ||
      node.connections.to.length > 0 ||
      node.transform_type === 'extract'
    )
      handleDiagramChange();
  };

  const handlePreviewClick = (node: DataflowDiagramNode) => {
    onPreviewClick?.(node);
  };

  // ---------------------- Customizing UI of the diagram --------------------------

  const getRuleManagerIcon = useCallback((nodeType: DataflowDiagramNodeType) => {
    return unmemoizedGetRuleManagerIcon(nodeType);
  }, []);

  const getNewLinkColor = useCallback(
    (nodeData: DataflowDiagramNode) =>
      getPaletteColor(
        theme,
        getRuleManagerIcon(nodeData.transform_type).iconColor as ThemeColors | keyof CommonColors,
      ),
    [getRuleManagerIcon, theme],
  );

  const getLinkLabel = useCallback(
    (linkData: PopulatedLink<DataflowDiagramNode>) => {
      if (linkData.target.transform_type === 'join')
        return {
          value: renderToString(
            <LinkLabel
              title={translate(linkData.root ? 'Source' : 'Target')}
              theme={theme}
              IconComponent={JoinFullRounded}
              iconStyle={{
                fill: theme.palette.common.purple,
                fontSize: '20px',
              }}
              containerStyle={{
                borderColor: theme.palette.common.purple,
              }}
            />,
          ),
          position: 0,
          offset: 50,
        };

      return undefined;
    },
    [theme, translate],
  );

  const getConnectionPointStrokeColor = useCallback(
    (nodeData: DataflowDiagramNode) => {
      const icon = getRuleManagerIcon(nodeData.transform_type);
      if (icon !== undefined)
        return getPaletteColor(theme, icon.iconColor as ThemeColors | keyof CommonColors);
      return theme.palette.text.primary;
    },
    [getRuleManagerIcon, theme],
  );

  const getCustomNodeHtml = useCallback<
    Exclude<NonNullable<LinkedNodesDiagramOptions<DataflowDiagramNode>['customNodeHtml']>, string>
  >(
    (nodeData) => {
      if (!nodeData.transform_type || !nodeData.name || !nodeData.status) return '';

      const icon = getRuleManagerIcon(nodeData.transform_type);
      return renderToString(
        <DiagramNode
          IconComponent={icon.IconComponent}
          iconColor={icon.iconColor as SvgIconProps['color']}
          theme={theme}
          title={nodeData.name}
          type={nodeData.transform_type}
          status={nodeData.status}
          // @ts-ignore `translate` function has a fallback in case the phrase is not found
          subtitle={translate(capitalize(nodeData.transform_type))}
          badgeValue={nodeData.rows_count}
        />,
      );
    },
    [getRuleManagerIcon, theme, translate],
  );

  const linkDashArray = useMemo(() => [5, 5], []);

  const options: LinkedNodesDiagramOptions<DataflowDiagramNode> = useMemo(
    () => ({
      minZoom: 0.3,
      initialZoom: 0.7,
      connectionPointStrokeColor: getConnectionPointStrokeColor,
      linkColor: theme.palette.text.primary,
      newLinkColor: getNewLinkColor,
      linkOutlineColor: theme.palette.common.lightDodgerBlue,
      linkDashArray,
      linkAnimatedDash: true,
      linkAnimatedCircle: true,
      customNodeHtml: getCustomNodeHtml,
      isConnectionValid,
      getLinkLabel,
    }),
    [
      getConnectionPointStrokeColor,
      getCustomNodeHtml,
      getNewLinkColor,
      isConnectionValid,
      linkDashArray,
      theme.palette.common.lightDodgerBlue,
      theme.palette.text.primary,
      getLinkLabel,
    ],
  );

  return (
    <Box component="div" width="100%" height="100%" position="relative">
      <LinkedNodesDiagram
        overflow="visible"
        style={{ zIndex: 1, maxWidth: '500px' }}
        svgRefs={[drop, svgRef]}
        onDrop={handleNodeDrop}
        links={links}
        nodes={nodes}
        events={{
          onLinkAdd: handleLinkCreation,
          onNodeClick: handleNodeClick,
          onNodeDragEnd: handleNodeDragEnd,
        }}
        options={options}
      />
      <NodeMenuPopover
        open={!!popoverState.nodeMenu}
        anchorEl={popoverState.nodeMenu}
        onClose={() => setPopoverState({ nodeMenu: null })}
        onNodeDelete={(node) => deleteNode(node)}
        onNodeEdit={() => {}}
        onNodePreview={(node) => handlePreviewClick(node)}
      />
      {nodes.length < 1 && <DragHereBox />}
    </Box>
  );
};
