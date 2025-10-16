import { dataflowApiV3 } from './dataflowApi';
import { CreateDestinationsRequest } from './types';

export const remoteDestinationsApi = dataflowApiV3.injectEndpoints({
  endpoints: (build) => ({
    getAllDestinations: build.query<any, void>({
      query: () => ({
        url: 'destinations',
      }),
      providesTags: ['Destination'],
    }),
    createRemoteDestination: build.mutation<any, CreateDestinationsRequest>({
      query: (body) => ({
        url: 'destinations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Destination'],
      //   extraOptions: dataflowApiOptions,
    }),
    checkConnection: build.mutation<any, Omit<CreateDestinationsRequest, 'name'>>({
      query: (body) => ({
        url: 'destinations/check_connection',
        method: 'POST',
        body,
      }),
      //   extraOptions: dataflowApiOptions,
    }),
    getListOfDirsAndFiles: build.mutation<string[], Omit<CreateDestinationsRequest, 'name'>>({
      query: (body) => ({
        url: 'destinations/listdir',
        method: 'POST',
        body,
      }),
    }),
  }),
});
