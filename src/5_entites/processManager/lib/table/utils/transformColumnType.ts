export const transformColumnType = (type: string) => {
  switch (type) {
    case 'int':
    case 'float':
      return 'number';
    case 'bool':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'dateTime';
    case 'enum':
      return 'enum';
    default:
      return 'string';
  }
};
