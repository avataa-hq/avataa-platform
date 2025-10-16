import { severityApi } from '6_shared';

export const useGetObjectsOfGroup = () => {
  const [getObjectsOfGroup] = severityApi.useLazyGetObjectsOfGroupQuery();

  return { getObjectsOfGroup };
};
