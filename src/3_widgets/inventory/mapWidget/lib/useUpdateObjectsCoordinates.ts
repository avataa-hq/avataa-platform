import { useEffect, useMemo, useState } from 'react';
import { useUpdateMultipleParameters } from '5_entites';
import {
  objectsApi,
  useTranslate,
  objectTypesApi,
  IInventoryObjectModel,
  MultipleParameterUpdateBody,
  useObjectCRUD,
} from '6_shared';
import { LngLat } from 'react-map-gl/dist/esm/types';
import { enqueueSnackbar } from 'notistack';
import {
  IObjectTypeCustomizationParams,
  ISelectedInventoryObject,
} from '6_shared/models/inventoryMapWidget/types';
import type { Point } from './mainMap/Ruler';
import { IMuiIconsType } from '../../../../components/MUIIconLibrary/MUIIconLibrary';

interface IGetObjectAndCoordinatesProps {
  objectId: number;
  newCoordinates: LngLat;
  object: IInventoryObjectModel | undefined;
}

interface IProps {
  editMode: boolean | undefined;
  rulerDistance: number;
  objectTypeCustomizationParams: Record<string, IObjectTypeCustomizationParams>;
  isActiveRulerTool: boolean;
}

export const useUpdateObjectsCoordinates = ({
  editMode,
  rulerDistance,
  objectTypeCustomizationParams,
  isActiveRulerTool,
}: IProps) => {
  const { useLazyGetInheritLocationParentObjectQuery } = objectsApi;
  const { useLazyGetObjectTypeByIdQuery } = objectTypesApi;

  const translate = useTranslate();

  const [objectsToUpdate, setObjectsToUpdate] = useState<MultipleParameterUpdateBody[]>([]);
  const [linePoints, setLinePoints] = useState<Point[]>([]);
  const [updateProgress, setUpdateProgress] = useState<number>(0);
  const [lineSelectedObjects, setLineSelectedObjects] = useState<ISelectedInventoryObject[]>([]);
  const [hasParent, setHasParent] = useState(false);

  const { setLineCoordinates, setGeometryPointsDetails } = useObjectCRUD();

  const { updateMultipleParameters } = useUpdateMultipleParameters();

  const [getParentObject, { isFetching: isFetchingGetParent }] =
    useLazyGetInheritLocationParentObjectQuery();
  const [getTMO, { isFetching: isFetchingGetTmo }] = useLazyGetObjectTypeByIdQuery();

  const isLoadingDataForMoveObject = isFetchingGetParent || isFetchingGetTmo;

  useEffect(() => {
    if (!isActiveRulerTool) setLineSelectedObjects([]);
  }, [isActiveRulerTool]);

  useEffect(() => {
    if (editMode && linePoints.length) {
      const lineCoordinates = linePoints.map((item) => item.coordinates);
      setLineCoordinates({ path: lineCoordinates, pathLength: rulerDistance });
    }
    if (rulerDistance === 0) {
      setLineCoordinates(null);
    }
  }, [editMode, linePoints, rulerDistance]);

  useEffect(() => {
    if (lineSelectedObjects.length === 1) {
      const firstObject = lineSelectedObjects[0];
      setGeometryPointsDetails({
        point_a_details: { objectId: firstObject.object.id, objectName: firstObject.object.name },
        point_b_details: null,
      });
    }
    if (lineSelectedObjects.length > 1) {
      const firstObject = lineSelectedObjects[0];
      const secondObject = lineSelectedObjects[lineSelectedObjects.length - 1];

      setGeometryPointsDetails({
        point_a_details: {
          objectId: firstObject.object.id,
          objectName: firstObject.object.name,
        },
        point_b_details: {
          objectId: secondObject.object.id,
          objectName: secondObject.object.name,
        },
      });
    }
  }, [lineSelectedObjects]);

  useEffect(() => {
    if (!editMode && linePoints.length) {
      setLinePoints([]);
      setLineSelectedObjects([]);
    }
  }, [editMode, linePoints.length]);

  useEffect(() => {
    if (!objectsToUpdate.length) setHasParent(false);
  }, [objectsToUpdate]);

  const getParentTMOParams = async (tmoId: number) => {
    if (!objectTypeCustomizationParams[tmoId]) {
      const neededTmo = await getTMO(tmoId).unwrap();
      if (neededTmo) {
        const newCustParams: Record<string, IObjectTypeCustomizationParams> = {
          [tmoId.toString()]: {
            icon: neededTmo.icon as IMuiIconsType | null,
            tmoName: neededTmo.name,
            tprms: neededTmo.tprms,
            visible: true,
            geometry_type: neededTmo.geometry_type,
            tmoLat: neededTmo.latitude,
            tmoLng: neededTmo.longitude,
            minimize: neededTmo.minimize,
            tmoInheritLocation: neededTmo.inherit_location,
            line_type: neededTmo.line_type,
          },
        };
        return { ...objectTypeCustomizationParams, ...newCustParams };
      }
    }
    return objectTypeCustomizationParams;
  };

  const getLineSelectedObject = (clickedObject: ISelectedInventoryObject) => {
    setLineSelectedObjects((prev) => {
      const isObjectAlreadySelected = prev.some(
        (item) => item.object.id === clickedObject.object.id,
      );
      if (!isObjectAlreadySelected) {
        return [...prev, clickedObject];
      }
      return prev;
    });
  };

  const getObjectAndCoordinatesToUpdate = async ({
    // objectId,
    newCoordinates,
    object,
  }: IGetObjectAndCoordinatesProps) => {
    // const { data: groupedObjectParameters } = await getGroupedObjectParameters({
    //   id: objectId,
    // });

    if (object) {
      // if (groupedObjectParameters) {
      const customizationParams = await getParentTMOParams(object.tmo_id);
      // const latParamTprm = groupedObjectParameters.flatMap((item) =>
      //   item.params.find((p) => p.tprm_id === customizationParams[p.tmo_id].tmoLat),
      // )[0];
      // const longParamTprm = groupedObjectParameters.flatMap((item) =>
      //   item.params.find((p) => p.tprm_id === customizationParams[p.tmo_id].tmoLng),
      // )[0];

      // if (latParamTprm && longParamTprm) {
      //   setObjectsToUpdate((prev) => {
      //     const currentObject = prev.find((item) => item.id === object.id);
      //     const lat = {
      //       value: newCoordinates.lat,
      //       version: latParamTprm.version,
      //       tprm_id: latParamTprm.tprm_id,
      //     };
      //     const long = {
      //       value: newCoordinates.lng,
      //       version: longParamTprm.version,
      //       tprm_id: longParamTprm.tprm_id,
      //     };
      //     const newObject = {
      //       id: object.id,
      //       body: [lat, long],
      //     };
      //     if (currentObject) {
      //       return prev.map((item) => (item.id === object.id ? newObject : item));
      //     }
      //     return [...prev, newObject];
      //   });
      // }

      // }

      const latParamTprm = customizationParams[object.tmo_id].tmoLat;
      const longParamTprm = customizationParams[object.tmo_id].tmoLng;

      if (latParamTprm && longParamTprm) {
        setObjectsToUpdate((prev) => {
          const currentObject = prev.find((item) => item.object_id === object.id);
          const lat = {
            new_value: newCoordinates.lat,
            tprm_id: latParamTprm,
          };
          const long = {
            new_value: newCoordinates.lng,
            tprm_id: longParamTprm,
          };
          const newObject = {
            object_id: object.id,
            new_values: [lat, long],
          };
          if (currentObject) {
            return prev.map((item) => (item.object_id === object.id ? newObject : item));
          }
          return [...prev, newObject];
        });
      }
    }
  };

  const updateObjectsCoordinates = async () => {
    if (objectsToUpdate.length) {
      try {
        await updateMultipleParameters(
          objectsToUpdate,
          translate('Coordinates updated successfully'),
        );
      } catch (error) {
        enqueueSnackbar(translate('Something went wrong, please try once more'), {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        });
      }
      setObjectsToUpdate([]);
    }
  };

  const getParentOrObject = async (object: IInventoryObjectModel) => {
    if (!object.tmoInheritLocation) return object;
    const parent = await getParentObject(object.id).unwrap();
    if (!parent || !parent.parent_mo || !parent.tprm_latitude || !parent.tprm_longitude) {
      return object;
    }

    if (!hasParent) setHasParent(true);
    return { ...parent.parent_mo, tmoLat: parent.tprm_latitude, tmoLng: parent.tprm_longitude };
  };

  const hasParentMovedObject = useMemo(() => {
    return objectsToUpdate.length > 0 && hasParent;
  }, [objectsToUpdate, hasParent]);

  return {
    getObjectAndCoordinatesToUpdate,
    updateObjectsCoordinates,
    updateProgress,
    setUpdateProgress,
    setObjectsToUpdate,
    setLinePoints,
    getLineSelectedObject,
    getParentOrObject,
    isLoadingDataForMoveObject,
    hasParentMovedObject,
  };
};
