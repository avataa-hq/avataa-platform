import { ATTRIBUTES_IGNORED_IN_BATCH_IMPORT, ATTRIBUTES_ALLOWED_IN_BATCH_IMPORT } from '6_shared';

export const checkIsTprmColumn = (value: string, isAllowedAttributesIgnored: boolean = true) => {
  let excludedValues = ATTRIBUTES_IGNORED_IN_BATCH_IMPORT;

  if (isAllowedAttributesIgnored) {
    excludedValues = [...excludedValues, ...ATTRIBUTES_ALLOWED_IN_BATCH_IMPORT];
  }

  return !excludedValues.includes(value);
};
