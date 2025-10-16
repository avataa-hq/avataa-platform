import { useEffect, useRef } from 'react';
import G6, { Graph } from '@antv/g6';
import { useTheme } from '@mui/material';
import { useTranslate, ActionTypes, CustomNodeConfigParams, CustomNodeConfig } from '6_shared';
import { useRegisterEdge, useRegisterNode } from './lib';
import { ConfigGraphContainer } from './ConfigGraph.styled';
import { ConfigGraphEdgeConfig, ConfigGraphNodeConfig, GraphConfigData } from './model/types';

export interface ConfigGraphProps {
  data: GraphConfigData;
  rootNodeKey: string;
  onSetRootClick: (target: HTMLElement, item: ConfigGraphNodeConfig) => void;
  onToggleNodeClick: (target: HTMLElement, item: ConfigGraphNodeConfig) => void;
  onNodeOptionsClick: (target: HTMLElement, item: ConfigGraphNodeConfig) => void;
  onToggleEdgeClick: (target: HTMLElement, item: ConfigGraphEdgeConfig) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export interface IEdgeContextMenuListData {
  label: string;
  enabled: boolean;
  key: string;
}

export const ConfigGraph = ({
  data,
  rootNodeKey,
  onSetRootClick,
  onToggleNodeClick,
  onToggleEdgeClick,
  onNodeOptionsClick,
  permissions,
}: ConfigGraphProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const registerCustomNode = useRegisterNode();
  const registerCustomEdge = useRegisterEdge();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();

  useEffect(() => {
    if (graphRef.current || !containerRef.current) return () => {};

    const nodeType = registerCustomNode({ nodeLabelKey: 'name', rootNodeKey });
    const edgeType = registerCustomEdge();

    const nodeContextMenu = new G6.Menu({
      getContent(evt) {
        const nodeModel = evt?.item?.getModel() as ConfigGraphNodeConfig;

        return `
        <ul class='config-graph__context-menu'>
        <li class='config-graph__context-menu__row ${
          permissions?.update ?? true ? 'enabled' : ''
        }' role='toggle' >${nodeModel?.enabled ? translate('Disable') : translate('Enable')}</li>
          <li class='config-graph__context-menu__row ${
            permissions?.update ?? true ? 'enabled' : ''
          }' role='set-root'>${translate('Set as start')}</li>
          ${
            !nodeModel?.global_uniqueness
              ? `
              <li class='config-graph__context-menu__row ${
                permissions?.update ?? true ? 'enabled' : ''
              }' role='node-options'>${translate('Options')}</li>
                `
              : ''
          }
        </ul>`;
      },
      handleMenuClick: (target, item) => {
        // Destructuring the object in case it will be mutated
        const nodeModel = { ...(item?.getModel() as ConfigGraphNodeConfig) };

        if (!nodeModel) return;

        if (target.role === 'toggle' && (permissions?.update ?? true))
          onToggleNodeClick(target, nodeModel);
        if (target.role === 'set-root' && (permissions?.update ?? true))
          onSetRootClick(target, nodeModel);
        if (target.role === 'node-options' && (permissions?.update ?? true))
          onNodeOptionsClick(target, nodeModel);
      },
      offsetX: 16 + 10,
      offsetY: 0,
      itemTypes: ['node'],
    });

    const edgeContextMenu = new G6.Menu({
      getContent(evt) {
        const edgeModel = evt?.item?.getModel() as ConfigGraphEdgeConfig;
        const nodeModel = graphRef.current
          ?.getNodes()
          .map((n) => n.getModel()) as CustomNodeConfig[];

        // ['point_tmo_constraint', 'p_id', 'mo_link'];

        const listToRender: IEdgeContextMenuListData[] = [];

        const { source, target } = edgeModel;

        graphRef.current?.getEdges()?.forEach((e) => {
          const model = e.getModel() as ConfigGraphEdgeConfig;
          if (
            (model.source === source && model.target === target) ||
            (model.source === target && model.target === source)
          ) {
            if (model.link_type === 'p_id') {
              listToRender.push({
                label: 'Link to parent',
                enabled: model.enabled,
                key: model.key,
              });
            }
            if (model.link_type === 'point_tmo_constraint') {
              listToRender.push({ label: 'Point a / b', enabled: model.enabled, key: model.key });
            }
            if (model.link_type === 'mo_link') {
              let tprm: CustomNodeConfigParams | null = null;

              const sourceNode = nodeModel?.find((n) => n.key === target);
              if (sourceNode) {
                const { params } = sourceNode;
                const neededTprm = params?.find((p) => p.id === model.tprm_id);
                if (tprm == null && neededTprm) tprm = neededTprm;
              }
              if (tprm) {
                listToRender.push({ label: tprm.name, enabled: model.enabled, key: model.key });
              }
            }
          }
        });

        return `
  <ul class='config-graph__context-menu'>
    ${listToRender
      .map((item) => {
        const dataItem = JSON.stringify(item);
        return `<li
                style="display: flex; align-items: center; gap: 5px"
                class='config-graph__context-menu__row${permissions?.update ? ' enabled' : ''}'
                role='toggle'
                data-item='${dataItem}'
              >
              <b data-item='${dataItem}'>${item.label}</b>
              <input data-item='${dataItem}' ${item.enabled ? 'checked' : ''} type="checkbox">
          </li>`;
      })
      .join('')}
  </ul>`;
      },
      handleMenuClick: (target, item) => {
        const edgeModel = item?.getModel() as ConfigGraphEdgeConfig;
        if (permissions?.update ?? true) onToggleEdgeClick(target, edgeModel);
      },
      offsetX: 16 + 10,
      offsetY: 0,
      itemTypes: ['edge'],
    });

    const width = containerRef.current.scrollWidth;
    const height = containerRef.current.scrollHeight || 500;
    const graph = new G6.Graph({
      container: containerRef.current,
      width,
      height,
      fitView: true,
      plugins: [nodeContextMenu, edgeContextMenu],
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
      layout: {
        type: 'radial',
        maxIteration: 200,
        linkDistance: 120,
        preventOverlap: true,
        nodeSize: 80,
        unitRadius: 300,
        nodeSpacing: 250,
        maxPreventOverlapIteration: 5000,
      },
      animate: true,
      defaultNode: { type: nodeType },
      defaultEdge: {
        type: edgeType,
        labelCfg: {
          autoRotate: true,
          refY: 10,
          style: { cursor: 'pointer', fontFamily: theme.typography.fontFamily },
        },
        style: {
          lineAppendWidth: 20,
          cursor: 'pointer',
        },
      },
    });

    graph?.on('edge:mouseenter', (event: any) => {
      const { item } = event;
      item?.toFront();
      item?.getSource().toFront();
      item?.getTarget().toFront();
    });

    graph?.on('node:mouseenter', ({ item }) => {
      item?.toFront();
    });

    graph.read(data);
    graphRef.current = graph;

    return () => {
      graph.destroy();
      graphRef.current = undefined;
    };
    // The dependency array does not contain `data` to prevent graph from being re-created with each data change. Instead, it's updated with `changeData` method in the next `useEffect`.
  }, [onSetRootClick, onToggleEdgeClick, onToggleNodeClick, translate]);

  useEffect(() => {
    if (!graphRef.current) return;

    registerCustomNode({ nodeLabelKey: 'name', rootNodeKey });

    graphRef.current.changeData(data);
  }, [data, registerCustomEdge, registerCustomNode, rootNodeKey]);

  return <ConfigGraphContainer component="div" ref={containerRef} />;
};
