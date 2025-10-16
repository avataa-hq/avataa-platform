export const parameterConverters: Record<string, (array: any[]) => any[]> = {
  str: (array: string[]) => array,
  int: (array: any[]) =>
    array.map((item) => {
      const num = Number(item);
      return item === '' || Number.isNaN(num) ? '' : num;
    }),
  float: (array: any[]) =>
    array.map((item) => {
      const num = parseFloat(item);
      return item === '' || Number.isNaN(num) ? '' : num;
    }),
};
