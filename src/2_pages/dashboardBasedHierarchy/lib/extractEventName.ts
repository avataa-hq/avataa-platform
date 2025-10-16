import { AGGREGATION_TYPES } from '6_shared/api/clickhouse/constants';

export const extractEventName = (input: string): string => {
  const regex = new RegExp(`^(${AGGREGATION_TYPES.join('|')})_(.+)$`);
  const match = input.match(regex);

  return match ? match[2] : input;
};
