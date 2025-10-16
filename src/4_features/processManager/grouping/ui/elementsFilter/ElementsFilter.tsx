import {
  camundaColumns,
  INestedFilterColumn,
  INestedFilterForwardRef,
  INestedMultiFilterForm,
  NestedMultiFilter,
  parameterTypesApi,
  searchApiV2,
  transformToMultiFilterOperators,
} from '6_shared';
import { ForwardedRef, useMemo } from 'react';

import { ElementsFilterStyled } from './ElementsFilter.styled';

const transformColumnType = (type: string) => {
  switch (type) {
    case 'int':
    case 'float':
      return 'number';
    case 'bool':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'dateTime';
    case 'enum':
      return 'enum';
    default:
      return 'string';
  }
};

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useGetOperatorTypeQuery } = searchApiV2;

const camundaColumnList: INestedFilterColumn[] = camundaColumns.map((cc) => ({
  id: cc.id,
  name: cc.name,
  type: transformColumnType(cc.val_type),
}));

interface IProps {
  selectedFilterState: INestedMultiFilterForm | null;
  onApplyFilter?: (filterState: INestedMultiFilterForm) => void;
  onChangeFilterForm?: (filterForm: INestedMultiFilterForm) => void;

  currentTmoId?: number | null;
  skipResponse?: boolean;

  multerFilterRef?: ForwardedRef<INestedFilterForwardRef>;
}

export const ElementsFilter = ({
  selectedFilterState,
  onApplyFilter,
  onChangeFilterForm,

  currentTmoId,
  skipResponse,

  multerFilterRef,
}: IProps) => {
  const {
    data: inventoryParamTypesData,
    isFetching: isFetchingParamTypes,
    isError: isErrorParamTypes,
  } = useGetObjectTypeParamTypesQuery(
    { id: currentTmoId! },
    { skip: !currentTmoId || skipResponse },
  );

  const { data: operatorsData } = useGetOperatorTypeQuery();

  const columnsList = useMemo<INestedFilterColumn[]>(() => {
    if (!inventoryParamTypesData) return [];
    const columnsFromInventory = inventoryParamTypesData.map(({ id, name, val_type }) => ({
      id: String(id),
      name,
      type: transformColumnType(val_type) as any,
    }));
    return [...columnsFromInventory, ...camundaColumnList];
  }, [inventoryParamTypesData]);

  return (
    <ElementsFilterStyled>
      <NestedMultiFilter
        ref={multerFilterRef}
        onApply={onApplyFilter}
        disableTitle
        disableResetWhenApply
        disableExpandAllButton
        disableClearAllButton
        disableApplyButton
        onChange={onChangeFilterForm}
        multiFilterData={{
          filterState: selectedFilterState,
          operatorsData: transformToMultiFilterOperators(operatorsData),
          columnsData: {
            list: columnsList,
            isError: isErrorParamTypes,
            isLoading: isFetchingParamTypes,
          },
        }}
      />
    </ElementsFilterStyled>
  );
};
