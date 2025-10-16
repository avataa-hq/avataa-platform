import { useMemo } from 'react';
import { securityMiddlewareApi } from '6_shared';

export const useGetLowLevelRoles = () => {
  const { data: cachedData } = securityMiddlewareApi.endpoints.getLowLevelRoles.useQueryState();

  const { data: securityLowLevelRoles } = securityMiddlewareApi.useGetLowLevelRolesQuery(
    undefined,
    { skip: !!cachedData },
  );

  const data = useMemo(() => {
    return securityLowLevelRoles || cachedData;
  }, [cachedData, securityLowLevelRoles]);

  return { securityLowLevelRoles: data };
};
