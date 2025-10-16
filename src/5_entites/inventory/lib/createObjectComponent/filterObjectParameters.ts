import { IObjectComponentParams } from '6_shared';

export const filterObjectParameters = (params: IObjectComponentParams[], searchQuery: string) => {
  return params.filter((param) =>
    param.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );
};
