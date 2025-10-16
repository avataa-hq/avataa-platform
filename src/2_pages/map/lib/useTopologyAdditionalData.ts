import { useEffect, useState } from 'react';
import { IInventoryObjectModel, searchApiV2 } from '6_shared';
import { ILoadingMarkerModel } from '6_shared/models/inventoryMapWidget/types';

const { useLazyGetChildrenGroupedByTmoQuery, useLazyGetObjectsByCoordsQuery } = searchApiV2;

interface IProps {
  objectsFromHierarchy?: IInventoryObjectModel[];
  additionalSkip?: boolean;
}

export const useTopologyAdditionalData = ({ objectsFromHierarchy, additionalSkip }: IProps) => {
  const [additionalChildObjects, setAdditionalChildObjects] = useState<IInventoryObjectModel[]>([]);
  const [loadingMarker, setLoadingMarker] = useState<ILoadingMarkerModel | null>(null);

  const [getChildGroupTmo] = useLazyGetChildrenGroupedByTmoQuery();
  const [getObjectByCoords] = useLazyGetObjectsByCoordsQuery();

  useEffect(() => {
    if (!objectsFromHierarchy || objectsFromHierarchy.length !== 1) {
      setLoadingMarker(null);
      setAdditionalChildObjects([]);
    }
  }, [objectsFromHierarchy]);

  useEffect(() => {
    if (additionalSkip) return;
    const fetchChildObjects = async (
      parentId: number,
      latitude: number,
      longitude: number,
      depth: number,
      allObjects: any[],
      maxDepth: number,
    ) => {
      if (depth >= maxDepth) return; // Ограничиваем глубину рекурсии

      try {
        // Получаем tmo для parentId
        const tmoData = await getChildGroupTmo(parentId).unwrap();
        const tmoKeys = Object.keys(tmoData ?? {}).map(Number);

        if (tmoKeys.length) {
          // Запрашиваем объекты по координатам и tmo
          const objectsByCoords = await getObjectByCoords({
            latitude_max: latitude,
            latitude_min: latitude,
            longitude_max: longitude,
            longitude_min: longitude,
            limit: 50,
            tmo_ids: tmoKeys,
          }).unwrap();

          if (objectsByCoords && objectsByCoords.objects.length) {
            const correctObjects = objectsByCoords.objects.filter(
              (obj) => obj.latitude && obj.longitude,
            );

            // Добавляем все найденные объекты в итоговый список
            allObjects.push(...correctObjects);

            // Для каждого найденного объекта запускаем рекурсию с увеличением глубины
            for (const obj of correctObjects) {
              // eslint-disable-next-line no-await-in-loop
              await fetchChildObjects(obj.id, latitude, longitude, depth + 1, allObjects, maxDepth);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при запросе данных:', error);
      }
    };

    const getData = async () => {
      if (objectsFromHierarchy && objectsFromHierarchy.length === 1) {
        const [neededObject] = objectsFromHierarchy;
        const parentId = neededObject.id;
        const parentLat = neededObject.latitude;
        const parentLon = neededObject.longitude;

        if (parentLat && parentLon && parentId) {
          setLoadingMarker({
            position: { latitude: parentLat, longitude: parentLon },
            object: { id: parentId },
          }); // Начало загрузки

          // Создаем пустой массив для хранения всех объектов
          const allObjectsList: any[] = [];

          try {
            // Запускаем рекурсивный процесс с лимитом глубины
            await fetchChildObjects(parentId, parentLat, parentLon, 0, allObjectsList, 5); // 5 - это максимальная глубина
            setAdditionalChildObjects(allObjectsList as unknown as IInventoryObjectModel[]); // Сохраняем результат
          } catch (error) {
            console.error('Ошибка при получении данных:', error);
          } finally {
            setLoadingMarker(null); // Конец загрузки
          }
        }
      }
    };

    getData();
  }, [getChildGroupTmo, getObjectByCoords, objectsFromHierarchy, additionalSkip]);

  return { additionalChildObjects, loadingMarker };
};
