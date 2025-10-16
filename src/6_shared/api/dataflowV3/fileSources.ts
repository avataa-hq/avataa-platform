import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { FileExtension, FileImportType } from './types';

export const fileSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getFileSourcesTypes: build.query<FileImportType[], void>({
      query: () => ({
        url: 'file_sources/types',
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileSourcesExtensions: build.query<FileExtension[], void>({
      query: () => ({
        url: 'file_sources/file_extensions',
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
