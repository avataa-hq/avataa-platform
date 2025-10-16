import { transformParamValue } from '5_entites';
import {
  CreateObjectBody,
  IInventoryGeometryModel,
  ILineGeometry,
  TransformDataToCreateParam,
} from '6_shared';

interface IProps {
  values: Record<string, any>;
  objectTmoId?: number | null;
  objectParentID?: number | null;
  objectPointAID?: number | null;
  objectPointBID?: number | null;
  lineGeometry?: ILineGeometry;
  objectGeometry?: IInventoryGeometryModel | null;
  description?: string | null;
}

export const transformDataToCreate = ({
  values,
  objectTmoId,
  objectParentID,
  objectPointAID,
  objectPointBID,
  lineGeometry,
  objectGeometry,
  description,
}: IProps) => {
  const newObjectParams: TransformDataToCreateParam[] = [];

  Object.entries(values).forEach(([key, value]) => {
    const param: TransformDataToCreateParam = {
      value: transformParamValue({ value }),
      tprm_id: +key,
    };
    newObjectParams.push(param);
  });

  const requestBody: any = {};

  if (objectTmoId !== undefined) {
    requestBody.tmo_id = objectTmoId;
    requestBody.params = newObjectParams;
  }

  if (objectParentID) {
    requestBody.p_id = objectParentID;
  }

  if (objectPointAID) {
    requestBody.point_a_id = objectPointAID;
  }

  if (objectPointBID) {
    requestBody.point_b_id = objectPointBID;
  }

  if (lineGeometry) {
    requestBody.geometry = {
      path: {
        type: 'LineString',
        coordinates: lineGeometry.path,
      },
      path_length: lineGeometry.pathLength,
    };
  }

  if (objectGeometry) {
    requestBody.geometry = objectGeometry;
  }

  if (description?.trim() !== '') {
    requestBody.description = description;
  }

  return requestBody as CreateObjectBody;
};
