import { GridColType } from '@mui/x-data-grid/models/colDef/gridColType';
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridCellParams,
  GridFilterInputValue,
  GridFilterOperator,
} from '@mui/x-data-grid-premium';

const getCustomOperators = (): Record<GridColType, GridFilterOperator[]> => {
  const gridStringOperators = getGridStringOperators();
  const gridNumericOperators = getGridNumericOperators();
  const gridDataOperators = getGridDateOperators();

  const gridIsAnyOfString = gridStringOperators.find((o) => o.value === 'isAnyOf');
  const gridIsAnyOfNumeric = gridNumericOperators.find((o) => o.value === 'isAnyOf');

  const stubFn = () => () => true;

  return {
    string: [
      {
        label: 'not contains',
        value: 'notContains',
        InputComponent: GridFilterInputValue,
        InputComponentProps: { type: 'text' },
        getApplyFilterFn: stubFn,
      },
      {
        label: 'not equals',
        value: 'notEquals',
        InputComponent: GridFilterInputValue,
        InputComponentProps: { type: 'text' },
        getApplyFilterFn: stubFn,
      },
      {
        ...gridIsAnyOfString,
        label: 'is not any of',
        value: 'isNotAnyOf',
        getApplyFilterFn: stubFn,
      },
    ],
    number: [
      {
        ...gridIsAnyOfNumeric,
        label: 'is not any of',
        value: 'isNotAnyOf',
        getApplyFilterFn: stubFn,
      },
    ],
    boolean: [],
    actions: [],
    date: [
      {
        label: 'ago',
        InputComponent: GridFilterInputValue,
        InputComponentProps: { type: 'datetime-local' },
        value: 'inPeriod',
        getApplyFilterFn: stubFn,
      },
    ],
    dateTime: [
      ...gridDataOperators.map((dt) => {
        dt.InputComponentProps = { type: 'datetime-local' };
        return dt;
      }),
      {
        label: 'ago',
        InputComponent: GridFilterInputValue,
        InputComponentProps: { type: 'datetime-local' },
        value: 'inPeriod',
        getApplyFilterFn: stubFn,
      },
    ],
    singleSelect: [],
    // Added after migrating to MUI Data Grid 7
    custom: [],
  };
};

export const getGridFilterOperators = (valueType: GridColType) => {
  const { boolean, date, number, singleSelect, string, dateTime } = getCustomOperators();
  switch (valueType) {
    case 'date':
      return [...getGridDateOperators(), ...date];
    case 'dateTime':
      return dateTime;
    case 'number':
      return [...getGridNumericOperators(), ...number];
    case 'boolean':
      return [...getGridBooleanOperators(), ...boolean];
    case 'singleSelect':
      return [...getGridSingleSelectOperators(), ...singleSelect];
    case 'string':
      return [...getGridStringOperators(), ...string];
    default:
      return [...getGridStringOperators(), ...string];
  }
};
