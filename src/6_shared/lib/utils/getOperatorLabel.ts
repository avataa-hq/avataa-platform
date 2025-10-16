const operatorLabels: Record<string, string> = {
  eq: '=',
  ne: '!=',
  gt: '>',
  ge: '>=',
  lt: '<',
  le: '<=',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  is_any_of: 'is any of',
  is_not_any_of: 'is not any of',
  contains: 'contains',
  not_contains: 'does not contain',
  starts_with: 'starts with',
  ends_with: 'ends with',
};

export const getOperatorLabel = (operator: string) => {
  return operatorLabels[operator] ?? operator;
};
