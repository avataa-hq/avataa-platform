import { ColorRange, GraphTmosWithColorRanges, IInventoryObjectParamsModel } from '6_shared';

export const getObjectColorParameters = (
  tprms: IInventoryObjectParamsModel[],
  tmoWithColorRanges?: GraphTmosWithColorRanges[string] | null,
) => {
  let resultColorParameters: ColorRange['colors'][number] | null = null;
  if (tmoWithColorRanges) {
    const { colorRanges } = tmoWithColorRanges;

    if (colorRanges) {
      const coloredTprm = tprms.find((tprm) => {
        return tprm.tprm_id.toString() === colorRanges.tprmId;
      });

      if (coloredTprm) {
        const { valType, ranges } = colorRanges;

        if (valType === 'string' || valType === 'str' || valType === 'mo_link') {
          const strColorParameters = ranges?.colors?.find((color) => {
            return String(coloredTprm?.value)?.toLowerCase()?.includes(color.name?.toLowerCase());
          });

          if (strColorParameters) resultColorParameters = strColorParameters;
        }

        ranges?.values?.forEach((value, index) => {
          if (typeof coloredTprm.value === 'number' && coloredTprm.value <= value) {
            const colorParameters = ranges?.colors?.[index];
            if (colorParameters) resultColorParameters = colorParameters;
          }
        });
      }
    }
  }

  return resultColorParameters;
};
