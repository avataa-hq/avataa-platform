import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/react';

export const setDefaultApiSettings = (
  sliceName: string,
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
  tags?: string[],
) => ({
  reducerPath: sliceName,
  tagTypes: tags,
  baseQuery,
  keepUnusedDataFor: 600,
  refetchOnMountOrArgChange: 600,
  // refetchOnReconnect: true,
});
