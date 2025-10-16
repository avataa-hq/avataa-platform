import { CheckImportedTprmTableRow, InventoryParameterTypesModel } from '6_shared';

export const createRowsArray = (
  newTprmNames: string[],
  existingTprms: InventoryParameterTypesModel[],
): CheckImportedTprmTableRow[] => {
  return newTprmNames.map((tprm, i) => {
    const matchingTprm = existingTprms?.find(
      (item) => item.name.toLowerCase() === tprm.toLowerCase(),
    );

    return {
      id: i,
      tprm,
      selectTprm: {
        label: matchingTprm?.name || '',
        value: matchingTprm?.id || '',
      },
    };
  });
};
