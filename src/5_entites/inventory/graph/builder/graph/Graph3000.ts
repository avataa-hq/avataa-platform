import { Graph, ICombo, IEdge, INode, Item } from '@antv/g6';
import {
  AnalysisNode,
  // LineType,
  lineTypes,
  patchObject,
  CustomEdgeConfig,
  CustomNodeConfig,
  Graph3000Config,
  Graph3000Data,
  Graph3000DataEdge,
  Graph3000DataProviders,
  Graph3000EventHandlers,
  DEFAULT_EDGE_TYPE,
  ANIMATION_DURATION,
  COMBO_EDGE_TYPE,
  LINE_NODE_EDGE_TYPE,
  TABLE_NODE_EDGE_TYPE,
  TABLE_NODE_TYPE,
  TableLineNodeEdgeConfig,
} from '6_shared';
import { Subset } from 'types';
import { lineTypeDefinitions } from '6_shared/ui/lineSvg/lib/lineTypeDefinitions';
import { graphDefaultConfig } from './config/defaultConfig';
import { getPopulatedNodes, transformCommutationsToTableNodes } from '../node';
import {
  EdgeController,
  // generateCollapsedEdges,
  getPopulatedEdges,
  processParallelEdges,
} from '../edge';
import { getComboAnchorPoints, getObjectColor } from '../lib';
import { gridPlacement } from './lib';
import { IDefaultGraphLink } from '../../configGraph';

// const getAdaptedEdges = (edges: Graph3000DataEdge[]): CustomEdgeConfig[] => {
//   return edges.map((edge) => {
//     const { key, source, source_object, target, virtual, connection_type } = edge;

//     return {
//       ...edge,
//       id: key,
//       key,
//       source_object,
//       type: DEFAULT_EDGE_TYPE,
//       source,
//       target,
//       isVirtual: virtual,
//       connectionType: connection_type,
//     };
//   });
// };

export class Graph3000 extends Graph {
  private eventHandlers: Graph3000EventHandlers = {};

  private dataProviders: Graph3000DataProviders = {};

  private cachedEdges: Record<string, CustomEdgeConfig[] | undefined> = {};

  private cachedLineNodeEdges: Record<string, CustomEdgeConfig | undefined> = {};

  private cachedCollapsedEdges: Record<string, Record<string, CustomEdgeConfig[] | undefined>> = {};

  private cachedLineTypeNodes: CustomNodeConfig[] = [];

  private config: Graph3000Config = graphDefaultConfig;

  private edgeController: EdgeController | null = null;

  setConfig(cfg: Subset<Graph3000Config>) {
    this.config = patchObject(this.config, cfg);
  }

  getConfig() {
    return this.config;
  }

  setEdgeController(controller: EdgeController) {
    this.edgeController = controller;
  }

  saveLineTypeNodes(nodes: INode[]) {
    const lineNodeModels = nodes
      .map((node) => node.getModel() as CustomNodeConfig)
      .filter((n) => n.geometryType === 'line');

    const newLineTypeNodes: CustomNodeConfig[] = [
      ...new Set([...this.cachedLineTypeNodes, ...lineNodeModels]),
    ];

    this.cachedLineTypeNodes = newLineTypeNodes;
  }

  freezeDataLayout(itemsIds?: string[]) {
    const freezeData = () => {
      this.getNodes().forEach((n) => {
        const { x, y, id } = { ...n.getModel() };
        if (id && !itemsIds?.includes(id)) {
          this.updateItem(n, { x, y });
        } else {
          this.updateItem(n, { x, y, fx: x, fy: y });
        }
      });
      this.getCombos().forEach((c) => {
        const { x, y, id } = { ...c.getModel() };
        if (id && !itemsIds?.includes(id)) {
          this.updateItem(c, { x, y });
        } else {
          this.updateItem(c, { x, y, fx: x, fy: y });
        }
      });
    };

    freezeData();

    // this.layout();

    this.getEdges().forEach((edge) => {
      edge.refresh();
    });
  }

  refreshComboLayout(comboId?: string) {
    if (comboId != null) {
      const combos = this.getCombos();
      const neededCombo = combos.find((c) => c.getID() === comboId);
      if (neededCombo) {
        const nodes = neededCombo.getNodes();
        const comboModel = neededCombo.getModel();

        const { x, y } = { ...comboModel };
        if (x && y) {
          gridPlacement({ center: { x, y }, nodes, graph: this });
        }
      }
      this.getEdges().forEach((edge) => edge.refresh());
    }
  }

  refreshNodesPlacement(
    nodes: INode[] | CustomNodeConfig[],
    center: { x: number; y: number },
    padding?: number,
  ) {
    gridPlacement({ nodes, graph: this, center, additionPadding: padding });
    this.getEdges().forEach((edge) => edge.refresh());
  }

  onError(callback: Graph3000EventHandlers['error']) {
    this.eventHandlers.error = callback;
  }

  setDataProvider<DataProviderName extends keyof Graph3000DataProviders>(
    name: DataProviderName,
    provider: Graph3000DataProviders[DataProviderName],
  ) {
    this.dataProviders[name] = provider;
  }

  // data - набор Edges, Nodes, Commutations и TMO из которых строиться граф.
  readData(data: Graph3000Data, type: 'set' | 'get' = 'set') {
    this.edgeController?.addEdges(data.edges ?? []);

    // Превращение нод
    const populatedNodes = this.populateNodes(data.nodes);
    // Комутации это - это набор портов комутатора. И что бы не плодить ноды - они будут превращены в таблицу.
    // Комутации приходять если у дочерних обектов не имеет глобальную уникальность.
    const tableNodes = transformCommutationsToTableNodes(data.commutation ?? []);

    const populatedEdges = this.populateEdges(data.edges ?? [], [...tableNodes, ...populatedNodes]);

    const styledEdges = this.applyStyleToLinks(populatedEdges);

    const processedEdges = processParallelEdges(styledEdges);
    if (type === 'get') {
      return { nodes: populatedNodes, edges: processedEdges };
    }
    this.read({ nodes: populatedNodes, edges: processedEdges });

    this.transformLineNodesToEdges();
    this.refresh();
    return null;
  }

