import { useCallback, useMemo } from 'react';
import { GraphOptions, LayoutConfig, Layout } from '@antv/g6';
import { ANIMATION_DURATION, ANIMATION_EASING } from '6_shared';
import {
  useGetDefaultNodeBuild,
  useGetTableNodeBuild,
  useRegisterTableNodeBehaviour,
} from '../../node';
import { useGetLineNodeEdgeBuild, useGetDefaultEdgeBuild, useGetTableEdgeBuild } from '../../edge';
import { useGetDefaultComboBuild } from '../../combo';
import { useGetDeadEndNodeBuild } from '../../node/deadEndNode';
import { useGetCabelNodeBuild } from '../../node/cabelNode';

type PartlyGraphOptions = Omit<GraphOptions, 'width' | 'container'>;

interface IProps {
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setRightPanelObjectId?: (objectId: number | null) => void;
}

export const useGetGraphConfig = ({ setIsRightPanelOpen, setRightPanelObjectId }: IProps) => {
  const registerTableNodeBuild = useGetTableNodeBuild();
  const registerLineNodeEdgeBuild = useGetLineNodeEdgeBuild();
  const registerTableEdgeBuild = useGetTableEdgeBuild();

  const getDefaultNodeBuild = useGetDefaultNodeBuild();
  const getDefaultEdgeBuild = useGetDefaultEdgeBuild();
  const getDefaultComboBuild = useGetDefaultComboBuild();

  const getDeadEndNodeBuild = useGetDeadEndNodeBuild();
  const getCabelNodeBuild = useGetCabelNodeBuild();

  const registerCustomTableBehaviour = useRegisterTableNodeBehaviour({
    setIsRightPanelOpen,
    setRightPanelObjectId,
  });

  const outerLayout = useMemo(() => {
    // eslint-disable-next-line new-cap
    const layout = new Layout.forceAtlas2({
      kr: 150,
      kg: 0.1,
      tao: 10,
      mode: 'linlog',
      maxIteration: 100,
      preventOverlap: true,
    });
    // layout.init({ nodes: [], edges: [] });
    return layout;
  }, []);

  const outerLayout2 = useMemo(() => {
    // eslint-disable-next-line new-cap
    const layout = new Layout.dagre({
      rankdir: 'LR',
      align: 'UL',
      // controlPoints: true,
      // nodesep: 50,
      // ranksep: () => 100,
    });
    // layout.init({ nodes: [], edges: [] });
    return layout;
  }, []);

  const innerLayout = useMemo(() => {
    // eslint-disable-next-line new-cap
    const layout = new Layout.grid({
      preventOverlap: true,
      preventOverlapPadding: 50,
      condense: false,
      nodeSize: 100,
    });
    // layout.init({ nodes: [], edges: [] });

    return layout;
  }, []);

  const getGraphConfig = useCallback((): PartlyGraphOptions => {
    outerLayout.init({ nodes: [], edges: [] });
    registerTableNodeBuild();
    registerLineNodeEdgeBuild();
    registerTableEdgeBuild();
    getDeadEndNodeBuild();
    getCabelNodeBuild();

    const defaultNodeConfig = getDefaultNodeBuild();
    const defaultEdgeConfig = getDefaultEdgeBuild();
    const defaultComboConfig = getDefaultComboBuild();

    const tableNodeBehaviour = registerCustomTableBehaviour();

    const layout: LayoutConfig = {
      type: 'comboCombined',
      spacing: 200,
      outerLayout: outerLayout2,
      innerLayout,
    };
    return {
      layout,
      minZoom: 0.1,
      maxZoom: 5,
      fitView: true,
      fitViewPadding: 150,
      animate: true,
      animateCfg: {
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
      },
      modes: {
        default: [
          {
            type: 'drag-canvas',
          },
          {
            type: 'zoom-canvas',
            enableOptimize: true,
            optimizeZoom: 0.01,
          },
          { type: 'drag-node', onlyChangeComboSize: true },
          { type: 'drag-combo', onlyChangeComboSize: true },
          'shortcuts-call',
          tableNodeBehaviour,
          { type: 'collapse-expand-combo', relayout: false },
        ],
      },
      defaultNode: defaultNodeConfig,
      defaultEdge: defaultEdgeConfig,
      defaultCombo: defaultComboConfig,
    };
  }, [
    getDeadEndNodeBuild,
    getDefaultComboBuild,
    getDefaultEdgeBuild,
    getDefaultNodeBuild,
    innerLayout,
    outerLayout,
    registerCustomTableBehaviour,
    registerLineNodeEdgeBuild,
    registerTableEdgeBuild,
    registerTableNodeBuild,
  ]);
  return { getGraphConfig, outerLayout, innerLayout };
};
