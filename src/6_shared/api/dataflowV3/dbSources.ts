import { dataflowGroupsApi } from '6_shared';
import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { Message, Source, DbDriver, DbConData } from './types';

export const dbSourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getDbDrivers: build.query<DbDriver[], void>({
      query: () => ({
        url: 'db_sources/db_drivers',
      }),
      extraOptions: dataflowApiOptions,
    }),
    createDbSource: build.mutation<Source<DbConData>, Omit<Source<DbConData>, 'id'>>({
      query: (body) => ({
        url: 'db_sources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Source'],
      extraOptions: dataflowApiOptions,
    }),
    updateDbSource: build.mutation<void, { sourceId: number; body: Omit<Source<DbConData>, 'id'> }>(
      {
        query: ({ sourceId, body }) => ({
          url: `db_sources/${sourceId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { sourceId }) => [{ type: 'Source', id: sourceId }],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(dataflowGroupsApi.util.invalidateTags(['Group']));
          } catch (error) {
            console.error(error);
          }
        },
        extraOptions: dataflowApiOptions,
      },
    ),
    getDbSourceTables: build.query<Message, number>({
      query: (sourceId) => ({
        url: `db_sources/${sourceId}/db_table`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getDbSourceTableColumns: build.query<string[], number>({
      query: (sourceId) => ({
        url: `db_sources/${sourceId}/db_table_columns`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    // Helpers
    checkDbSourceConnectionWithoutId: build.mutation<
      Message,
      Omit<DbConData, 'source_data_columns' | 'db_table'>
    >({
      query: (body) => ({
        url: 'db_sources/helpers/check_connection',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getDbSourceTablesWithoutId: build.mutation<
      string[],
      Omit<DbConData, 'source_data_columns' | 'db_table'>
    >({
      query: (body) => ({
        url: 'db_sources/helpers/db_tables',
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
    getDbSourceTableColumnsWithoutId: build.mutation<
      string[],
      Omit<DbConData, 'source_data_columns'>
    >({
      query: (body) => ({
        url: `db_sources/helpers/db_table_columns?only_datetime=${body.only_datetime || false}`,
        method: 'POST',
        body,
      }),
      extraOptions: dataflowApiOptions,
    }),
  }),
});
