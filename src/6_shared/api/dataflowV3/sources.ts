import { dataflowGroupsApi } from '6_shared';
import { dataflowApiV3, dataflowApiOptions } from './dataflowApi';
import { dataviewApi } from '../dataview';
import { Message, Source, ConType } from './types';

export const sourcesApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getConTypes: build.query<ConType[], void>({
      query: () => ({
        url: 'sources/con_types',
      }),
      extraOptions: dataflowApiOptions,
    }),
    getSourceById: build.query<Source, number>({
      query: (sourceId) => ({
        url: `sources/source/${sourceId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Source', id }],
      extraOptions: dataflowApiOptions,
    }),
    deleteSource: build.mutation<void, number>({
      query: (sourceId) => ({
        url: `sources/source/${sourceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Source', id }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            dataflowGroupsApi.util.invalidateTags([
              { type: 'Group' },
              { type: 'Source', id: 'LIST' },
            ]),
          );
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: dataflowApiOptions,
    }),
    checkSourceConnection: build.query<Message, number>({
      query: (sourceId) => ({
        url: `sources/source/${sourceId}/check_connection`,
      }),
      extraOptions: dataflowApiOptions,
    }),
    loadSourceData: build.mutation<Message, number>({
      query: (sourceId) => ({
        url: `sources/source/${sourceId}/load_data`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(dataviewApi.util.invalidateTags(['Source']));
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: dataflowApiOptions,
    }),
  }),
});
