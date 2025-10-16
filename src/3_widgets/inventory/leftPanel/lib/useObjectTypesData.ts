import { useEffect, useState } from 'react';
import { InventoryObjectTypesModel, objectTypesApi, useHierarchy } from '6_shared';

const root: InventoryObjectTypesModel[] = [
  {
    id: 0,
    version: 0,
    name: 'Root',
    p_id: null,
    latitude: null,
    longitude: null,
    status: null,
    icon: null,
    description: null,
    child_count: 0,
    virtual: false,
    global_uniqueness: false,
    primary: [],
    created_by: '',
    modified_by: '',
    creation_date: new Date('2023-06-12T10:18:54.417574'),
    modification_date: new Date('2023-06-12T10:18:54.417574'),
    lifecycle_process_definition: '',
    geometry_type: null,
    severity_id: null,
    materialize: false,
    minimize: false,
    line_type: null,
    points_constraint_by_tmo: null,
  },
];

const filterByName = (query: string, visibleList: InventoryObjectTypesModel[]) => {
  const lowerCaseQuery = query.toLowerCase();
  return visibleList.filter((item) => {
    const { name } = item;
    return name.toLowerCase().includes(lowerCaseQuery);
  });
};

interface IProps {
  searchValue?: string;
}
export const useObjectTypesData = ({ searchValue }: IProps) => {
  const { useGetBreadcrumbsQuery, useGetObjectTypesChildQuery, useGetObjectTypeByIdQuery } =
    objectTypesApi;

  const [childrenItems, setChildrenItems] = useState<InventoryObjectTypesModel[]>([]);
  const [parentItems, setParentItems] = useState<InventoryObjectTypesModel[]>([]);

  const { parentId, searchedObject } = useHierarchy();

  const {
    data: objectTypeList,
    isFetching: isFetchingChildrenItems,
    isError: isErrorChildrenItems,
  } = useGetObjectTypesChildQuery(parentId);

  useEffect(() => {
    if (!objectTypeList) return;
    const children = filterByName(searchValue || '', objectTypeList);
    setChildrenItems(children);
  }, [searchValue, objectTypeList]);

  const {
    data: objectTypeBreadcrumbs,
    isFetching: isFetchingParentItems,
    isError: isErrorParentItems,
  } = useGetBreadcrumbsQuery(parentId, { skip: parentId === 0 });

  const { data: objectTypeFromSearch } = useGetObjectTypeByIdQuery(searchedObject?.tmo_id!, {
    skip: searchedObject == null,
  });

  useEffect(() => {
    if (parentId === 0) setParentItems(root);
    if (parentId !== 0 && objectTypeBreadcrumbs) {
      setParentItems(root.concat(objectTypeBreadcrumbs));
    }
  }, [objectTypeBreadcrumbs, parentId]);

  return {
    childrenItems,
    isErrorChildrenItems,
    isFetchingChildrenItems,

    parentItems,
    isFetchingParentItems,
    isErrorParentItems,

    objectTypeFromSearch,
  };
};
