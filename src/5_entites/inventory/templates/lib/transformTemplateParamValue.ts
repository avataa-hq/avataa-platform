export const transformTemplateParamValue = (value: any, multiple: boolean) => {
  if (multiple) {
    return JSON.stringify(value);
  }
  return `${value}`;
};
