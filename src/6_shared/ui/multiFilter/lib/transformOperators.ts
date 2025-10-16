export const transformNumericOperators = (operator: string) => {
  if (operator === '=') return 'equals';
  if (operator === '!=') return 'notEquals';
  if (operator === '<') return 'less';
  if (operator === '>') return 'more';
  if (operator === '>=') return 'moreOrEq';
  if (operator === '<=') return 'lessOrEq';
  if (operator === 'is') return 'equals';
  return operator;
};
