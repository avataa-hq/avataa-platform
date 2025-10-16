import { useMemo, useState } from 'react';

import {
  hierarchyLevels,
  IFilterSetModel,
  INestedFilterColumn,
  INestedMultiFilterForm,
  ITmoInfo,
  NestedMultiFilter,
  objectTypesApi,
  parameterTypesApi,
  ActionTypes,
  useHierarchy,
} from '6_shared';
import { ObjectTypeAutocomplete, transformColumnType } from '5_entites';

import {
  Content,
  FilterContainer,
  HierarchyFilterStyled,
  SelectedObjectTypeContainer,
} from './HierarchyFilter.styled';

const transformToFilterModal = (
  filterState: INestedMultiFilterForm | null,
): IFilterSetModel | null => {
  if (!filterState) return null;
  return {
    name: 'Hierarchy Filter',
    id: filterState.selectedTmo?.id ?? 0,
    join_operator: 'and',
    tmo_info: filterState.selectedTmo!,
    filters: filterState.columnFilters,
  };
};
const transformFromFilterModal = (
  filterState: IFilterSetModel | null,
): INestedMultiFilterForm | null => {
  if (!filterState) return null;
  return {
    columnFilters: filterState.filters,
    selectedTmo: filterState.tmo_info,
    name: filterState.name,
    isPublic: filterState.public,
  };
};

interface IHierarchyFilterData {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  permissions?: Record<ActionTypes, boolean>;
}
export const HierarchyFilter = ({ isOpen, setIsOpen, permissions }: IHierarchyFilterData) => {
  const { useGetObjectTypesQuery } = objectTypesApi;
  const { useGetLevelsQuery } = hierarchyLevels;
  const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

  const [selectedTMOData, setSelectedTMOData] = useState<ITmoInfo | null>(null);

  const { activeHierarchy, hierarchyFilter, setHierarchyFilter, setSelectedIHierarchyItem } =
    useHierarchy();

  // ====== Retrieving all object types that participate in the selected hierarchy
  const { data: hierarchyLevelData } = useGetLevelsQuery(activeHierarchy?.id!!, {
    skip: !activeHierarchy?.id! || activeHierarchy?.id === null,
  });

  const currentObjectTypeIds = useMemo(() => {
    if (!hierarchyLevelData || !hierarchyLevelData.length) return null;
    return hierarchyLevelData.map((level) => level.object_type_id);
  }, [hierarchyLevelData]);

  // ===== Getting a list of object types with name and id
  const {
    data: objectTypeList,
    isFetching: isFetchingObjectTypeList,
    isError: isErrorObjectTypeList,
  } = useGetObjectTypesQuery(
    { object_types_ids: currentObjectTypeIds! },
    { skip: !isOpen || !currentObjectTypeIds },
  );

  const typesObjectList = useMemo<ITmoInfo[]>(() => {
    if (!objectTypeList) return [];
    if (objectTypeList.length) {
      setSelectedTMOData({ id: objectTypeList[0].id, name: objectTypeList[0].name });
    }
    return objectTypeList.map((type) => ({ id: type.id, name: type.name }));
  }, [objectTypeList]);

  // ===== Getting columns for the selected object type
  const {
    data: inventoryParamTypesData,
    isError,
    isFetching,
  } = useGetObjectTypeParamTypesQuery(
    { id: selectedTMOData?.id! },
    { skip: selectedTMOData?.id == null || selectedTMOData?.name === '' || !isOpen },
  );
  const columns = useMemo<INestedFilterColumn[]>(() => {
    if (!inventoryParamTypesData) return [];
    return inventoryParamTypesData.flatMap((param) => {
      if (!param.returnable) return [];
      return {
        id: String(param.id),
        name: param.name,
        type: transformColumnType(param.val_type),
      };
    });
  }, [inventoryParamTypesData]);
  // =====

  const onFiltersApply = (state: INestedMultiFilterForm) => {
    if (selectedTMOData) {
      const stateWithTmo = { ...state, selectedTmo: selectedTMOData };
      setHierarchyFilter(transformToFilterModal(stateWithTmo));
      setSelectedIHierarchyItem(null);
      setIsOpen(false);
    }
  };
  const onChange = (state: INestedMultiFilterForm) => {
    if (!state.columnFilters.length) {
      setHierarchyFilter(null);
    }
  };

  const multifilterState = useMemo(() => {
    return transformFromFilterModal(hierarchyFilter);
  }, [hierarchyFilter]);

  return (
    <HierarchyFilterStyled
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Content>
        <SelectedObjectTypeContainer>
          <ObjectTypeAutocomplete
            value={selectedTMOData}
            options={typesObjectList}
            onChange={setSelectedTMOData}
            isError={isErrorObjectTypeList}
            isLoading={isFetchingObjectTypeList}
          />
        </SelectedObjectTypeContainer>
        <FilterContainer>
          <NestedMultiFilter
            disableTitle
            onApply={onFiltersApply}
            onChange={onChange}
            permissions={permissions}
            multiFilterData={{
              columnsData: { list: columns, isError, isLoading: isFetching },
              filterState: multifilterState,
            }}
          />
        </FilterContainer>
      </Content>
    </HierarchyFilterStyled>
  );
};
