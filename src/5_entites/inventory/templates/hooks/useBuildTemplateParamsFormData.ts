import { enqueueSnackbar } from 'notistack';
import {
  getErrorMessage,
  InventoryParameterTypesModel,
  IObjectTemplateObjectModel,
  parameterTypesApi,
} from '6_shared';
import { ITemplateParamsFromData } from '../model';

const parseParamValue = (val: string | string[]) => {
  if (typeof val === 'string') {
    try {
      return val.trim().startsWith('[') ? JSON.parse(val) : val;
    } catch {
      return val;
    }
  }
  return val;
};

const isEmpty = (val: unknown) => val == null || (typeof val === 'string' && val.trim() === '');

export const useBuildTemplateParamsFormData = () => {
  const { useLazyGetObjectTypeParamTypesQuery } = parameterTypesApi;
  const [getObjectTypeParamTypes] = useLazyGetObjectTypeParamTypesQuery();

  const buildTemplateParamsFormData = async (
    tree: IObjectTemplateObjectModel[],
  ): Promise<{
    templateParamsTree: (ITemplateParamsFromData & {
      children?: ITemplateParamsFromData[];
    })[];
    withRequiredParamsLength: number;
  }> => {
    try {
      const processNode = async (
        treeTemplate: IObjectTemplateObjectModel,
      ): Promise<ITemplateParamsFromData & { children?: ITemplateParamsFromData[] }> => {
        let currentObjectTypeParamTypes: InventoryParameterTypesModel[] = [];
        try {
          currentObjectTypeParamTypes = await getObjectTypeParamTypes({
            id: treeTemplate.object_type_id,
          }).unwrap();
        } catch (error) {
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        }

        const allRequiredParamTypes =
          currentObjectTypeParamTypes?.filter((item) => item.required || item.primary) ?? [];

        const params: Record<string, any> = Object.fromEntries(
          (treeTemplate.parameters ?? []).map((item) => [
            item.parameter_type_id,
            parseParamValue(item.value),
          ]),
        );

        const hasEmptyRequiredParams = allRequiredParamTypes.some((param) =>
          isEmpty(params[param.id]),
        );

        let children: (ITemplateParamsFromData & { children?: ITemplateParamsFromData[] })[] = [];
        if (treeTemplate.children?.length) {
          children = await Promise.all(treeTemplate.children.map(processNode));
        }

        return {
          objectTypeId: treeTemplate.object_type_id,
          params,
          hasEmptyRequiredParams,
          children,
        };
      };

      const templateParamsTree = await Promise.all(tree.map(processNode));

      const countEmptyRequired = (
        nodes: (ITemplateParamsFromData & { children?: ITemplateParamsFromData[] })[],
      ): number =>
        nodes.reduce(
          (acc, node) =>
            acc +
            (node.hasEmptyRequiredParams ? 1 : 0) +
            (node.children ? countEmptyRequired(node.children) : 0),
          0,
        );

      const withRequiredParamsLength = countEmptyRequired(templateParamsTree);

      return { templateParamsTree, withRequiredParamsLength };
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      return { templateParamsTree: [], withRequiredParamsLength: 0 };
    }
  };

  // const buildTemplateParamsFormData = async (
  //   tree: IObjectTemplateObjectModel[],
  // ): Promise<{
  //   templateParamsFormData: ITemplateParamsFromData[];
  //   withRequiredParamsLength: number;
  // }> => {
  //   try {
  //     const results = await Promise.all(
  //       tree.map(async (treeTemplate) => {
  //         let currentObjectTypeParamTypes: InventoryParameterTypesModel[] = [];
  //         try {
  //           currentObjectTypeParamTypes = await getObjectTypeParamTypes({
  //             id: treeTemplate.object_type_id,
  //           }).unwrap();
  //         } catch (error) {
  //           enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  //         }

  //         const allRequiredParamTypes =
  //           currentObjectTypeParamTypes?.filter((item) => item.required || item.primary) ?? [];

  //         const params: Record<string, any> = Object.fromEntries(
  //           (treeTemplate.parameters ?? []).map((item) => [
  //             item.parameter_type_id,
  //             parseParamValue(item.value),
  //           ]),
  //         );

  //         const hasEmptyRequiredParams = allRequiredParamTypes.some((param) =>
  //           isEmpty(params[param.id]),
  //         );

  //         let children: ITemplateParamsFromData[] = [];
  //         if (treeTemplate.children?.length) {
  //           const { templateParamsFormData: childrenData } = await buildTemplateParamsFormData(
  //             treeTemplate.children,
  //           );
  //           children = childrenData;
  //         }

  //         return [
  //           {
  //             objectTypeId: treeTemplate.object_type_id,
  //             params,
  //             hasEmptyRequiredParams,
  //           },
  //           ...children,
  //         ];
  //       }),
  //     );

  //     const templateParamsFormData = results.flat();
  //     const withRequiredParamsLength = templateParamsFormData.filter(
  //       (item) => item.hasEmptyRequiredParams,
  //     ).length;

  //     return { templateParamsFormData, withRequiredParamsLength };
  //   } catch (error) {
  //     enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  //     return { templateParamsFormData: [], withRequiredParamsLength: 0 };
  //   }
  // };

  return { buildTemplateParamsFormData };
};