  applyColorPalette(data?: Subset<Graph3000Config & Record<string, IDefaultGraphLink>>) {
    const hiddenNodes = new Set<string>();
    this.getNodes().forEach((node) => {
      const nodeModel = node.getModel() as CustomNodeConfig;
      const tmo = nodeModel.objectData?.tmo_id
        ? this.config.graphTmosWithColorRanges?.[nodeModel.objectData.tmo_id]
        : undefined;
      const color = tmo ? getObjectColor(nodeModel.objectData?.params ?? [], tmo) : undefined;
      const tmoId = nodeModel.objectData?.tmo_id;

      // Legend show/hide logic
      const visible =
        tmoId && data ? data.graphTmosWithColorRanges?.[tmoId.toString()]?.visible ?? true : true;

      const isColorVisible =
        (tmoId &&
          data &&
          color &&
          data.graphTmosWithColorRanges?.[tmoId.toString()]?.colorRanges?.ranges?.colors?.find(
            (col) => col?.hex === color,
          )?.visible) ??
        true;

      if (!visible || !isColorVisible) {
        hiddenNodes.add(nodeModel.id);
        node.hide();
        node.getEdges().forEach((edge) => {
          edge.hide();
        });
      } else {
        node.show();
        node.getEdges().forEach((edge) => {
          edge.show();
        });
      }
      // Legend show/hide logic

      if (color != null && visible != null) {
        node.update({ color, visible });
      }

      node.update({ color: !visible ? 'transparent' : color, visible });
      node.refresh();
    });

    this.getEdges().forEach((edge) => {
      const edgeModel = edge.getModel() as CustomEdgeConfig;

      // Legend show/hide logic
      const sourceId = edgeModel.source;
      const targetId = edgeModel.target;

      const edgeVisible =
        !hiddenNodes.has(sourceId) &&
        !hiddenNodes.has(targetId) &&
        (data?.graphTmosWithColorRanges?.[edgeModel.connectionType]?.visible ?? true);

      if (!edgeVisible) {
        edge.hide();
      } else {
        edge.show();
      }
      // Legend show/hide logic

      if (edgeModel.connectionType !== 'line-node') return;

      const tmo = edgeModel.objectData?.tmo_id
        ? this.config.graphTmosWithColorRanges?.[edgeModel.objectData.tmo_id]
        : undefined;

      const color = tmo ? getObjectColor(edgeModel.objectData?.params ?? [], tmo) : undefined;

      // Legend show/hide logic
      const tmoId = edgeModel.objectData?.tmo_id;
      const visible =
        tmoId && data ? data.graphTmosWithColorRanges?.[tmoId.toString()]?.visible ?? true : true;

      if (!visible) {
        edge.hide();
      } else {
        edge.show();
      }
      // Legend show/hide logic

      edge.update({ color });
      edge.refresh();
    });
  }

