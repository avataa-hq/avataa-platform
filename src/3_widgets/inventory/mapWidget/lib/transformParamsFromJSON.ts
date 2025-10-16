export const transformPropsFromJSON = (obj: Record<string, any>, params: string[]) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (params.includes(key) && typeof value === 'string') acc[key] = JSON.parse(value);
    else acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
};
