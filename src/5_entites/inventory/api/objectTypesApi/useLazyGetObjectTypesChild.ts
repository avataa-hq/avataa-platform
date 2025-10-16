import { handleApiAction, objectTypesApi } from '6_shared';

export const useLazyGetObjectTypesChild = () => {
  const { useLazyGetObjectTypesChildQuery } = objectTypesApi;

  const [getObjectTypesChild, { isFetching }] = useLazyGetObjectTypesChildQuery();

  const getObjectTypesChildFn = async (parentId: number) => {
    const res = handleApiAction(() => getObjectTypesChild(parentId).unwrap());
    return res;
  };

  return { getObjectTypesChildFn, isFetching };
};
