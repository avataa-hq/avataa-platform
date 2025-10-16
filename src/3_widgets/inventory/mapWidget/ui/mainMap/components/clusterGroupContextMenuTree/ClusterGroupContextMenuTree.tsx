import { ILatitudeLongitude, IInventoryObjectModel } from '6_shared';
import Supercluster, { AnyProps } from 'supercluster';
import { memo, useEffect, useState } from 'react';
import { IRenderTree, ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';
import * as SC from '../mapBoxContextMenu/MapBoxContextMenu.styled';
import { PointsTree } from '../pointsTree/PointsTree';
import { SuperClusterChildren } from '../../../../lib/useClusteredData';
import { getSimilarObjectTree } from '../../../../lib/getSimilarObjectTree';

interface IProps {
  position: ILatitudeLongitude;
  supercluster?: Supercluster<IInventoryObjectModel, AnyProps>;
  clusterId?: number | null;
  selectedObject?: ISelectedInventoryObject | null;
  onClick?: (clickedObject: ISelectedInventoryObject) => void;
  whenClose?: () => void;
}

export const ClusterGroupContextMenuTree = memo(
  ({ position, supercluster, clusterId, selectedObject, onClick, whenClose }: IProps) => {
    const [clusterChildrenTree, setClusterChildrenTree] = useState<IRenderTree[]>([]);

    useEffect(() => {
      if (supercluster && clusterId != null) {
        const buildTree = (children: SuperClusterChildren): IInventoryObjectModel[] => {
          const { properties, id } = children;

          // Если это не кластер, то добавляем элемент в результирующий массив
          if (!properties.cluster) {
            // Проверяем, есть ли в properties после similarObjects
            if (properties.similarObjects && properties.similarObjects.length > 0) {
              // Рекурсивно собираем объекты из similarObjects
              const similarObjectsTrees = properties.similarObjects.flatMap(
                (obj: IInventoryObjectModel) =>
                  buildTree({
                    properties: obj,
                    type: 'Feature',
                    id: obj.id,
                    geometry: { type: 'Point', coordinates: [] },
                  }),
              );
              // Добавляем объекты из similarObjects в результирующий массив
              return [properties as IInventoryObjectModel, ...similarObjectsTrees];
            }
            return [properties as IInventoryObjectModel];
          }

          // Если это кластер, то рекурсивно собираем дочерние элементы
          const childrenArray = supercluster?.getChildren(+id!);
          if (childrenArray) {
            const childTrees = childrenArray.flatMap((child) => buildTree(child));
            // Возвращаем массив с дочерними элементами, исключая текущий элемент (кластер)
            return childTrees;
          }
          return [];
        };

        try {
          const clusterChildren = supercluster?.getChildren(clusterId);
          if (clusterChildren) {
            const separatedObjects = clusterChildren.flatMap((child) => buildTree(child));
            const renderTree = getSimilarObjectTree(separatedObjects);
            setClusterChildrenTree(renderTree);
          }
        } catch (error) {
          console.error('Error while building cluster children tree', error);
        }
      }
    }, [clusterId, supercluster]);

    const onTreeItemClick = (clickedObject: IRenderTree) => {
      onClick?.({ object: clickedObject as ISelectedInventoryObject['object'], position });
    };

    return (
      <SC.MapBoxPopupStyled
        offset={[50, 0] as [number, number]}
        anchor="top-left"
        latitude={position.latitude || 0}
        longitude={position.longitude || 0}
        closeButton={false}
        closeOnMove
        onClose={() => {
          whenClose?.();
        }}
      >
        <PointsTree
          childrenTree={clusterChildrenTree}
          selectedObjectId={selectedObject?.object.id}
          onClick={onTreeItemClick}
        />
      </SC.MapBoxPopupStyled>
    );
  },
);
