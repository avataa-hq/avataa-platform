// Set column type readable for Data Grid
export const setColumnType = (type: string) => {
  switch (type) {
    case 'str':
      return 'string';
    case 'int':
    case 'float':
      return 'number';
    case 'bool':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'dateTime';
    default:
      return 'string';
  }
};
