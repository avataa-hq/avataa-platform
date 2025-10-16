import { GridAggregationFunction, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { MutableRefObject, useCallback, useMemo } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';

interface IProps {
  selectedRows: GridRowSelectionModel;
  apiRef: MutableRefObject<GridApiPremium>;
}

export const useGetCustomAggregation = ({ selectedRows, apiRef }: IProps) => {
  const getNotEmptyValues = (arr: number[]) =>
    arr.filter((value) => value !== null && value !== undefined);

  const getSum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  const getNotEmptySelectedValuesArr = useCallback(
    (field: string) => {
      return selectedRows.flatMap((id) => {
        const row = apiRef?.current?.getRow(id);
        if (!row) return null;

        const value = row[field];

        if (value === null || value === undefined) return [];
        return value;
      });
    },
    [apiRef, selectedRows],
  );

  const customSum: GridAggregationFunction = useMemo(
    () => ({
      label: 'sum',
      apply: ({ field, values }) => {
        if (selectedRows.length) {
          const selectedValuesArr = getNotEmptySelectedValuesArr(field);
          return getSum(selectedValuesArr);
        }

        return getSum(getNotEmptyValues(values));
      },
      columnTypes: ['number'],
    }),
    [selectedRows, getNotEmptySelectedValuesArr],
  );

  const customAvg: GridAggregationFunction = useMemo(
    () => ({
      label: 'avg',
      apply: ({ field, values }) => {
        if (selectedRows.length) {
          const selectedValuesArr = getNotEmptySelectedValuesArr(field);
          const selectedSum = getSum(selectedValuesArr);

          return selectedSum / selectedValuesArr.length;
        }

        const notEmptyCells = getNotEmptyValues(values);
        const notEmptyValues = getSum(notEmptyCells);

        return notEmptyValues / notEmptyCells.length;
      },
      columnTypes: ['number'],
    }),
    [selectedRows, getNotEmptySelectedValuesArr],
  );

  const customMin: GridAggregationFunction = useMemo(
    () => ({
      label: 'min',
      apply: ({ field, values }) => {
        if (selectedRows.length) {
          const selectedValuesArr = getNotEmptySelectedValuesArr(field);

          return Math.min(...selectedValuesArr) === Infinity
            ? 'Empty data'
            : Math.min(...selectedValuesArr);
        }

        const totalMin = Math.min(...getNotEmptyValues(values));

        return totalMin === Infinity ? 'Empty data' : totalMin;
      },
      columnTypes: ['number'],
    }),
    [selectedRows, getNotEmptySelectedValuesArr],
  );

  const customMax: GridAggregationFunction = useMemo(
    () => ({
      label: 'max',
      apply: ({ field, values }) => {
        if (selectedRows.length) {
          const selectedValuesArr = getNotEmptySelectedValuesArr(field);

          return Math.max(...selectedValuesArr) === -Infinity
            ? 'Empty data'
            : Math.max(...selectedValuesArr);
        }

        const totalMax = Math.max(...getNotEmptyValues(values));

        return totalMax === -Infinity ? 'Empty data' : totalMax;
      },
      columnTypes: ['number'],
    }),
    [selectedRows, getNotEmptySelectedValuesArr],
  );

  return { customSum, customAvg, customMin, customMax };
};
