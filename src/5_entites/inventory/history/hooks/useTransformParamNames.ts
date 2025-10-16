import { InventoryParameterTypesModel } from '6_shared';

interface IParamNames {
  [key: number]: string;
}

interface IProps {
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined;
}

export const useTransformParamNames = ({ objectTypeParamTypes }: IProps) => {
  const paramNames = objectTypeParamTypes?.reduce((acc, param) => {
    acc[param.id] = param.name;

    return acc;
  }, {} as IParamNames);

  return { paramNames };
};
