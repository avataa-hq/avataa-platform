import { AggregationType } from '6_shared/api/clickhouse/constants';

export const getAggregationNumberArray = (data?: number[], aggregationType?: AggregationType) => {
  if (!data || !data.length) return 0;

  const getAggregationValue = () => {
    let result = 0;

    data.forEach((item) => {
      result += +item;
    });

    if (aggregationType === 'AVG') {
      return result / data.length;
    }
    if (aggregationType === 'SUM') {
      return result;
    }
    if (aggregationType === 'MAX') {
      return Math.max(...data.map((item) => +item));
    }
    if (aggregationType === 'MIN') {
      return Math.min(...data.map((item) => +item));
    }
    return result;
  };

  return getAggregationValue();
};
