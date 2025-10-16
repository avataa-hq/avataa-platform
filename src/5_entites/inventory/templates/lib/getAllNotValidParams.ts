import { INotValidParamWithObjectType, IObjectTemplateObjectModel } from '6_shared';

export const getAllNotValidParams = (
  tree: IObjectTemplateObjectModel[],
  objectTypeHashNames: Record<number, string>,
  objectTypeId?: number,
): INotValidParamWithObjectType[] => {
  return tree.flatMap((item) => {
    const shouldInclude = !objectTypeId || item.object_type_id === objectTypeId;

    const current = shouldInclude
      ? item.parameters
          .filter((p) => !p.valid)
          .map((param) => ({
            param,
            objectTypeName: objectTypeHashNames[item.object_type_id],
            objectTypeId: item.object_type_id,
          }))
      : [];

    const children = item.children.length
      ? getAllNotValidParams(item.children, objectTypeHashNames, objectTypeId)
      : [];

    return [...current, ...children];
  });
};
