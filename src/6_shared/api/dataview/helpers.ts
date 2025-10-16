import { dataviewApi, dataviewApiOptions } from './dataviewApi';
import { ValType } from './types';

export const dataviewHelpersApi = dataviewApi.injectEndpoints({
  endpoints: (build) => ({
    getValTypes: build.query<string[], void>({
      query: () => ({
        url: 'helpers/val_types',
      }),
      extraOptions: dataviewApiOptions,
    }),
    getAggregations: build.query<Record<string, string[]>, ValType | void>({
      query: (val_type) => ({
        url: 'helpers/aggregations',
        query: val_type && { val_type },
      }),
      extraOptions: dataviewApiOptions,
    }),
    getOperators: build.query<Record<string, string[]>, ValType | void>({
      query: (val_type) => ({
        url: 'helpers/operators',
        query: val_type && { val_type },
      }),
      extraOptions: dataviewApiOptions,
    }),
  }),
});
