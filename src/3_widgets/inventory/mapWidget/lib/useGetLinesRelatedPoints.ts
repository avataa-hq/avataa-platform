import { getErrorMessage, objectsApi } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

export const useGetLinesRelatedPoints = () => {
  const { useLazyGetObjectsParentsQuery } = objectsApi;
  const [getObjectsParents, { error, isError }] = useLazyGetObjectsParentsQuery();

  useEffect(() => {
    if (error && isError) {
      enqueueSnackbar(`Get objects parents error: ${getErrorMessage(error)}`, { variant: 'error' });
    }
  }, [error, isError]);

  const getLinesRelatedPoints = async (
    linesInPolygon: Record<string, any>[],
    groupedPointsDataById: Record<number | string, any>,
  ) => {
    const linesRelatedPointsA: Record<string, any>[][] = [];
    const linesRelatedPointsB: Record<string, any>[][] = [];
    const missingPointsSet = new Set<number>();

    // Хелпер для добавления точки или в missing
    const addPoint = (pointId: number, collection: Record<string, any>[]) => {
      const point = groupedPointsDataById[pointId];
      if (point) collection.push(point);
      else missingPointsSet.add(pointId);
    };

    // Первый проход: добавляем доступные точки
    linesInPolygon.forEach(({ point_a_id, point_b_id }) => {
      addPoint(point_a_id, linesRelatedPointsA);
      addPoint(point_b_id, linesRelatedPointsB);
    });

    const missingPoints = Array.from(missingPointsSet);
    if (!missingPoints.length) return { linesRelatedPointsA, linesRelatedPointsB };

    // Подтягиваем родителей для недостающих точек
    const parents = await getObjectsParents(missingPoints).unwrap();

    // Хелпер для поиска ближайшего родителя
    const findParentPoint = (pointId: number) => {
      const parentList = parents?.[pointId];
      if (!parentList) return null;
      for (let i = parentList.length - 1; i >= 0; i--) {
        const parentPoint = groupedPointsDataById[parentList[i].id];
        if (parentPoint) return parentPoint;
      }
      return null;
    };

    // Второй проход: подставляем родительские точки
    linesInPolygon.forEach(({ point_a_id, point_b_id }) => {
      const parentA = findParentPoint(point_a_id);
      if (parentA) linesRelatedPointsA.push(parentA);

      const parentB = findParentPoint(point_b_id);
      if (parentB) linesRelatedPointsB.push(parentB);
    });

    return { linesRelatedPointsA, linesRelatedPointsB };
  };

  return { getLinesRelatedPoints };
};
