import { useGetObjectsRequestBody, useInventoryResponses } from '5_entites';
import { AssociatedObjectsType, useAssociatedObjects } from '6_shared';
import { ITmoModel, useGetAdditionalFilters } from './useGetAdditionalFilters';

interface IProps {
  tmoModel: ITmoModel[];
  associatedObjectType: AssociatedObjectsType;
  linkObjName?: string;
  parentId?: number | null;
  skip?: boolean;
  idsArr: number[];
}

export const useGetDetailedTableData = ({
  linkObjName,
  associatedObjectType,
  tmoModel,
  parentId,
  skip,
  idsArr,
}: IProps) => {
  const { detailedView, skipFetching } = useAssociatedObjects();

  const {
    searchValue,
    pagination,
    selectedTmo,
    composedSelectedTmo,
    filters,
    isObjectsActive,
    exportDataDelimiter,
    selectedRows,
    sorting,
  } = detailedView;

  const { additionalFilters } = useGetAdditionalFilters({
    linkObjName,
    associatedObjectType,
    tmoModel,
    parentId,
    selectedTmo,
    idsArr,
  });

  const { objectsByFiltersBody, getExportBody } = useGetObjectsRequestBody({
    tmoId: selectedTmo as number,
    pagination,
    sorting,
    searchValue,
    isObjectsActive,
    additionalFilters,
    selectedFilter: filters,
    delimiter: exportDataDelimiter,
    withParentsData: false,
    selectedRows,
  });

  const {
    columnsData: { inventoryColumns, isInventoryColumnsLoading },
    rowsData: { inventoryRows, inventoryRowsLoading },
  } = useInventoryResponses({
    objectsByFiltersBody,
    skip: skipFetching || skip,
  });

  return {
    inventoryColumns,
    isInventoryColumnsLoading,
    inventoryRows,
    inventoryRowsLoading,
    getExportBody,
  };
};
