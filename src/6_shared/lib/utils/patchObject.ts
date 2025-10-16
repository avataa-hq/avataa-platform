/**
 *
 * @param obj1 Original object
 * @param obj2 Patch object
 * @returns
 */
export function patchObject<T1 extends Record<string, any>, T2 extends Record<string, any>>(
  obj1: T1,
  obj2: T2,
): T2 & T1 {
  const patchedObj = { ...obj1 };

  Object.entries(obj2).forEach(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      patchedObj[key as keyof T1] = patchObject(obj1[key] ?? {}, value);
    } else {
      patchedObj[key as keyof T1] = value;
    }
  });

  return patchedObj as T1 & T2;
}
