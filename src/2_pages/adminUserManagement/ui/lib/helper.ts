import { IGroup, IRole, IUser, ItemType } from '6_shared';

export const sortList = (filteredList: ItemType[]) => {
  if (!filteredList) return [];

  const sortedList = [...filteredList].sort((a, b) => {
    const nameA = 'username' in a ? (a as IUser).username : (a as IGroup | IRole).name;
    const nameB = 'username' in b ? (b as IUser).username : (b as IGroup | IRole).name;

    if (nameA && nameB) {
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  return sortedList;
};

export const sortedSearchList = (query: string, visibleList: ItemType[]) => {
  const lowerCaseQuery = query.toLowerCase();
  const filteredList = visibleList.filter((item) => {
    const name = 'username' in item ? (item as IUser).username : (item as IGroup | IRole).name;
    return name!.toLowerCase().includes(lowerCaseQuery);
  });

  const sortedFilteredList = sortList(filteredList);

  return sortedFilteredList;
};
