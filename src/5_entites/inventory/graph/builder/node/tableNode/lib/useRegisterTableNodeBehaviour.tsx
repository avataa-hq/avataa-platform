import { useCallback } from 'react';
import { Graph, registerBehavior, IG6GraphEvent, IEdge, INode } from '@antv/g6';

import { useAppDispatch } from 'hooks/reduxHooks';
// eslint-disable-next-line import/no-cycle
import {
  CustomNodeConfig,
  TABLE_NODE_HEADER_HEIGHT,
  TABLE_NODE_HEIGHT,
  TABLE_NODE_ITEM_HEIGHT,
  TABLE_NODE_ITEMS_PER_PAGE,
  TABLE_NODE_TYPE,
  TABLE_NODE_WIDTH,
  useAppNavigate,
  useDiagrams,
} from '6_shared';
import type { Graph3000 } from '../../../graph';
import { MainModuleListE } from '../../../../../../../config/mainModulesConfig';

const isInBBox = (
  point: { x: number; y: number },
  bbox: { minX: number; minY: number; maxX: number; maxY: number },
) => {
  const { x, y } = point;
  const { minX, minY, maxX, maxY } = bbox;

  return x < maxX && x > minX && y > minY && y < maxY;
};

interface IProps {
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setRightPanelObjectId?: (objectId: number | null) => void;
}

export const useRegisterTableNodeBehaviour = ({
  setIsRightPanelOpen,
  setRightPanelObjectId,
}: IProps) => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigate();

  const behaviourName = 'table-node-scroll';

  const { setCurrentTableNodeToConnectivity, setGraph } = useDiagrams();

  const registerTableNodeBehaviour = useCallback(() => {
    registerBehavior(behaviourName, {
      getDefaultCfg() {
        return {
          multiple: true,
        };
      },
      getEvents() {
        return {
          itemHeight: TABLE_NODE_ITEM_HEIGHT.toString(),
          wheel: 'scroll',
          click: 'click',
          contextmenu: 'contextmenu',
        };
      },
      async click(e: IG6GraphEvent) {
        const graph = this.graph as Graph3000;
        const item = e.item as INode;
        if (!item) return;

        const itemModel = item.getModel() as CustomNodeConfig;
        if (!itemModel) return;
        if (itemModel.type !== TABLE_NODE_TYPE) return;

        const { shape } = e;

        const shapeName = shape.get('name');
        const objectId = shape.get('id');

        const expandedHeight =
          TABLE_NODE_HEADER_HEIGHT + TABLE_NODE_ITEM_HEIGHT * (itemModel.tableRows?.length ?? 1);
        const edgesToUpdate = new Set<IEdge>();

        const expandTable = () => {
          graph.updateItem(item, {
            isExpanded: true,
            startIndex: 0,
            size: [TABLE_NODE_WIDTH, expandedHeight],
            height: expandedHeight,
          });
          item.getEdges().forEach((edge) => edgesToUpdate.add(edge));
        };

        if (shapeName === 'switch-button') {
          setCurrentTableNodeToConnectivity(item);
          navigate(MainModuleListE.connectivityDiagram);
          setGraph(graph);
        }
        if (shapeName === 'collapse-button') {
          graph.updateItem(item, {
            isExpanded: false,
            size: [TABLE_NODE_WIDTH, TABLE_NODE_HEIGHT],
            width: TABLE_NODE_WIDTH,
            height: TABLE_NODE_HEIGHT,
          });
          item.getEdges().forEach((edge) => edgesToUpdate.add(edge));
        } else if (shapeName === 'expand-button') {
          expandTable();
        } else if (shapeName?.includes('col_shape')) {
          graph.updateItem(item, { activeRowKey: shape.get('key') });

          const activeElements = graph.findAllByState('node', 'active', () => true);
          activeElements.forEach((node) => {
            const isActive = node.hasState('active');
            if (isActive && item.getID() !== node.getID()) node.setState('active', false);
          });

          item.setState('active', true);

          const itemEdges = item.getEdges();
          itemEdges.forEach((edge) => edge.refresh());

          if (objectId != null) {
            setRightPanelObjectId?.(+objectId);
            setIsRightPanelOpen?.(true);
          }
        }

        edgesToUpdate.forEach((edge) => edge.refresh());
      },
      contextmenu(e: IG6GraphEvent) {
        const graph = this.graph as Graph;
        const item = e.item as INode;
        if (!item) return;

        const itemModel = item.getModel() as CustomNodeConfig;
        if (!itemModel) return;
        if (itemModel.type !== TABLE_NODE_TYPE) return;

        const { shape } = e;

        const shapeName = shape.get('name');
        const objectId = shape.get('id');

        if (shapeName?.includes('col_shape')) {
          graph.updateItem(item, { activeRowKey: shape.get('key') });

          const activeElements = graph.findAllByState('node', 'active', () => true);
          activeElements.forEach((node) => {
            const isActive = node.hasState('active');
            if (isActive && item.getID() !== node.getID()) node.setState('active', false);
          });

          item.setState('active', true);

          const itemEdges = item.getEdges();
          itemEdges.forEach((edge) => edge.refresh());

          if (objectId != null) {
            setRightPanelObjectId?.(+objectId);
            setIsRightPanelOpen?.(true);

            const newRows = itemModel.tableRows?.map((child) => {
              if (child.objectId === +objectId) {
                return { ...child, selected: true };
              }
              return { ...child, selected: false };
            });
            graph.updateItem(item, { tableRows: newRows });
          }
        }
      },
      scroll(e: IG6GraphEvent) {
        e.preventDefault();
        const graph = this.graph as Graph;
        const nodes = graph.getNodes().filter((n) => {
          const bbox = n.getBBox();

          return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox);
        });

        if (nodes.length) e.stopPropagation();

        let y = (e.deltaY as number) || (e.movementY as number);
        if (!y && navigator.userAgent.indexOf('Firefox') > -1) y = (-e.wheelDelta * 125) / 3;

        if (nodes) {
          const edgesToUpdate = new Set<IEdge>();
          nodes.forEach((node) => {
            const {
              tableRows = [],
              startIndex = 0,
              isExpanded = false,
            } = node.getModel() as CustomNodeConfig;
            const itemsPerPage = isExpanded ? tableRows.length : TABLE_NODE_ITEMS_PER_PAGE;

            if (tableRows.length <= itemsPerPage) {
              return;
            }
            const idx = startIndex || 0;
            let newStartIndex = idx + Math.sign(y);
            if (newStartIndex < 0) {
              newStartIndex = 0;
            }
            if (newStartIndex > tableRows.length - itemsPerPage) {
              newStartIndex = tableRows.length - itemsPerPage;
            }

            graph.updateItem(node, {
              startIndex: newStartIndex,
            });
            node.getEdges().forEach((edge) => edgesToUpdate.add(edge));
          });
          // G6 update the related edges when graph.updateItem with a node according to the new properties
          // here you need to update the related edges manually since the new properties { startIndex, startX } for the nodes are custom, and cannot be recognized by G6
          edgesToUpdate.forEach((edge) => edge.refresh());
        }
      },
    });

    return behaviourName;
  }, [dispatch, setIsRightPanelOpen, setRightPanelObjectId]);

  return registerTableNodeBehaviour;
};
