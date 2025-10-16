import { useCallback, useMemo, useRef } from 'react';
import { GraphTmosWithColorRanges, IInventoryObjectModel, useDiagrams, useTabs } from '6_shared';
import { ConnectivityDiagramStyled, HintContainer } from './ConnectivityDiagram.styled';
import { useGetDiagram } from '../builder/diagram/useGetDiagram';
import { useTryToBuild } from './useTryToBuild';
import { IConnectivityDiagramData } from '../modal/types';
import { SelectedObjectWindow } from './selectedObjectWindow/SelectedObjectWindow';

interface IProps {
  data: IConnectivityDiagramData | null;
  colorRangesConfig: GraphTmosWithColorRanges;
  setIsMultipleEditOpen?: (isOpen: boolean) => void;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export const ConnectivityDiagram = ({
  data,
  colorRangesConfig,
  setIsMultipleEditOpen,
  setIsRightPanelOpen,
}: IProps) => {
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    connectivityDiagramSelectedObject,
    setConnectivityDiagramSelectedEdgeObjects,
    setConnectivityDiagramSelectedObject,
  } = useDiagrams();
  const { selectedTab } = useTabs();

  const { connectivityDiagramRef } = useGetDiagram({ containerRef: diagramContainerRef });

  const { selectedObjects, setSelectedObjects } = useTryToBuild({
    graphRef: connectivityDiagramRef,
    data,
    graphContainerRef: diagramContainerRef,
    colorRangesConfig,
    selectedObject: connectivityDiagramSelectedObject,
  });

  const onObjectListItemClick = useCallback(
    (item: IInventoryObjectModel) => {
      if (item.id === connectivityDiagramSelectedObject?.id) {
        setConnectivityDiagramSelectedObject(null);
        setIsRightPanelOpen?.(false);
      } else {
        setConnectivityDiagramSelectedObject(item);
        setIsRightPanelOpen?.(true);
      }
    },
    [connectivityDiagramSelectedObject?.id, setIsRightPanelOpen],
  );
  const objectListCancel = useCallback(() => {
    setConnectivityDiagramSelectedObject(null);
    setSelectedObjects([]);
    setIsRightPanelOpen?.(false);
  }, [setIsRightPanelOpen, setSelectedObjects]);

  const onObjectsListMultipleEdit = useCallback(
    (items: IInventoryObjectModel[]) => {
      setConnectivityDiagramSelectedEdgeObjects(items);
      setIsMultipleEditOpen?.(true);
    },
    [setIsMultipleEditOpen],
  );

  const isOpenSelectedObjectDialog = useMemo(() => {
    return selectedObjects.length > 0 && selectedTab === 'connectivityDiagram';
  }, [selectedObjects, selectedTab]);

  return (
    <ConnectivityDiagramStyled>
      <div style={{ width: '100%', height: '100%' }} ref={diagramContainerRef} />
      <HintContainer>
        <div>
          <span style={{ color: 'rgba(0,0,0,0.35)' }}>Click: </span>
          <span style={{ color: 'rgb(0,0,0)' }}>select edge</span>
        </div>
        <div>
          <span style={{ color: 'rgba(0,0,0,0.35)' }}>Right click: </span>
          <span style={{ color: 'rgb(0,0,0)' }}>deselect edge</span>
        </div>
      </HintContainer>

      {isOpenSelectedObjectDialog && (
        <SelectedObjectWindow
          selectedObjects={selectedObjects}
          selectedObject={connectivityDiagramSelectedObject}
          onItemClick={onObjectListItemClick}
          onCancel={objectListCancel}
          onMultipleEdit={onObjectsListMultipleEdit}
          isOpen={isOpenSelectedObjectDialog}
        />
      )}
      {/* <DraggableDialog */}
      {/*  width={400} */}
      {/*  height={500} */}
      {/*  minWidth={200} */}
      {/*  minHeight={200} */}
      {/*  open={selectedObjects.length > 0 && selectedTab === 'connectivityDiagram'} */}
      {/*  onClose={objectListCancel} */}
      {/*  title="Selected objects from edges" */}
      {/* > */}

      {/* </DraggableDialog> */}
    </ConnectivityDiagramStyled>
  );
};
