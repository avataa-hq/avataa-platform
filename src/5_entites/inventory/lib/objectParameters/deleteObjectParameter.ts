import { DeleteParameterRequestParams, IInventoryObjectModel } from '6_shared';

interface IProps {
  deleteObjectParameterFn: (body: DeleteParameterRequestParams) => Promise<void>;
  inventoryObjectData: IInventoryObjectModel | undefined;
  objectId: number | null;
  paramTypeId: number | null;
  fieldValue?: any;
}

export const deleteObjectParameter = async ({
  deleteObjectParameterFn,
  inventoryObjectData,
  objectId,
  paramTypeId,
  fieldValue,
}: IProps) => {
  const isParamInObject = inventoryObjectData?.params?.some(
    (param) => param.tprm_id === paramTypeId,
  );

  if (objectId !== null && paramTypeId !== null && isParamInObject && fieldValue !== '') {
    try {
      await deleteObjectParameterFn({ object_id: objectId, param_type_id: paramTypeId });
    } catch (error) {
      throw new Error(error);
    }
  }
};
