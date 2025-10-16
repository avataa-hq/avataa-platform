import { useUser } from '6_shared';

export const useUserRoles = () => {
  const { tokenParsed } = useUser();
  const roles = tokenParsed?.resource_access?.preflight?.roles || [];

  return {
    isUser: roles.includes('default-roles-avataa'),
    isAdmin: roles.includes('admin'),
    isCustomer: roles.includes('customer'),
  };
};
