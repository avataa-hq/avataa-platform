import { IInventoryGeometryModel, ObjectByFilters, UpdateMultipleObjectsBody } from '6_shared';

interface IProps {
  objectsData: ObjectByFilters[] | undefined;
  objectIds: number[];
  objectParentID?: number | null;
  objectPointAID?: number | null;
  objectPointBID?: number | null;
  active?: boolean;
  objectGeometry?: IInventoryGeometryModel | null;
  description?: string | null;
}

export const createMultipleUpdateBody = ({
  objectsData,
  objectIds,
  active,
  objectGeometry,
  objectParentID,
  objectPointAID,
  objectPointBID,
  description,
}: IProps) => {
  if (!objectsData || objectIds.length === 0) return null;

  const body = objectIds.reduce<UpdateMultipleObjectsBody[]>((acc, id) => {
    const currentObject = objectsData.find((object) => object.id === id);
    if (!currentObject) return acc;

    const {
      version,
      p_id,
      point_a_id,
      point_b_id,
      geometry,
      description: currentDescription,
    } = currentObject;

    const properties: Partial<UpdateMultipleObjectsBody['data_for_update']> = {
      ...(((objectParentID !== undefined && objectParentID !== p_id && p_id !== 0) ||
        (objectParentID != null && p_id === 0)) && { p_id: objectParentID }),

      ...(((objectPointAID !== undefined && objectPointAID !== point_a_id && point_a_id !== 0) ||
        (objectPointAID != null && point_a_id === 0)) && { point_a_id: objectPointAID }),

      ...(((objectPointBID !== undefined && objectPointBID !== point_b_id && point_b_id !== 0) ||
        (objectPointBID != null && point_b_id === 0)) && { point_b_id: objectPointBID }),

      ...(active !== undefined && { active }),

      ...(objectGeometry &&
        JSON.stringify(objectGeometry) !== JSON.stringify(geometry) && {
          geometry: objectGeometry,
        }),

      ...(description !== undefined && currentDescription !== description && { description }),
    };

    const dataForUpdate = {
      version,
      ...properties,
    };

    if (Object.keys(dataForUpdate).length !== 1) {
      acc.push({
        object_id: id,
        data_for_update: dataForUpdate,
      });
    }

    return acc;
  }, []);

  if (!body.length) return null;

  return body;
};
