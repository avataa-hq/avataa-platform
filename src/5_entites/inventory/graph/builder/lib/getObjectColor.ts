import { GraphTmosWithColorRanges } from '6_shared';
import { rgbToHex } from '@mui/system';

export const getObjectColor = (
  tprms: { tprm_id: number; value: any; [key: string]: any }[],
  tmoWithColorRanges: GraphTmosWithColorRanges[string],
): string | undefined => {
  const coloredTprm = tprms.find(
    (tprm) => tprm.tprm_id.toString() === tmoWithColorRanges.colorRanges?.tprmId,
  );
  const valType = tmoWithColorRanges.colorRanges?.valType;

  let output;

  if (valType === 'string' || valType === 'str' || valType === 'mo_link' || valType === 'enum') {
    // TODO It's needs to change
    const range = tmoWithColorRanges.colorRanges?.ranges?.colors?.find((color) =>
      coloredTprm?.value
        ?.toString()
        ?.toLowerCase()
        ?.trim()
        ?.includes(color?.name?.toLowerCase()?.trim()),
    );

    output = range?.hex ?? tmoWithColorRanges?.colorRanges?.ranges?.defaultColor;
  }

  tmoWithColorRanges.colorRanges?.ranges?.values?.forEach((value, index) => {
    if (coloredTprm?.value <= value) {
      const color = tmoWithColorRanges.colorRanges?.ranges?.colors?.[index];
      output = Array.isArray(color)
        ? rgbToHex(`rgb(${color[0]}, ${color[1]}, ${color[2]})`)
        : color?.hex;
    }
  });

  return output;
};
