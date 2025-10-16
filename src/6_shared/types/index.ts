import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export type ErrorData = FetchBaseQueryError | SerializedError | undefined | null;

export type ThemeColors = 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning';

type LeftAreaPage = 'main' | 'details' | 'impact' | 'siteInfo';

type CapacityPageType = 'main' | 'details';

interface IQueryProcessing {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: ErrorData | null;
  refetchFn?: () => void;
}

export interface ILatitudeLongitude {
  latitude: number;
  longitude: number;
}
export * from './inventory';
export * from './hierarchy';
export * from './modules';
export * from './common';
