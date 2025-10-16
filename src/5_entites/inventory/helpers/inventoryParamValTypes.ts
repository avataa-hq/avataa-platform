export const inventoryParamValTypes: Record<string, string> = {
  str: 'string',
  int: 'integer',
  float: 'float',
  bool: 'boolean',
  date: 'date',
  datetime: 'date-time',
  mo_link: 'link to object',
  prm_link: 'link to parameter',
  formula: 'formula',
} as const;
