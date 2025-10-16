import {
  getCoordinatesFromInventoryObject,
  getInventoryObjectWithCorrectGeometry,
  IInventoryObjectModel,
  objectsApi,
  objectTypesApi,
  useInventoryMapWidget,
  useLeftPanelWidget,
} from '6_shared';
import { useEffect, useMemo, useState } from 'react';
import { IObjectTypeCustomizationParams } from '6_shared/models/inventoryMapWidget/types';
import { getCustomizationParamsFromTMOs } from './getCustomizationParamsFromTMOs';
import { useTopologyAdditionalData } from './useTopologyAdditionalData';

const { useGetObjectsQuery } = objectsApi;
const { useGetObjectTypesQuery } = objectTypesApi;

interface IProps {
  objectTypeCustomizationParams?: Record<string, IObjectTypeCustomizationParams>;
  objectsFromHierarchy?: IInventoryObjectModel[];
  anotherObjectsIds?: number[];
  additionalSkip?: boolean;
  childrenDataAdditionalSkip?: boolean;
}
export const useTopologyData = ({
  objectTypeCustomizationParams,
  anotherObjectsIds,
  objectsFromHierarchy,
  additionalSkip,
  childrenDataAdditionalSkip,
}: IProps) => {
  const [currentTmoIds, setCurrentTmoIds] = useState<number[]>([]);

  const [typologyData, setTypologyData] = useState<IInventoryObjectModel[]>([]);
  const [anotherObjectsData, setAnotherObjectsData] = useState<IInventoryObjectModel[]>([]);

  const { setTempCoordinates } = useInventoryMapWidget();

  const { setObjectTypeCustomizationParams, setSelectedObjectTypesIds } = useLeftPanelWidget();

  const { additionalChildObjects, loadingMarker } = useTopologyAdditionalData({
    objectsFromHierarchy,
    additionalSkip: childrenDataAdditionalSkip,
  });

  const generalData = useMemo(
    () => [...typologyData, ...anotherObjectsData, ...additionalChildObjects],
    [typologyData, anotherObjectsData, additionalChildObjects],
  );

  const { data: anotherObjects } = useGetObjectsQuery(
    { obj_id: anotherObjectsIds ?? [], limit: 9999 },
    {
      skip: !anotherObjectsIds || !anotherObjectsIds.length || additionalSkip,
    },
  );

  useEffect(() => {
    if (!objectsFromHierarchy || additionalSkip) {
      setTypologyData([]);
      return;
    }
    const transformed = objectsFromHierarchy.map(getInventoryObjectWithCorrectGeometry);
    setTypologyData(transformed as IInventoryObjectModel[]);

    transformed.forEach((obj) => {
      const pos = getCoordinatesFromInventoryObject(obj as IInventoryObjectModel);
      if (pos) {
        const zoom = obj.latitude && obj.longitude ? 16 : 10;
        setTempCoordinates({ ...pos, zoom });
      }
    });
  }, [objectsFromHierarchy, additionalSkip]);

  useEffect(() => {
    if (!anotherObjects) {
      setAnotherObjectsData([]);
      return;
    }
    const transformed = anotherObjects.apiResponse.map(getInventoryObjectWithCorrectGeometry);
    setAnotherObjectsData(transformed as IInventoryObjectModel[]);

    if (transformed.length > 0) {
      const [first] = transformed;
      const pos = getCoordinatesFromInventoryObject(first as IInventoryObjectModel);
      if (pos) {
        const zoom = first.latitude && first.longitude ? 16 : 10;
        setTempCoordinates({ ...pos, zoom, speed: 2 });
      }
    }
  }, [anotherObjects]);

  const { data: tmoListData = [] } = useGetObjectTypesQuery(
    {
      object_types_ids: currentTmoIds,
      with_tprms: true,
    },
    { skip: !currentTmoIds.length || additionalSkip },
  );

  useEffect(() => {
    if (!tmoListData.length || additionalSkip) return;
    const customizationData = getCustomizationParamsFromTMOs({
      currentCustomizationParams: objectTypeCustomizationParams,
      tmoListData,
    });
    setObjectTypeCustomizationParams(customizationData);
  }, [tmoListData, additionalSkip]);

  useEffect(() => {
    if (additionalSkip) return;
    const uniqTmoIdsList = Array.from(new Set(generalData.map((d) => d.tmo_id)));
    setCurrentTmoIds(uniqTmoIdsList);
    setSelectedObjectTypesIds(uniqTmoIdsList);
  }, [generalData, additionalSkip]);

  return {
    hierarchyInventoryObjects: generalData,
    loadingMarker,
  };
};