  async expandNode(nodeToExpand: INode, maxNodes?: number) {
    try {
      if (!this.dataProviders['node:expand'])
        throw new Error('Missing `node:expand` data provider');

      // Это копия заэкспанденой ноды, она будет удалена
      const expandedNodeModel = { ...nodeToExpand.getModel() } as CustomNodeConfig;

      // Ноды которые приходят в с сервера, и проходят трансформацию, они будут добавлены вместо той которую расскарывают
      // И если их больше чем одна, то они будут добавлены в Combo (группу)
      const newGraphData = await this.dataProviders['node:expand']?.(nodeToExpand, maxNodes);
      const populatedNodes = this.populateNodes(newGraphData.nodes);

      // Сюда приходят ноды, которые были трансформироываны в таблицу, и добовляютсья к общему пулу нод, которые будет добавлен в граф.
      const tableNodes = transformCommutationsToTableNodes(
        newGraphData.commutation ?? [],
        expandedNodeModel.id,
      );

      // Общий пул нод, который будет добавлен в граф;
      const nodesToAdd = [...populatedNodes, ...tableNodes];
      // Удаление эджей которые были связаны с нодой которая была экспандена и которая будет удалена
      // Так же возвращаем удаленные эджи что бы была возможность их вернуть при необходимости.
      const removedEdges = this.removeNodeEdges(nodeToExpand);

      // удаление ноды которая была расскарыта
      this.removeItem(expandedNodeModel.id);

      // Массив будет заполнен добавлеными нодами
      const addedNode: Item[] = [];
      // Массив будет заполнен ID добавленых нод, что бы передать их в combo;
      const addedNodeIds: string[] = [];

      // Добавляем ноды в графф, берем начальные координаты из экспанденой ноды и если нод меньше чем 2,
      // то добавляем их в комбо в котором была экспанденая нода
      nodesToAdd.forEach((node, i, arr) => {
        const addedItem = this.addItem('node', {
          ...node,
          x: expandedNodeModel?.x,
          y: expandedNodeModel?.y,
          ...(arr.length < 2 && {
            comboId: expandedNodeModel.comboId,
            virtualComboId: expandedNodeModel.id,
          }),
        });
        if (typeof addedItem !== 'boolean') {
          addedNode.push(addedItem);
          addedNodeIds.push(node.id);
        }
      });

      // Проверка на то что бы все ноды не являлись линиям,
      // ибо дальше они добовляються в combo, и данный тип не подходить для группировкаи в combo
      const arrayIsLines = nodesToAdd.filter((n) => n.geometryType !== 'line');

      // Если элементов больше чем 1 и они не линии, то мы создаться комбо на основе ноды которая была заэкспандена. В него помещаем эти элементы
      if (nodesToAdd.length > 1 && arrayIsLines.length > 1) {
        this.createCombo(
          {
            id: expandedNodeModel.id as string,
            label: expandedNodeModel.name,
            parentId: expandedNodeModel.comboId,
            x: expandedNodeModel.x,
            y: expandedNodeModel.y,
            anchorPoints: getComboAnchorPoints(),
          },
          addedNodeIds,
          true,
        );
      }

      // Запуск алгоритм расстановки рассположения для добавленых нод. Центр взят из ноды которая экспандится
      this.refreshNodesPlacement(addedNode as INode[], {
        x: expandedNodeModel.x!,
        y: expandedNodeModel.y!,
      });

      // Теперь необходимо получить edges что бы соеденить ими ноды
      // Получаем эджи с сервера и прогоняем их чер функцию трансформации
      const populatedEdges = this.populateEdges(newGraphData.edges);
      const styledEdges = this.applyStyleToLinks(populatedEdges);
      const processedEdges = processParallelEdges(styledEdges);

      // Добавляем эджи в графф
      this.addEdgesToGraph(processedEdges as CustomEdgeConfig[]);

      removedEdges?.forEach((edge) => {
        if (!edge.isVirtual) {
          this.addEdgesToGraph([{ ...edge, type: COMBO_EDGE_TYPE as any }]);
        } else if (edge.connectionType === 'collapsed') {
          edge.childEdges?.forEach((childEdge) => {
            if (!childEdge.isVirtual) {
              this.addEdgesToGraph([{ ...childEdge, type: COMBO_EDGE_TYPE as any }]);
            }
          });
        }
      });
      this.cachedEdges[expandedNodeModel.id] = removedEdges;
      this.transformLineNodesToEdges();
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error, { reason: 'node:expand', data: nodeToExpand });
    }
  }

  async expandLineNodeEdge(edgeToExpand: IEdge) {
    try {
      if (!this.dataProviders['node:expand'])
        throw new Error('Missing `node:expand` data provider');

      // Creating a shallow copy of the edge model, because it will be removed
      const expandedEdgeModel = { ...(edgeToExpand.getModel() as CustomEdgeConfig) };

      if (expandedEdgeModel?.connectionType !== 'line-node') return;

      const sourceNode = edgeToExpand.getSource() as INode;
      const targetNode = edgeToExpand.getTarget() as INode;
      const sourceNodeModel = sourceNode.getModel() as CustomNodeConfig;
      const targetNodeModel = targetNode.getModel() as CustomNodeConfig;

      const newGraphData = await this.dataProviders['node:expand']?.(edgeToExpand);

      const populatedNodes = this.populateNodes(newGraphData.nodes);
      const tableNodes = transformCommutationsToTableNodes(
        newGraphData.commutation ?? [],
        expandedEdgeModel.id,
      );
      const nodesToAdd = [...populatedNodes, ...tableNodes];

      this.removeItem(expandedEdgeModel.key);

      nodesToAdd.forEach((node) => {
        this.addItem('node', {
          ...node,
          x: expandedEdgeModel?.startPoint?.x,
          y: expandedEdgeModel?.startPoint?.y,
          comboId: expandedEdgeModel.comboId,
          virtualComboId: expandedEdgeModel.id,
        });
      });
      this.refreshNodesPlacement(nodesToAdd, {
        x: expandedEdgeModel?.startPoint?.x!,
        y: expandedEdgeModel?.startPoint?.y!,
      });

      // Edge population must be done after the nodes are added to the graph. Otherwise, some source or target nodes may not be found.
      const populatedEdges = this.populateEdges(newGraphData.edges);
      const styledEdges = this.applyStyleToLinks(populatedEdges);
      const processedEdges = processParallelEdges(styledEdges);
      this.addEdgesToGraph(processedEdges as CustomEdgeConfig[]);

      const arrayIsLines = nodesToAdd.every((n) => n.geometryType === 'line');

      if (nodesToAdd.length > 1 && !arrayIsLines) {
        this.createCombo(
          {
            id: expandedEdgeModel.id as string,
            label: expandedEdgeModel.label,
            parentId: sourceNodeModel.comboId ?? targetNodeModel.comboId,
            anchorPoints: getComboAnchorPoints(),
          },
          nodesToAdd.map((node) => node.id),
        );
        this.refreshComboLayout(expandedEdgeModel.id as string);
      }

      if (expandedEdgeModel?.id) this.cachedLineNodeEdges[expandedEdgeModel.id] = expandedEdgeModel;
      this.transformLineNodesToEdges();
      this.getEdges().forEach((edge) => {
        edge.refresh();
      });

      // this.layout();
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error, { reason: 'node:expand', data: edgeToExpand });
    }
  }

  async collapseNode(nodeToCollapse: INode) {
    try {
      if (!this.dataProviders['node:collapse'])
        throw new Error('Missing `node:collapse` data provider');

      // Creating a shallow copy of the node model, because it will be removed
      const nodeToCollapseModel = { ...(nodeToCollapse.getModel() as CustomNodeConfig) };
      const collapsedData = await this.dataProviders['node:collapse'](nodeToCollapse);

      let { comboId } = nodeToCollapseModel;
      const { x, y } = nodeToCollapseModel;
      const graphCombos = this.getCombos();
      this.refreshComboLayout(comboId);

      if (collapsedData.collapse_from.length > 1 && comboId) {
        const combo = graphCombos.find((c) => c.getID() === comboId);
        if (combo) {
          this.removeComboChildren(combo);
          comboId = combo.getModel().parentId as string | undefined;
          this.uncombo(combo);
        }
      } else {
        this.removeItem(nodeToCollapseModel.id);
      }

      const cachedLineNodeEdge = this.cachedLineNodeEdges[collapsedData.collapse_to.key];
      const populatedNewNode = this.populateNodes([collapsedData.collapse_to])[0];

      if (cachedLineNodeEdge) {
        this.addEdgesToGraph([cachedLineNodeEdge]);
        // this.addItem('edge', cachedLineNodeEdge);
      } else {
        this.addItem('node', { ...populatedNewNode, comboId, y, x });
      }

      const collapseFromKeys = collapsedData.collapse_from.map((cf) => cf.key);

      this.getEdges()
        ?.toReversed()
        .forEach((edge) => {
          if (collapseFromKeys.includes(edge.getID())) {
            this.removeItem(edge.getID());
          }
        });

      this.cachedEdges[collapsedData.collapse_to.key]?.forEach((edge) => {
        if (!edge.id) return;
        if (this.findById(edge.id)) this.removeItem(edge.id);
        this.addEdgesToGraph([edge]);
        // this.addItem('edge', edge);
      });

      this.transformLineNodesToEdges();
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error, { reason: 'node:collapse', data: nodeToCollapse });
    }
  }

  // async collapseLineNode(nodeToCollapse: INode) {
  //   try {
  //     if (!this.dataProviders['node:collapse'])
  //       throw new Error('Missing `node:collapse` data provider');
  //
  //     // Creating a shallow copy of the node model, because it will be removed
  //     const nodeToCollapseModel = { ...(nodeToCollapse.getModel() as CustomNodeConfig) };
  //     const collapsedData = await this.dataProviders['node:collapse'](nodeToCollapse);
  //
  //     // let { comboId } = nodeToCollapseModel;
  //     // const { x, y } = nodeToCollapseModel;
  //     // const graphCombos = this.getCombos();
  //     // this.refreshComboLayout(comboId);
  //     //
  //     // if (collapsedData.collapse_from.length > 1 && comboId) {
  //     //   const combo = graphCombos.find((c) => c.getID() === comboId);
  //     //   if (combo) {
  //     //     this.removeComboChildren(combo);
  //     //     comboId = combo.getModel().parentId as string | undefined;
  //     //     this.uncombo(combo);
  //     //   }
  //     // } else {
  //     //   this.removeItem(nodeToCollapseModel.id);
  //     // }
  //     //
  //     // const cachedLineNodeEdge = this.cachedLineNodeEdges[collapsedData.collapse_to.key];
  //     // const populatedNewNode = this.populateNodes([collapsedData.collapse_to])[0];
  //     //
  //     // if (cachedLineNodeEdge) {
  //     //   this.addEdgesToGraph([cachedLineNodeEdge]);
  //     // } else {
  //     //   this.addItem('node', { ...populatedNewNode, comboId, y, x });
  //     // }
  //     //
  //     // this.cachedEdges[collapsedData.collapse_to.key]?.forEach((edge) => {
  //     //   if (!edge.id) return;
  //     //   if (this.findById(edge.id)) this.removeItem(edge.id);
  //     //   this.addEdgesToGraph([edge]);
  //     //   // this.addItem('edge', edge);
  //     // });
  //     //
  //     // this.transformLineNodesToEdges();
  //   } catch (error) {
  //     console.error(error);
  //     this.eventHandlers.error?.(error, { reason: 'node:collapse', data: nodeToCollapse });
  //   }
  // }

  async expandEdge(edgeToExpand: IEdge) {
    try {
      if (!this.dataProviders['edge:expand'])
        throw new Error('Missing `edge:expand` data provider');

      // Creating a shallow copy of the edge model, because it will be removed
      const edgeToExpandModel = { ...(edgeToExpand.getModel() as CustomEdgeConfig) };
      if (!edgeToExpandModel?.id) return;

      const placeX = edgeToExpandModel.x ?? this.getViewPortCenterPoint().x;
      const placeY = edgeToExpandModel.y ?? this.getViewPortCenterPoint().y;

      if (edgeToExpandModel.connectionType !== 'geometry_line')
        throw new Error('Edge is not expandable');

      const sourceNode = edgeToExpand.getSource() as INode;
      const sourceNodeModel = sourceNode.getModel() as CustomNodeConfig;
      const sourceKey = edgeToExpandModel.source ?? '';
      const targetKey = edgeToExpandModel.target ?? '';

      const expandedData = await this.dataProviders['edge:expand'](edgeToExpand);

      const populatedNodes = this.populateNodes(expandedData.nodes);

      populatedNodes.forEach((node) => {
        this.addItem('node', {
          ...node,
          ...(sourceNodeModel.comboId && {
            comboId: sourceNodeModel.comboId,
            virtualComboId: sourceNodeModel.id,
            x: placeX,
            y: placeY,
          }),
        });
      });

      const populatedEdges = this.populateEdges(expandedData?.edges ?? []);
      const styledEdges = this.applyStyleToLinks(populatedEdges);
      const processedEdges = processParallelEdges(styledEdges);

      this.addEdgesToGraph(processedEdges as CustomEdgeConfig[]);
      // processedEdges.forEach((edge) => {
      //   this.addItem('edge', edge);
      // });

      this.cachedCollapsedEdges[sourceKey] = {
        ...(this.cachedCollapsedEdges[sourceKey] ?? {}),
        [targetKey]: [
          ...(this.cachedCollapsedEdges[sourceKey]?.[targetKey] ?? []),
          { ...edgeToExpandModel },
        ],
      };

      this.transformLineNodesToEdges();
      this.removeItem(edgeToExpandModel.id);

      if (populatedNodes.length) {
        this.refreshNodesPlacement(populatedNodes, {
          x: placeX,
          y: placeY,
        });
      }
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error, { reason: 'edge:expand', data: edgeToExpand });
    }
  }

  async showNodeNeighbors(node: INode, neighbors?: number) {
    try {
      if (!this.dataProviders['node:getNeighbors'])
        throw new Error('Missing `node:getNeighbors` data provider');

      // Флаг, которые будет сигнализировать об изменении
      let isGraphChanged = false;

      // Модель той нод, соседи которой были получены
      const nodeModel = node.getModel();
      if (!nodeModel?.id) throw new Error('Node model is not defined');

      // Нужны координаты для позиционирования нод. Если их нет у родительской ноды, то берем центр графа
      const placeX = nodeModel.x ?? this.getViewPortCenterPoint().x;
      const placeY = nodeModel.y ?? this.getViewPortCenterPoint().y;

      // Если у текущей ноды все же нет позиции, то что бы она не улетела - то установим из графа
      if (!nodeModel.x && !nodeModel.y) node.updatePosition({ x: placeX, y: placeY });

      // Получаем всех соседей ноды
      const neighborsData = await this.dataProviders['node:getNeighbors'](node, neighbors);

      // Трансформация нод в табличные и обычные
      const populatedNodes = this.populateNodes(neighborsData.nodes);
      const tableNodes = transformCommutationsToTableNodes(
        neighborsData.commutation ?? [],
        nodeModel.id,
      );

      // Все ноды которые будет добавлены в граф
      const nodesToAdd = [...populatedNodes, ...tableNodes];

      // Id всех нод которые будет добавлены в граф
      const currentNodesIds = this.getNodes().map((n) => n.getModel().id);

      // Проверяем, если такой ноды нет, то добавляем ее в граф, добавив ей combo в котором находилась нода и стартовую позицию
      nodesToAdd.forEach((n) => {
        if (!this.findById(n.id)) {
          this.addItem('node', {
            ...n,
            comboId: nodeModel.comboId,
            virtualComboId: nodeModel.virtualComboId,
            x: placeX,
            y: placeY,
          });
          if (!isGraphChanged) isGraphChanged = true;
        }
      });

      //  Получаем эджи от соседей и если их нет в графе то добовляем
      const populatedEdges = this.populateEdges(neighborsData.edges);
      populatedEdges.forEach((edge) => {
        if (!this.isEdgeConnectedToAnotherEdge(edge)) {
          this.addEdgesToGraph([edge]);

          // this.addItem('edge', edge);
          if (!isGraphChanged) isGraphChanged = true;
        }
      });

      // Функция которя превращает обычные ноды в эджи
      this.transformLineNodesToEdges();

      // Обновлению подлежат только те ноды, которых небыло в графе.
      const nodesToUpdate = nodesToAdd.filter((n) => !currentNodesIds?.includes(n.id));

      if (isGraphChanged) {
        // Алгоритм расставноки рассположеня нод если были изменения, так как ноды устанавливаются в одну точку
        this.refreshNodesPlacement(
          [...nodesToUpdate, nodeModel as CustomNodeConfig],
          { x: placeX + 50, y: placeY + 50 },
          nodesToUpdate.length,
        );
      }
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error);
    }
  }

  async showNodeWithNeighbors(nodeToShow: AnalysisNode, neighbors?: number) {
    // Эта штука как раз из поиска
    this.removeAllItems();

    const populatedNode = this.populateNodes([nodeToShow])[0];
    const newNode = this.addItem('node', populatedNode) as INode | boolean;
    if (typeof newNode !== 'boolean') {
      await this.showNodeNeighbors(newNode, neighbors);

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));
      this.fitView(0, undefined, true, { duration: ANIMATION_DURATION });
      //
      // const placeX = newNode?.getModel().x ?? this.getViewPortCenterPoint().x;
      // const placeY = newNode?.getModel().y ?? this.getViewPortCenterPoint().y;
      // //
      // this.refreshNodesPlacement([newNode], { x: placeX + 50, y: placeY + 50 });
    }
  }

  /** Removes all the graph items, including combos */
  removeAllItems() {
    // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
    this.getEdges()
      .toReversed()
      .forEach((edge) => {
        this.removeItem(edge);
      });

    // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
    this.getNodes()
      .toReversed()
      .forEach((node) => {
        this.removeItem(node);
      });

    // The array needs to be reversed, because the `uncombo()` method mutates the array and therefore it's being reindexed
    this.getCombos()
      .toReversed()
      .forEach((combo) => {
        this.uncombo(combo);
      });
  }

  private populateNodes<N extends Graph3000Data['nodes'][number]>(nodes: N[]): CustomNodeConfig[] {
    return getPopulatedNodes(nodes, this.config.graphTmosWithColorRanges);
  }

  private populateEdges(edges: Graph3000DataEdge[], newNodes?: CustomNodeConfig[]) {
    // Все ноды из графа, либо ноды коммутации
    const nodes = newNodes ?? this.getNodes().map((n) => n.getModel() as CustomNodeConfig);

    // Все эджи из графа
    const graphEdges = this.getEdges().map((e) => e.getModel() as CustomEdgeConfig);

    // Разделяем эджи на те которые между нодами и табличные.
    const { tableEdges, defaultEdges } = getPopulatedEdges(edges, nodes);

    const wihoutCollapsEges = [...tableEdges, ...defaultEdges, ...graphEdges];

    const edgeToAdd: CustomEdgeConfig[] = [];
    const edgeIdsToRemove: string[] = [];

    wihoutCollapsEges.forEach((edge) => {
      const sourceObject = this.find('edge', (e) => String(edge.source_object) === e.getID());
      const sourceNode = nodes.find(
        (n) => edge.source === n.key || n.tableRows?.some((tr) => tr.key === edge.source),
      );
      const targetNode = nodes.find(
        (n) => edge.target === n.key || n.tableRows?.some((tr) => tr.key === edge.target),
      );

      if (!sourceNode || !targetNode || sourceNode?.key === targetNode?.key) {
        edgeIdsToRemove.push(edge.id!);
      }
    });

    // lineNodes.forEach((node) => {
    //   const sourceObject = this.find('edge', (e) => {
    //     const model = e.getModel() as CustomEdgeConfig;
    //     return model.source_object?.toString() === node.id;
    //   })?.getModel() as CustomEdgeConfig | undefined;
    //
    //   const pointAEdge = wihoutCollapsEges.find((model) => {
    //     return model.connectionType === 'point_a' && model.source === node.key;
    //   });
    //   const pointBEdge = wihoutCollapsEges.find((model) => {
    //     return model.connectionType === 'point_b' && model.source === node.key;
    //   });
    //
    //   if (pointAEdge && pointBEdge) {
    //     const pointATargetNode = this.find('node', (n) => {
    //       const model = n.getModel() as CustomNodeConfig;
    //       return (
    //         model.key === pointAEdge.target ||
    //         !!model.tableRows?.some((tr) => tr.objectId === node.objectData?.point_a_id)
    //       );
    //     })?.getModel() as CustomNodeConfig;
    //     const pointBTargetNode = this.find('node', (n) => {
    //       const model = n.getModel() as CustomNodeConfig;
    //       return (
    //         model.key === pointBEdge.target ||
    //         !!model.tableRows?.some((tr) => tr.objectId === node.objectData?.point_b_id)
    //       );
    //     })?.getModel() as CustomNodeConfig;
    //
    //     if (pointATargetNode && pointBTargetNode) {
    //       const sourceKey = pointATargetNode?.tableRows?.find(
    //         (tr) => tr.objectId === node.objectData?.point_a_id,
    //       )?.key;
    //
    //       const targetKey = pointBTargetNode?.tableRows?.find(
    //         (tr) => tr.objectId === node.objectData?.point_b_id,
    //       )?.key;
    //
    //       this.removeItem(node.id);
    //       edgeIdsToRemove.push(pointAEdge.id as string);
    //       edgeIdsToRemove.push(pointBEdge.id as string);
    //
    //       const objectName = node.label && node.label !== '' ? node.label : node.name;
    //
    //       if (sourceKey || targetKey) {
    //         const tableEdge: TableLineNodeEdgeConfig = {
    //           id: node.id,
    //           key: node.key,
    //           isVirtual: false,
    //           connectionType: 'line-node',
    //           type: TABLE_NODE_EDGE_TYPE,
    //           cachedType: TABLE_NODE_EDGE_TYPE,
    //           label: (objectName ?? '') as string,
    //           color: node.color,
    //           objectData: node.objectData,
    //           lineDash: node.lineType
    //             ? lineTypeDefinitions[lineTypes[node.lineType] ?? lineTypes.blank].dasharray
    //             : undefined,
    //           source: sourceObject?.source ?? (pointATargetNode.key as string),
    //           target: sourceObject?.target ?? (pointBTargetNode.key as string),
    //           sourceKey,
    //           targetKey,
    //           comboId: node.comboId,
    //           virtualComboId: node.virtualComboId,
    //         };
    //         edgeToAdd.push(tableEdge);
    //       } else {
    //         const objectNamePointAB = node.label && node.label !== '' ? node.label : node.name;
    //         const pointABEdge: CustomEdgeConfig = {
    //           id: node.id,
    //           key: node.key,
    //           isVirtual: false,
    //           connectionType: 'line-node',
    //           type: LINE_NODE_EDGE_TYPE,
    //           cachedType: LINE_NODE_EDGE_TYPE,
    //           label: (objectNamePointAB ?? '') as string,
    //           color: node.color,
    //           objectData: node.objectData,
    //           lineDash: node.lineType
    //             ? lineTypeDefinitions[lineTypes[node.lineType] ?? lineTypes.blank].dasharray
    //             : undefined,
    //           comboId: node.comboId,
    //           virtualComboId: node.virtualComboId,
    //           source: sourceObject?.source ?? (pointATargetNode.key as string),
    //           target: sourceObject?.target ?? (pointBTargetNode.key as string),
    //         };
    //         edgeToAdd.push(pointABEdge);
    //       }
    //
    //       const duplicate = this.find('edge', (n) => {
    //         const model = n.getModel() as CustomEdgeConfig;
    //         return (
    //           (model.source === pointATargetNode.key && model.target === pointBTargetNode.key) ||
    //           (model.source === pointBTargetNode.key && model.target === pointATargetNode.key)
    //         );
    //       });
    //
    //       if (duplicate) edgeIdsToRemove.push(duplicate.getID());
    //     }
    //   }
    // });

    const filteredTableEdges = tableEdges.filter((e) => !edgeIdsToRemove.includes(e.id!));
    const filteredDefaultEdges = defaultEdges.filter((e) => !edgeIdsToRemove.includes(e.id!));
    const filteredOthers = graphEdges.filter((e) => !edgeIdsToRemove.includes(e.id!));

    // Группируем эджи которые находяться на одинаковых позициях в коллапс

    // const collapsedEdges = generateCollapsedEdges(filteredDefaultEdges);
    const all = [...filteredTableEdges, ...filteredDefaultEdges, ...edgeToAdd];

    // Метод, которые расспаралелить эджи, которые они находяться на одинаковых позициях
    processParallelEdges(all, true);

    return all;
  }

  private removeNodeEdges(node: INode) {
    const nodeEdges = node.getEdges();
    // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
    const removedEdgesModels: CustomEdgeConfig[] = nodeEdges.toReversed().map((edge) => {
      const edgeModel = { ...(edge.getModel() as CustomEdgeConfig) };
      this.removeItem(edge);
      return edgeModel;
    });

    return removedEdgesModels;
  }

  private removeComboChildren(combo: ICombo) {
    const children = combo.getChildren();

    // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
    children.nodes.toReversed().forEach((node) => {
      node
        .getEdges()
        .toReversed()
        .forEach((nodeEdge) => {
          this.removeItem(nodeEdge);
        });

      this.removeItem(node);
    });

    // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
    children.combos.toReversed().forEach((childCombo) => {
      childCombo
        .getEdges()
        .toReversed()
        .forEach((comboEdge) => {
          this.removeItem(comboEdge);
        });

      this.removeComboChildren(childCombo);
      this.uncombo(childCombo);
    });
  }

  private applyStyleToLinks(edgeModels: CustomEdgeConfig[]) {
    return edgeModels.map((edgeModel) => {
      const lineStyle =
        this.config.link.style[edgeModel.connectionType] ?? this.config.link.style.default;
      return {
        ...edgeModel,
        labelCfg: {
          autoRotate: true,
        },
        ...((edgeModel.type === DEFAULT_EDGE_TYPE || !edgeModel.type) && {
          style: {
            cursor: 'pointer',
            stroke: lineStyle?.stroke,
            lineWidth: lineStyle?.strokeWidth,
            lineDash: lineStyle?.strokeDasharray,
            lineAppendWidth: 20,
          },
        }),
      };
    });
  }

  private transformLineNodesToEdges() {
    const nodes = this.getNodes();
    this.saveLineTypeNodes(nodes);

    const edgesToAdd: CustomEdgeConfig[] = [];
    const edgeIdsToRemove: string[] = [];
    const nodeIdsToRemove: string[] = [];

    const lineNodes = nodes.filter((n) => {
      const model = n?.getModel() as CustomEdgeConfig;
      return model?.geometryType === 'line';
    });

    lineNodes.forEach((node) => {
      const lineNodeModel = node?.getModel() as CustomNodeConfig;

      const relatedPointAEdge = this.getEdges()?.filter((edge) => {
        const edgeModel = edge.getModel() as CustomEdgeConfig;
        return edgeModel.source === lineNodeModel.key && edgeModel.connectionType === 'point_a';
      });

      const relatedPointBEdge = this.getEdges()?.filter((edge) => {
        const edgeModel = edge.getModel() as CustomEdgeConfig;
        return edgeModel.source === lineNodeModel.key && edgeModel.connectionType === 'point_b';
      });

      if (relatedPointAEdge && relatedPointBEdge) {
        const relatedPointATarget = relatedPointAEdge?.[0]?.getModel() as
          | CustomEdgeConfig
          | undefined;

        let relatedPointBTarget: CustomEdgeConfig | undefined;

        for (let i = 0; i < relatedPointBEdge.length; i++) {
          const currentElem = relatedPointBEdge[i]?.getModel() as CustomEdgeConfig;
          if (currentElem.target !== relatedPointATarget?.target) {
            relatedPointBTarget = currentElem as CustomEdgeConfig | undefined;
            edgeIdsToRemove.push(currentElem.key);
            break;
          }
        }

        if (relatedPointATarget) {
          edgeIdsToRemove.push(relatedPointATarget.key);
        }

        const source = relatedPointATarget?.target;
        const target = relatedPointBTarget?.target;
        const sourceKey = relatedPointATarget?.targetKey;
        const targetKey = relatedPointBTarget?.targetKey;

        const { lineType } = lineNodeModel;
        const lineDash = lineTypeDefinitions[lineTypes[lineType ?? 'blank']].dasharray;

        if (source && target) {
          if (sourceKey || targetKey) {
            const tableEdge: TableLineNodeEdgeConfig = {
              id: lineNodeModel.id,
              key: lineNodeModel.key,
              isVirtual: false,
              connectionType: 'line-node',
              type: TABLE_NODE_EDGE_TYPE,
              cachedType: TABLE_NODE_EDGE_TYPE,
              label: lineNodeModel.name,
              color: lineNodeModel.color,
              objectData: lineNodeModel.objectData,
              lineDash,
              source,
              target,
              sourceKey: sourceKey as string | undefined,
              targetKey: targetKey as string | undefined,
              comboId: lineNodeModel.comboId,
              virtualComboId: lineNodeModel.virtualComboId,
            };
            nodeIdsToRemove.push(lineNodeModel.id);
            edgesToAdd.push(tableEdge);
          }
          if (!sourceKey && !targetKey) {
            const newEdgeModel: CustomEdgeConfig = {
              id: lineNodeModel.id,
              key: lineNodeModel.key,
              isVirtual: false,
              connectionType: 'line-node',
              type: LINE_NODE_EDGE_TYPE,
              cachedType: LINE_NODE_EDGE_TYPE,
              label: lineNodeModel.name,
              color: lineNodeModel.color,
              objectData: lineNodeModel.objectData,
              lineDash,
              source,
              target,
              comboId: lineNodeModel.comboId,
              virtualComboId: lineNodeModel.virtualComboId,
            };
            nodeIdsToRemove.push(lineNodeModel.id);
            edgesToAdd.push(newEdgeModel);
          }
        }
      }
    });

    edgeIdsToRemove.forEach((edgeId) => {
      this.remove(edgeId);
    });
    nodeIdsToRemove.forEach((nodeId) => {
      this.remove(nodeId);
    });

    const newEdges = processParallelEdges(edgesToAdd, true);

    this.addEdgesToGraph(newEdges as CustomEdgeConfig[]);

    this.getEdges().forEach((edge) => {
      const edgeModel = edge.getModel();
      const lineNodeEdge = this.cachedLineTypeNodes.find(
        (item) => item.id === edgeModel.source_object,
      );
      if (lineNodeEdge) {
        const objectName =
          lineNodeEdge.label && lineNodeEdge.label !== '' ? lineNodeEdge.label : lineNodeEdge.name;
        this.updateItem(edge, {
          label: objectName ?? '',
          color: lineNodeEdge.color,
        });
      }
    });
  }

  private isEdgeConnectedToAnotherEdge(edge: CustomEdgeConfig) {
    const edges = this.getEdges();
    return edges?.some((edg) => {
      const edgModel = edg.getModel() as CustomEdgeConfig;
      return edgModel.id === edge.source || edgModel.id === edge.target;
    });
  }

  async expandTableEdge(edgeToExpand: IEdge) {
    try {
      if (!this.dataProviders['edge:expand'])
        throw new Error('Missing `edge:expand` data provider');

      const edgeToExpandModel = edgeToExpand.getModel() as CustomEdgeConfig;
      if (!edgeToExpandModel?.id) return;

      if (edgeToExpandModel.type !== TABLE_NODE_EDGE_TYPE)
        throw new Error('Edge is not of type `table-edge`. Collapsing is not possible.');

      if (edgeToExpand.getStates().includes('expanded')) {
        edgeToExpand.setState('expanded', false);
        return;
      }

      const expandedData = await this.dataProviders['edge:expand'](edgeToExpand);

      if (!expandedData.edges?.length) throw new Error('No expanded edges');

      edgeToExpand.update({ ...edgeToExpandModel, childEdges: expandedData.edges });
      edgeToExpand.setState('expanded', true);
    } catch (error) {
      console.error(error);
      this.eventHandlers.error?.(error, { reason: 'edge:expand', data: edgeToExpand });
    }
  }

  // collapseEdge(edgeToCollapse: IEdge) {
  //   try {
  //     const edgeToCollapseModel = edgeToCollapse.getModel() as CustomEdgeConfig;
  //
  //     if (
  //       edgeToCollapseModel.connectionType === 'line-node' ||
  //       edgeToCollapseModel.connectionType === 'collapsed' ||
  //       edgeToCollapseModel.type === TABLE_NODE_EDGE_TYPE
  //     )
  //       throw new Error('Edge is not collapsible');
  //
  //     const sourceNode = edgeToCollapse.getSource();
  //     const targetNode = edgeToCollapse.getTarget();
  //     const sourceNodeEdges = sourceNode.getEdges();
  //     const targetNodeEdges = targetNode.getEdges();
  //     const commonEdges = sourceNodeEdges.filter((edge) =>
  //       targetNodeEdges?.some((targetEdge) => edge === targetEdge),
  //     );
  //
  //     const newEdges =
  //       this.cachedCollapsedEdges[edgeToCollapseModel.source]?.[edgeToCollapseModel.target] ??
  //       this.cachedCollapsedEdges[edgeToCollapseModel.target]?.[edgeToCollapseModel.source];
  //
  //     // The array needs to be reversed, because the `removeItem()` method mutates the array and therefore it's being reindexed
  //     commonEdges.toReversed().forEach((edge) => {
  //       const edgeModel = edge.getModel() as CustomEdgeConfig;
  //       if (edgeModel.connectionType !== 'collapsed' && edgeModel.id && newEdges?.length)
  //         this.removeItem(edgeModel.id);
  //     });
  //
  //     if (newEdges) {
  //       this.addItems(newEdges.map((edge) => ({ type: 'edge', model: edge })));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     this.eventHandlers.error?.(error);
  //   }
  // }

  collapseTableEdge(edgeToCollapse: IEdge) {
    edgeToCollapse.setState('expanded', false);
  }

  private isEdgeInGraph(edge: CustomEdgeConfig) {
    return this.getEdges().find((edg) => {
      const { id, sourceKey, source, targetKey, target } = edg.getModel();

      if (id === edge.id) return true;
      if (edge.connectionType === 'line-node') return false;

      return (
        ((sourceKey ?? source) === (edge.sourceKey ?? edge.source) &&
          (targetKey ?? target) === (edge.targetKey ?? edge.target)) ||
        ((targetKey ?? target) === (edge.sourceKey ?? edge.source) &&
          (sourceKey ?? source) === (edge.targetKey ?? edge.target))
      );
    });
  }

  private isCorrectTableEdge(edge: CustomEdgeConfig) {
    const sourceNode = this.findById(edge.source)?.getModel() as CustomNodeConfig | undefined;
    const targetNode = this.findById(edge.target)?.getModel() as CustomNodeConfig | undefined;

    if (sourceNode?.type === TABLE_NODE_TYPE && !edge.sourceKey) {
      return false;
    }

    if (targetNode?.type === TABLE_NODE_TYPE && !edge.targetKey) {
      return false;
    }

    return true;
  }

  private isTableEdge(edge: CustomEdgeConfig) {
    const sourceNode = this.findById(edge.source)?.getModel() as CustomNodeConfig | undefined;
    const targetNode = this.findById(edge.target)?.getModel() as CustomNodeConfig | undefined;

    return sourceNode?.type === TABLE_NODE_TYPE || targetNode?.type === TABLE_NODE_TYPE;
  }

  addEdgesToGraph(edges: CustomEdgeConfig[]) {
    edges.forEach((edge) => {
      if (this.isCorrectTableEdge(edge)) {
        if (this.isTableEdge(edge)) {
          this.addItem('edge', { ...edge, type: TABLE_NODE_EDGE_TYPE });
        } else {
          this.addItem('edge', edge);
        }
      }
    });
  }
}
