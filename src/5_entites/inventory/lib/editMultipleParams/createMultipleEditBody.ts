import {
  IInventoryObjectModel,
  IInventoryObjectParamsModel,
  MultipleParameterUpdateBody,
  ObjectByFilters,
  UpdateParameterValuesBody,
} from '6_shared';
import { isValidValue } from './isValidValue';

const isVelueEqual = (existingValue: any, formData: Record<string, any>, tprmId: number) => {
  const underscoreKey = `${tprmId}_${tprmId}`;

  let formValue: any;

  if (underscoreKey in formData) {
    formValue = formData[underscoreKey]?.name;
  } else {
    formValue = formData[tprmId];
  }

  const isEqual = `${existingValue}`.toLowerCase() === `${formValue}`.toLowerCase();

  return isEqual;
};

interface IProps {
  newData: Record<string, any>;
  objectsByFilters?: ObjectByFilters[] | undefined;
  inventoryObjectData?: IInventoryObjectModel | undefined;
  checkValueEquality?: boolean;
}

export const createMultipleEditBody = ({
  newData,
  objectsByFilters,
  inventoryObjectData,
  checkValueEquality = false,
}: IProps): {
  createParamsBody: MultipleParameterUpdateBody[];
  updateParamsBody: MultipleParameterUpdateBody[];
} => {
  const createParamsMap: Record<number, UpdateParameterValuesBody[]> = {};
  const updateParamsMap: Record<number, UpdateParameterValuesBody[]> = {};

  const inventoryObjectParams =
    inventoryObjectData?.params?.reduce((acc, param) => {
      acc[param.tprm_id.toString()] = param;
      return acc;
    }, {} as Record<string, IInventoryObjectParamsModel>) || {};

  if (inventoryObjectData && inventoryObjectParams) {
    const createParams: UpdateParameterValuesBody[] = [];
    const updateParams: UpdateParameterValuesBody[] = [];

    Object.entries(newData).forEach(([key, value]) => {
      const param = {
        tprm_id: Number(key),
        new_value: typeof value === 'string' ? value.trim() : value,
        version: inventoryObjectParams?.[key]?.version,
      };

      if (!inventoryObjectParams[key] && isValidValue(value)) {
        createParams.push(param);
      }

      if (
        inventoryObjectParams[key]?.value &&
        isValidValue(value) &&
        (checkValueEquality
          ? !isVelueEqual(inventoryObjectParams[key]?.value, newData, Number(key))
          : true)
      ) {
        updateParams.push(param);
      }
    });

    if (createParams.length) {
      if (!createParamsMap[inventoryObjectData.id]) {
        createParamsMap[inventoryObjectData.id] = [];
      }
      createParamsMap[inventoryObjectData.id].push(...createParams);
    }

    if (updateParams.length) {
      if (!updateParamsMap[inventoryObjectData.id]) {
        updateParamsMap[inventoryObjectData.id] = [];
      }
      updateParamsMap[inventoryObjectData.id].push(...updateParams);
    }
  }

  if (objectsByFilters && !inventoryObjectData) {
    objectsByFilters.forEach((object) => {
      const createParams: UpdateParameterValuesBody[] = [];
      const updateParams: UpdateParameterValuesBody[] = [];

      Object.entries(newData).forEach(([key, value]) => {
        const param = {
          tprm_id: Number(key),
          new_value: typeof value === 'string' ? value.trim() : value,
          version: inventoryObjectParams?.[key]?.version,
        };

        const objectParamValue = object.parameters?.[key];

        if (!object.parameters?.hasOwnProperty(key) && isValidValue(value)) {
          createParams.push(param);
        }

        if (
          object.parameters?.hasOwnProperty(key) &&
          isValidValue(value) &&
          (checkValueEquality
            ? `${value}`.toLowerCase() !== `${objectParamValue}`.toLowerCase()
            : true)
          // (checkValueEquality
          //   ? `${value}`.toLowerCase() !== `${objectParamValue}`.toLowerCase()
          //   : true)
        ) {
          updateParams.push(param);
        }
      });

      if (createParams.length) {
        if (!createParamsMap[object.id]) {
          createParamsMap[object.id] = [];
        }
        createParamsMap[object.id].push(...createParams);
      }

      if (updateParams.length) {
        if (!updateParamsMap[object.id]) {
          updateParamsMap[object.id] = [];
        }
        updateParamsMap[object.id].push(...updateParams);
      }
    });
  }

  const createParamsBody = Object.entries(createParamsMap).map(([object_id, new_values]) => ({
    object_id: Number(object_id),
    new_values,
  }));

  const updateParamsBody = Object.entries(updateParamsMap).map(([object_id, new_values]) => ({
    object_id: Number(object_id),
    new_values,
  }));

  return { createParamsBody, updateParamsBody };
};
