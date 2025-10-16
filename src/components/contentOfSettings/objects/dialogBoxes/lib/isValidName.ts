export const isValidParameterName = (errorName: boolean, errorNameAlreadyExist: boolean) => {
  if (errorName) return 'Incorrect name';
  if (errorNameAlreadyExist) return 'Name already exists';
  return ' ';
};
