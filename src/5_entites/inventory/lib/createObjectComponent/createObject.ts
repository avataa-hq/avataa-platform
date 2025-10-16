import { transformDataToCreate } from '5_entites';
import {
  CreateObjectBody,
  IInventoryGeometryModel,
  IInventoryObjectModel,
  ILineGeometry,
} from '6_shared';

interface IProps {
  objectTmoId: number | null;
  values: Record<string, any>;
  createObjectFn: (body: CreateObjectBody) => Promise<IInventoryObjectModel>;
  objectParentID?: number | null;
  objectPointAID?: number | null;
  objectPointBID?: number | null;
  lineGeometry?: ILineGeometry;
  objectGeometry?: IInventoryGeometryModel | null;
  description?: string | null;
}

export const createObject = async ({
  values,
  objectTmoId,
  createObjectFn,
  objectParentID,
  objectPointAID,
  objectPointBID,
  lineGeometry,
  objectGeometry,
  description,
}: IProps) => {
  const newObjectRequestBody = transformDataToCreate({
    values,
    objectParentID,
    objectPointAID,
    objectPointBID,
    lineGeometry,
    objectTmoId,
    objectGeometry,
    description,
  });

  const res = await createObjectFn(newObjectRequestBody);
  return res;
};
