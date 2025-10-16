import { InventoryParameterTypesModel } from '6_shared';

export const createOptionalParam = (param: InventoryParameterTypesModel) => {
  const newParam = {
    group: param.group,
    label: param.name,
    name: param.id.toString(),
    type: param.val_type,
    multiple: param.multiple,
    constraint: param.constraint,
    isMain: true,
    isDeletable: true,
  };

  return newParam;
};
