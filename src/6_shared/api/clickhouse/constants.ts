export const GRANULARITY_TYPES = ['hour', 'day', 'week', 'month', 'year'] as const;
export type GranularityType = (typeof GRANULARITY_TYPES)[number];
export const GRANULARITY_OPTIONS = ['', 'day', 'week', 'month', 'quarter', 'year'] as const;

export const AGGREGATION_TYPES = ['AVG', 'SUM', 'MIN', 'MAX'] as const;
export type AggregationType = (typeof AGGREGATION_TYPES)[number];
export const FORMAT_JSON = '%20FORMAT%20JSON';
export const CORS = '&add_http_cors_header=1';
export const CHUNK_SIZE = 300;
