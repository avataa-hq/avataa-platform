import { modulesApi } from '../../modules';

export const useGetAllModules = () => {
  const { useGetAllModulesQuery } = modulesApi;

  const { data, isFetching, isError } = useGetAllModulesQuery();

  return { data, isFetching, isError };
};
