import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { Source, FileConData } from './types';

export const fileFtpSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    createFileFtpSource: build.mutation<Source<FileConData>, Omit<Source<FileConData>, 'id'>>({
      query: (body) => ({
        url: 'file_sources/ftp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Source'],
      extraOptions: dataflowApiOptions,
    }),
    updateFileFtpSource: build.mutation<
      void,
      { sourceId: number; body: Omit<Source<FileConData>, 'id'> }
    >({
      query: ({ sourceId, body }) => ({
        url: `file_sources/ftp/${sourceId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { sourceId }) => [{ type: 'Source', id: sourceId }],
      extraOptions: dataflowApiOptions,
    }),
    getFileAndDirectoriesFromFtpSourcePath: build.query<unknown, number>({
      query: (sourceId) => ({
        url: `file_sources/ftp/${sourceId}/files_in_source_path`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileFtpSourceColumns: build.query<string[], number>({
      query: (sourceId) => ({
        url: `file_sources/ftp/${sourceId}/file_columns`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    // Helpers
    checkFileFtpSourceConnectionWithoutId: build.mutation<
      unknown,
      Omit<FileConData, 'import_type' | 'source_data_columns'>
    >({
      query: (body) => ({
        url: 'file_sources/ftp/helpers/check_connection',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileAndDirectoriesFromFtpSourcePathWithoutId: build.mutation<
      string[],
      Omit<FileConData, 'import_type' | 'source_data_columns' | 'file_name'>
    >({
      query: (body) => ({
        url: 'file_sources/ftp/helpers/listdir',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileFtpSourceColumnsWithoutId: build.mutation<
      string[],
      Omit<FileConData, 'import_type' | 'source_data_columns'>
    >({
      query: (body) => ({
        url: 'file_sources/ftp/helpers/file_columns',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
