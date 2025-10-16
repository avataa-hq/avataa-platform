import {
  ConnectivityDiagram,
  defaultGraphLinksConfig,
  EditMultipleParams,
  MultipleEditTitle,
} from '5_entites';
import {
  CustomEdgeConfig,
  CustomNodeConfig,
  DraggableDialog,
  GraphObjectData,
  GraphTmoNode,
  GraphTmosWithColorRanges,
  ObjectByFilters,
  useColorsConfigure,
  useDiagrams,
  useGetPermissions,
  useTabs,
} from '6_shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphLegend } from '5_entites/inventory/graph/ui/legend';
import { Graph3000, useGraphColorRanges } from '5_entites/inventory/graph/builder';
import { ColorSelecting, ColorSettings, RightSidePanel } from '3_widgets';
import { IEdge, INode } from '@antv/g6';
import { IConnectivityDiagramData } from '../../../5_entites/inventory/graph/connectivityDiagram/modal/types';

const ConnectivityDiagramPage = () => {
  const permissions = useGetPermissions('connectivityDiagram');

  const { selectedTab } = useTabs();
  const { currentTmoId, isOpenColorSelecting } = useColorsConfigure();
  const {
    connectivityDiagramSelectedObject,
    connectivityDiagramSelectedEdgeObjects,
    graph,
    currentGraphKey,
    currentTableNodeToConnectivity,
    setConnectivityDiagramSelectedEdgeObjects,
    setConnectivityDiagramSelectedObject,
  } = useDiagrams();

  const [colorRangesConfig, setColorRangesConfig] = useState<GraphTmosWithColorRanges>({});
  const [currentTmoIds, setCurrentTmoIds] = useState<string[]>([]);
  const [isMultipleEditOpen, setIsMultipleEditOpen] = useState(false);
  const [connectivityDiagramOutputData, setConnectivityDiagramOutputData] =
    useState<IConnectivityDiagramData | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const { graphTmosWithColorRanges, palettes, selectColorRange } = useGraphColorRanges(
    currentGraphKey ?? '',
  );

  useEffect(() => {
    if (!currentTableNodeToConnectivity || !graph) return;
    const graph3000 = graph as Graph3000 | undefined;

    const allEdgesFromItemFirst = currentTableNodeToConnectivity.getEdges();

    const nodesFromSource: INode[] = [];
    const nodesFromTarget: INode[] = [];

    allEdgesFromItemFirst?.forEach((edgeItem: IEdge) => {
      const edgeItemModel = edgeItem.getModel() as CustomNodeConfig;
      const source = graph3000?.find('node', (n) => n.getID() === edgeItemModel.source);
      const target = graph3000?.find('node', (n) => n.getID() === edgeItemModel.target);

      if (source && source?.getID() !== currentTableNodeToConnectivity.getID()) {
        nodesFromSource.push(source as INode);
      }

      if (target && target.getID() !== currentTableNodeToConnectivity.getID()) {
        nodesFromTarget.push(target as INode);
      }
    });

    const uniqueItemNodes = [...new Set([...nodesFromSource, ...nodesFromTarget])].map((n) =>
      n.getModel(),
    ) as CustomNodeConfig[];

    const fibers = (currentTableNodeToConnectivity.getEdges() ?? []).map((edg) =>
      edg.getModel(),
    ) as CustomEdgeConfig[];

    setConnectivityDiagramOutputData({
      fibers,
      cableNodes: uniqueItemNodes,
      tableNode: currentTableNodeToConnectivity.getModel() as CustomNodeConfig,
    });
  }, [currentTableNodeToConnectivity, graph]);

  useEffect(() => {
    if (!connectivityDiagramOutputData) return;
    const tmoIdsSet = new Set<string>();
    const { cableNodes, fibers, tableNode } = connectivityDiagramOutputData;

    tmoIdsSet.add(String(tableNode.tmo));

    cableNodes.forEach((cn) => {
      tmoIdsSet.add(String(cn.tmo));
    });
    fibers.forEach((f) => {
      if (f.objectData) {
        tmoIdsSet.add(String((f.objectData as GraphObjectData).tmo_id));
      }
    });

    setCurrentTmoIds(Array.from(tmoIdsSet));
  }, [connectivityDiagramOutputData]);

  useEffect(() => {
    const newColorRanges = Object.entries(graphTmosWithColorRanges ?? {}).reduce(
      (acc, [key, value]) => {
        if (currentTmoIds.includes(key)) acc[key] = value as GraphTmoNode;
        return acc;
      },
      {} as GraphTmosWithColorRanges,
    );

    setColorRangesConfig(newColorRanges);
  }, [graphTmosWithColorRanges, currentTmoIds]);

  const onLegendCheckboxChange = useCallback(
    (tmoId: number | string) => {
      const getVisible = (prevVis: boolean | undefined | null) => {
        if (prevVis == null) return false;
        return !prevVis;
      };
      const copyColorConfig = { ...colorRangesConfig };
      if (typeof tmoId === 'number') {
        copyColorConfig[tmoId] = {
          ...copyColorConfig[tmoId],
          visible: getVisible(copyColorConfig[tmoId].visible),
        };
      }

      if (typeof tmoId === 'string' && !(tmoId in defaultGraphLinksConfig)) {
        const [id, idx] = tmoId.toString().split('_');
        if (!id || !idx || !copyColorConfig[id]) return;
        const currentColors = copyColorConfig[id].colorRanges?.ranges?.colors || [];
        const updatedColors = currentColors.map((color, index) =>
          index === +idx ? { ...color, visible: getVisible(color.visible) } : color,
        );

        // @ts-ignore
        copyColorConfig[id] = {
          ...copyColorConfig[id],
          ...(copyColorConfig[id].colorRanges && {
            colorRanges: {
              ...copyColorConfig[id].colorRanges,
              ranges: {
                ...(copyColorConfig[id].colorRanges?.ranges && {
                  ...copyColorConfig[id].colorRanges?.ranges,
                  colors: updatedColors,
                }),
              },
            },
          }),
        };
      }

      setColorRangesConfig(copyColorConfig);
    },
    [colorRangesConfig],
  );

  const onRightPanelClose = () => {
    setIsRightPanelOpen(false);
    setConnectivityDiagramSelectedObject(null);
  };

  const editMultipleData = useMemo(() => {
    if (connectivityDiagramSelectedEdgeObjects.length === 0) return null;
    const tmoId = connectivityDiagramSelectedEdgeObjects[0].tmo_id;
    const objectIds = connectivityDiagramSelectedEdgeObjects.map(({ id }) => id);
    const allObjects = connectivityDiagramSelectedEdgeObjects as ObjectByFilters[];

    return {
      tmoId,
      objectIds,
      allObjects,
    };
  }, [connectivityDiagramSelectedEdgeObjects]);

  const onEditMultipleClose = () => {
    setIsMultipleEditOpen(false);
    setConnectivityDiagramSelectedEdgeObjects([]);
  };

  return (
    <>
      <ConnectivityDiagram
        data={connectivityDiagramOutputData}
        colorRangesConfig={colorRangesConfig}
        setIsMultipleEditOpen={setIsMultipleEditOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
      />
      <DraggableDialog
        open={isMultipleEditOpen && selectedTab === 'connectivityDiagram'}
        onClose={() => setIsMultipleEditOpen(false)}
        title={<MultipleEditTitle objectsCount={connectivityDiagramSelectedEdgeObjects.length} />}
        minWidth={400}
        minHeight={400}
        width={800}
        height={400}
        draggable={false}
      >
        {editMultipleData && (
          <EditMultipleParams
            tmoId={editMultipleData.tmoId}
            selectedObjectIds={editMultipleData.objectIds}
            onClose={onEditMultipleClose}
            objectsByFilters={editMultipleData.allObjects}
          />
        )}
      </DraggableDialog>
      <GraphLegend
        graphTmosWithColors={colorRangesConfig}
        onCheckBoxChange={onLegendCheckboxChange}
        disableLinks
      />
      {selectedTab === 'connectivityDiagram' && (
        <>
          {isOpenColorSelecting.connectivityDiagram && (
            <ColorSelecting
              palettes={palettes?.filter((palette) => {
                const paletteTmoId = Number(palette.tmoId);
                return !Number.isNaN(paletteTmoId) && paletteTmoId === currentTmoId[selectedTab];
              })}
              selectedPaletteId={
                colorRangesConfig?.[currentTmoId[selectedTab]]?.colorRanges?.id ?? 0
              }
              tprms={colorRangesConfig?.[currentTmoId[selectedTab]]?.params}
              handleApplyColors={selectColorRange}
            />
          )}
          <ColorSettings isLineWithWidth />
          <RightSidePanel
            objectId={connectivityDiagramSelectedObject?.id ?? null}
            isOpen={isRightPanelOpen && selectedTab === 'connectivityDiagram'}
            setIsOpen={onRightPanelClose}
            permissions={permissions}
          />
        </>
      )}
    </>
  );
};

export default ConnectivityDiagramPage;
