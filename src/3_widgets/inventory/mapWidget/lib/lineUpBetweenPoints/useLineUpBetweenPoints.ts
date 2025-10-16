import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdateMultipleParameters } from '5_entites';
import {
  GeoJSONPoint,
  IInventoryObjectModel,
  IPointsEvenlyLineModel,
  IPointsEvenlyModel,
  IPointsEvenlyPointModel,
  MultipleParameterUpdateBody,
  searchApiV2,
} from '6_shared';
import {
  IBuildingPathItem,
  IObjectTypeCustomizationParams,
  ISelectedInventoryObject,
} from '6_shared/models/inventoryMapWidget/types';

const transformPoints = (point: Record<string, any>): IPointsEvenlyPointModel[] => {
  const { id, latitude, longitude, similarObjects } = point;
  if (!id || !latitude || !longitude) return [];

  const correctSimilarObjects =
    similarObjects?.flatMap((so: any) => {
      if (!so?.id || !so?.latitude || !so?.longitude) return [];
      return { id: so.id, latitude: so.latitude, longitude: so.longitude };
    }) ?? [];

  return [{ id, latitude, longitude }, ...correctSimilarObjects];
};

const transformPointsAndLines = (objects: Record<string, any>[]) => {
  const lines: IPointsEvenlyLineModel[] = [];
  const points: Record<string, any>[] = [];

  objects.forEach((obj) => {
    const { geometry_type, id, latitude, longitude, point_a_id, point_b_id, similarObjects } = obj;
    if (geometry_type === 'point' && id && latitude && longitude) {
      points.push({ id, latitude, longitude, similarObjects });
    }
    if (geometry_type === 'line' && id && point_a_id && point_b_id) {
      lines.push({ id, point_a: point_a_id, point_b: point_b_id });
    }
  });

  const correctPoints: IPointsEvenlyPointModel[] = [];

  points.forEach((p) => {
    const { id, latitude, longitude, similarObjects } = p;
    correctPoints.push({ id, latitude, longitude });
    similarObjects?.forEach((so: any) => {
      if (so.id && so.latitude && so.longitude) {
        correctPoints.push({ id: so.id, latitude: so.latitude, longitude: so.longitude });
      }
    });
  });

  return { lines, points: correctPoints };
};

interface IProps {
  selectedObjectList?: Record<string, any>[];
  dataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  objectTypeCustomizationParams: Record<string, IObjectTypeCustomizationParams>;

  refetchData?: () => void;
  onSaveSuccess?: () => void;
}

