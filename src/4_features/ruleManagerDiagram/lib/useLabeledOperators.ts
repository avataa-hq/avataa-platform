import { useMemo } from 'react';

import { dataviewHelpersApi, getOperatorLabel } from '6_shared';

const { useGetOperatorsQuery } = dataviewHelpersApi;

export const useLabeledOperators = () => {
  const { data: allOperators, isFetching, isError } = useGetOperatorsQuery();

  const operatorsWithLabels: Record<string, Record<string, string>> = useMemo(() => {
    if (!allOperators) return {};

    return Object.entries(allOperators).reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: value.reduce(
          (acc, operator) => ({
            ...acc,
            [getOperatorLabel(operator)]: operator,
          }),
          {},
        ),
      }),
      {},
    );
  }, [allOperators]);

  return { data: operatorsWithLabels, isFetching, isError };
};
