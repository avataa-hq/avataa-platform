import { ICreateObjectTemplateParametersBody, InventoryParameterTypesModel } from '6_shared';
import { transformTemplateParamValue } from './transformTemplateParamValue';

export const buildRequestObjectTemplateParams = ({
  formData,
  objectTypeParamTypes,
}: {
  formData: Record<string, any>;
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined;
}) => {
  return (
    objectTypeParamTypes?.reduce<ICreateObjectTemplateParametersBody[]>((acc, item) => {
      const dataValue = formData[item.id];
      if (!dataValue || dataValue?.length === 0) return acc;

      const newTemplateParam: ICreateObjectTemplateParametersBody = {
        parameter_type_id: item.id,
        value: transformTemplateParamValue(dataValue, item.multiple),
        required: item.required,
        constraint: item.constraint || undefined,
      };
      acc.push(newTemplateParam);
      return acc;
    }, []) || []
  );
};
