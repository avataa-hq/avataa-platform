export const capitalize = (string: string) =>
  string.length > 0 ? string[0].toUpperCase() + string.substring(1) : string;
