import { Anchor } from 'mapbox-gl';
import { IInventoryObjectModel } from '6_shared';
import { useMemo } from 'react';
import { IRenderTree, ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';
import * as SC from '../mapBoxContextMenu/MapBoxContextMenu.styled';
import { getSimilarObjectTree } from '../../../../lib/getSimilarObjectTree';
import { PointsTree } from '../pointsTree/PointsTree';

interface IProps {
  position: ISelectedInventoryObject['position'];
  options?: IInventoryObjectModel[];
  onMenuClick?: (clickedObject: ISelectedInventoryObject | null) => void;
  anchor?: Anchor;
  selectedObject?: ISelectedInventoryObject | null;
  closeOnMove?: boolean;
  onClose?: () => void;
}

export const MarkerSimilarObjectsContextMenu = ({
  position,
  options,
  onMenuClick,
  anchor = 'top-left',
  selectedObject,
  closeOnMove = true,
  onClose,
}: IProps) => {
  const treeData = useMemo<IRenderTree[] | null>(() => {
    if (!options) return null;
    return getSimilarObjectTree(options);
  }, [options]);

  const onTreeItemClick = (renderItem: IRenderTree) => {
    onMenuClick?.({ object: renderItem as IInventoryObjectModel, position });
  };

  return (
    <SC.MapBoxPopupStyled
      offset={[50, 0] as [number, number]}
      anchor={anchor}
      latitude={position.latitude || 0}
      longitude={position.longitude || 0}
      closeButton={false}
      closeOnMove={closeOnMove}
      onClose={onClose}
    >
      <PointsTree
        childrenTree={treeData}
        selectedObjectId={selectedObject?.object.id}
        onClick={onTreeItemClick}
      />
    </SC.MapBoxPopupStyled>
  );
};
