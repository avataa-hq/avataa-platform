export type ColorType =
  | 'str'
  | 'int'
  | 'float'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'mo_link'
  | 'prm_link'
  | 'formula'
  | 'number'
  | 'sequence'
  | 'user_link'
  | 'two-way link'
  | 'enum';
export const convertTypeForParamType = (colorType: ColorType) => {
  if (
    colorType === 'int' ||
    colorType === 'number' ||
    colorType === 'float' ||
    colorType === 'sequence'
  )
    return 'number';
  if (colorType === 'bool') return 'boolean';

  return 'string';
};
