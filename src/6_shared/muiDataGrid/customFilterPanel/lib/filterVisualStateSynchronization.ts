import { MutableRefObject } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridLogicOperator } from '@mui/x-data-grid-premium';
import { getGridFilterItems, INestedMultiFilterForm } from '../../../ui';

export const filterVisualStateSynchronization = (
  gridApiRef?: MutableRefObject<GridApiPremium>,
  filterState?: INestedMultiFilterForm | null,
) => {
  if (gridApiRef?.current && filterState) {
    const currenGridFilter = getGridFilterItems(filterState.columnFilters ?? []);
    const fLogicalOperator = filterState.columnFilters[0]?.logicalOperator;
    const gridLogical = fLogicalOperator === 'or' ? GridLogicOperator.Or : GridLogicOperator.And;

    return {
      currenGridFilter,
      gridLogical,
    };
  }
  return null;
};