export const useLineUpBetweenPoints = ({
  selectedObjectList,
  dataPoints,
  objectTypeCustomizationParams,
  refetchData,
  onSaveSuccess,
}: IProps) => {
  const { useLineUpThePointsEvenlyBetweenStartPointAndEndPointMutation } = searchApiV2;

  const [isBuildPathBetweenPointsMode, setIsBuildPathBetweenPointsMode] = useState(false);
  const [isOpenPreviewMap, setIsOpenPreviewMap] = useState(false);

  const [selectedObjectToBuildPath, setSelectedObjectToBuildPath] = useState<Record<string, any>[]>(
    [],
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoadingUpdateCoordinates, setIsLoadingUpdateCoordinates] = useState(false);

  const [buildingPathResult, setBuildingPathResult] = useState<IPointsEvenlyModel[]>([]);
  const [buildPath, { isError, isLoading }] =
    useLineUpThePointsEvenlyBetweenStartPointAndEndPointMutation();

  const { updateMultipleParameters, isMultipleUpdateParamsLoading } = useUpdateMultipleParameters();

  useEffect(() => {
    if (isError) {
      setErrorMessage('Server Error: Something went wrong when building the route');
    }
  }, [isError]);

  useEffect(() => {
    if (!isBuildPathBetweenPointsMode) {
      setSelectedObjectToBuildPath([]);
      setErrorMessage(null);
    }
  }, [isBuildPathBetweenPointsMode]);

  // Enter to edit mode => enter to create path between line mode
  // Show hint about first step "Select start point"
  // Afters selecting start point show hint with "Select end point"
  // If there are two points show hint with "Select range to build paths'

  const onPointClickWhenEditAndBuildPathBetweenPoint = useCallback(
    (clickedObject?: ISelectedInventoryObject) => {
      if (clickedObject && clickedObject.object.geometry_type === 'point') {
        const { id, latitude, longitude, similarObjects } = clickedObject.object;

        // Collecting current points into one array
        const currentPoint = { id, latitude: latitude!, longitude: longitude!, similarObjects };

        setSelectedObjectToBuildPath((prev) => {
          const ids = prev.map((i) => i.id);
          if (ids.includes(currentPoint.id)) {
            return prev.filter((i) => i.id !== currentPoint.id);
          }
          if (prev.length >= 2) {
            const [one, _] = prev;
            return [one, currentPoint];
          }
          return [...prev, currentPoint];
        });
      }
    },
    [],
  );

  const onSaveFromHintClick = async () => {
    if (!selectedObjectToBuildPath.length) {
      setErrorMessage('No objects selected for start point and end point');
      return;
    }
    if (!selectedObjectList?.length) {
      setErrorMessage('There are no selected objects between the start point and the end point');
      return;
    }

    const [firstPoint, secondPoint] = selectedObjectToBuildPath;

    const startPoints: IPointsEvenlyPointModel[] = transformPoints(firstPoint);
    const endPoints: IPointsEvenlyPointModel[] = transformPoints(secondPoint);

    if (!startPoints.length || !endPoints.length) {
      setErrorMessage('No starting point or ending point');
      return;
    }

    const startPointsIds = startPoints.map((item) => item.id);
    const endPointsIds = startPoints.map((item) => item.id);
    const existingIds = [...startPointsIds, ...endPointsIds];
    const { lines, points } = transformPointsAndLines(selectedObjectList);

    const list_of_points = points.filter((point) => !existingIds.includes(point.id));
    const list_of_lines = lines;

    if (!list_of_points.length) {
      setErrorMessage(
        'There are no points in the selected range or the points do not have the required parameters: type = "point" & "id" & "latitude" & "longitude"',
      );
      return;
    }
    if (!list_of_lines.length) {
      setErrorMessage(
        'There are no lines in the selected range, or the lines do not have the required parameters: type = "line" & "id" & "point_a" & "point_b"',
      );
      return;
    }
    const body = {
      start_points: startPoints,
      end_points: endPoints,
      list_of_points,
      list_of_lines,
    };

    const res = await buildPath(body).unwrap();

    if (!res || !res.length) {
      setErrorMessage(
        'It was not possible to construct a path between the selected points. No results from server',
      );
      setBuildingPathResult([]);
    } else {
      setErrorMessage(null);
      setBuildingPathResult(res);
      setIsOpenPreviewMap(true);
    }
  };
  const onCancelFromHintClick = () => {
    setIsBuildPathBetweenPointsMode(false);
  };

  const onSaveFromBuildingPathMap = async (data: IBuildingPathItem) => {
    const { points } = data;

    const body: MultipleParameterUpdateBody[] = points.flatMap((p) => {
      const wholeItem = dataPoints?.features.find((dataItem) => dataItem.id === p.id);
      const customizationItem = objectTypeCustomizationParams[wholeItem?.properties?.tmo_id ?? -1];

      if (!customizationItem) return [];
      const { tmoLat, tmoLng } = customizationItem;

      const latitudeTprmID = tmoLat;
      const longitudeTprmID = tmoLng;

      if (!latitudeTprmID || !longitudeTprmID) return [];

      return {
        object_id: p.id,
        new_values: [
          { tprm_id: latitudeTprmID, new_value: p.latitude },
          { tprm_id: longitudeTprmID, new_value: p.longitude },
        ],
      };
    });

    if (body.length < points.length) {
      setErrorMessage(
        'One or more points are missing required parameters: "tprm id from object type for latitude and longitude"',
      );
    } else {
      await updateMultipleParameters(body, 'The points have been successfully rebuilt');

      setIsOpenPreviewMap(false);
      setIsBuildPathBetweenPointsMode(false);
      setErrorMessage(null);

      setIsLoadingUpdateCoordinates(true);
      setTimeout(() => {
        refetchData?.();
        setIsLoadingUpdateCoordinates(false);
        onSaveSuccess?.();
      }, 5000);
    }
  };
  const onCancelFromBuildingPathMap = () => {
    setIsOpenPreviewMap(false);
  };

  const haveTwoPoints = useMemo(
    () => selectedObjectToBuildPath.length >= 2,
    [selectedObjectToBuildPath],
  );

  return {
    isBuildPathBetweenPointsMode,
    setIsBuildPathBetweenPointsMode,

    selectedObjectToBuildPath,

    onPointClickWhenEditAndBuildPathBetweenPoint,

    haveTwoPoints,
    onSaveFromHintClick,
    onCancelFromHintClick,

    isOpenPreviewMap,
    setIsOpenPreviewMap,

    errorMessage,
    buildingPathResult,

    onSaveFromBuildingPathMap,
    onCancelFromBuildingPathMap,
    isLoadingBuildingPath: isMultipleUpdateParamsLoading || isLoading,
    isLoadingUpdateCoordinates,
  };
};
