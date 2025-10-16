import { useMemo } from 'react';
import { GridLogicOperator } from '@mui/x-data-grid';
import { AssociatedObjectsType } from '6_shared';

export interface ITmoModel {
  tmoId: number;
  tmoName: string;
  moIds?: number[];
  tprmId?: string;
  tprmName?: string;
  label?: string;
}

const getLinkedFilter = (columnName: string, linkObjName: string) => {
  return [
    {
      columnName,
      rule: 'and' as GridLogicOperator,
      filters: [{ operator: 'equals', value: linkObjName }],
    },
  ];
};

const getChildrenFilter = (parentId: number) => {
  return [
    {
      columnName: 'p_id',
      rule: 'and' as GridLogicOperator,
      filters: [{ operator: 'equals', value: parentId }],
    },
  ];
};

// const getRelatedFilter = (idsArr: number) => {
//   return [
//     {
//       columnName: 'id',
//       rule: 'and' as GridLogicOperator,
//       filters: [{ operator: 'isAnyOf', value: idsArr }],
//     },
//   ];
// };

interface IProps {
  tmoModel: ITmoModel[];
  associatedObjectType: AssociatedObjectsType;
  linkObjName?: string;
  parentId?: number | null;
  selectedTmo: number | null;
  idsArr: number[];
}

export const useGetAdditionalFilters = ({
  linkObjName,
  associatedObjectType,
  tmoModel,
  parentId,
  selectedTmo,
  idsArr,
}: IProps) => {
  const additionalFilters = useMemo(() => {
    if (associatedObjectType === 'linked' && linkObjName) {
      const columnName = tmoModel.find((item) => item.tmoId === selectedTmo)?.tprmId;
      if (columnName != null) return getLinkedFilter(columnName, linkObjName);
      return [];
    }
    if (associatedObjectType === 'children' && parentId) {
      return getChildrenFilter(parentId);
    }
    if (associatedObjectType === 'related') {
      return [
        {
          columnName: 'id',
          rule: 'and' as GridLogicOperator,
          filters: [{ operator: 'isAnyOf', value: idsArr }],
        },
      ];
    }
    return [];
  }, [associatedObjectType, linkObjName, parentId, tmoModel, selectedTmo, idsArr]);

  return { additionalFilters };
};
