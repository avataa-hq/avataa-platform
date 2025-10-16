import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { Source, FileConData } from './types';

export const fileSftpSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    createFileSftpSource: build.mutation<Source<FileConData>, Omit<Source<FileConData>, 'id'>>({
      query: (body) => ({
        url: 'file_sources/sftp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Source'],
      extraOptions: dataflowApiOptions,
    }),
    updateFileSftpSource: build.mutation<
      void,
      { sourceId: number; body: Omit<Source<FileConData>, 'id'> }
    >({
      query: ({ sourceId, body }) => ({
        url: `file_sources/sftp/${sourceId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { sourceId }) => [{ type: 'Source', id: sourceId }],
      extraOptions: dataflowApiOptions,
    }),
    getFileAndDirectoriesFromSftpSourcePath: build.query<unknown, number>({
      query: (sourceId) => ({
        url: `file_sources/sftp/${sourceId}/files_in_source_path`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileSftpSourceColumns: build.query<string[], number>({
      query: (sourceId) => ({
        url: `file_sources/sftp/${sourceId}/file_columns`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    // Helpers
    checkFileSftpSourceConnectionWithoutId: build.mutation<
      unknown,
      Omit<FileConData, 'import_type' | 'source_data_columns'>
    >({
      query: (body) => ({
        url: 'file_sources/sftp/helpers/check_connection',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileAndDirectoriesFromSftpSourcePathWithoutId: build.mutation<
      string[],
      Omit<FileConData, 'import_type' | 'source_data_columns' | 'file_name'>
    >({
      query: (body) => ({
        url: 'file_sources/sftp/helpers/listdir',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getFileSftpSourceColumnsWithoutId: build.mutation<
      string[],
      Omit<FileConData, 'import_type' | 'source_data_columns'>
    >({
      query: (body) => ({
        url: 'file_sources/sftp/helpers/file_columns',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
