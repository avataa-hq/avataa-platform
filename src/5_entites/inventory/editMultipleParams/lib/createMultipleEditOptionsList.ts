import { InventoryParameterTypesModel } from '6_shared';

export const createMultipleEditOptionsList = (data: InventoryParameterTypesModel[]) => {
  const newOptions = data
    .map((param) => {
      if (param.val_type === 'prm_link') {
        return {
          ...param,
          tprm_id: param.id,
          constraint:
            param.constraint && param.constraint.includes(':')
              ? param.constraint.split(':')[1]
              : param.constraint,
          value: '',
        };
      }
      return {
        ...param,
        tprm_id: param.id,
        value: '',
      };
    })
    .filter((p) => p.val_type !== 'formula');

  return newOptions;
};
