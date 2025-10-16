import {
  ICreateObjectTemplateParametersBody,
  InventoryParameterTypesModel,
  IObjectTemplateParameterModel,
  IUpdateObjectTemplateParameter,
  IUpdateObjectTemplateParametersBody,
} from '6_shared';
import { transformTemplateParamValue } from './transformTemplateParamValue';

export const buildRequestTemplateParams = ({
  formData,
  templateObjectParameters,
  objectTypeParamTypes,
}: {
  formData: Record<string, any>;
  templateObjectParameters: IObjectTemplateParameterModel[] | undefined;
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined;
}) => {
  const { paramsToCreate, paramsToUpdate } = objectTypeParamTypes?.reduce<{
    paramsToCreate: ICreateObjectTemplateParametersBody[];
    paramsToUpdate: IUpdateObjectTemplateParametersBody['parameters'];
  }>(
    (acc, item) => {
      const existingParam = templateObjectParameters?.find(
        (param) => param.parameter_type_id === item.id,
      );
      if (
        existingParam &&
        JSON.stringify(existingParam.value) !== JSON.stringify(formData[item.id])
      ) {
        const newParam: IUpdateObjectTemplateParameter = {
          id: existingParam.id,
          parameter_type_id: item.id,
          value: transformTemplateParamValue(formData[item.id], item.multiple),
          required: item.required,
          constraint: item.constraint || undefined,
        };
        acc.paramsToUpdate.push(newParam);

        return acc;
      }

      if (!formData[item.id] || formData[item.id]?.length === 0 || existingParam) return acc;

      const newParam: ICreateObjectTemplateParametersBody = {
        parameter_type_id: item.id,
        value: transformTemplateParamValue(formData[item.id], item.multiple),
        required: item.required,
        constraint: item.constraint || undefined,
      };
      acc.paramsToCreate.push(newParam);

      return acc;
    },
    { paramsToCreate: [], paramsToUpdate: [] },
  ) || { paramsToCreate: [], paramsToUpdate: [] };

  return { paramsToCreate, paramsToUpdate };
};
