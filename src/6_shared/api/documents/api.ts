import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import { inventoryNewApi, searchApiV2 } from '6_shared';
import { IAddDocumentToObjectByIdBody, IFileData, IPostFileBody, UpdateFileBody } from './types';

const documentsApiOptions = { apiName: 'inventoryDocumentsApi' };

const getDocumentFilesProvideTags = (result?: IFileData[]) => {
  return result
    ? [
        ...result.map((file) => ({
          type: 'Files' as const,
          id: file.id,
        })),
        'Files',
      ]
    : ['Files'];
};

const dynamicBaseQuery = generateDynamicBaseQuery('_apiBase8101');

export const inventoryDocumentsApi = createApi({
  ...setDefaultApiSettings('inventoryDocuments', dynamicBaseQuery, ['Files']),
  endpoints: (builder) => ({
    getDocumentFiles: builder.query<IFileData[], number | string>({
      query: (id) => ({
        url: `document?externalIdentifier.id=${id}`,
        method: 'GET',
      }),
      providesTags: (result) => getDocumentFilesProvideTags(result),
      extraOptions: documentsApiOptions,
    }),
    getObjectDocumentsById: builder.query<IFileData[], number>({
      query: (id) => ({
        url: `inventory/object/${id}`,
        method: 'GET',
      }),
      providesTags: (result) => getDocumentFilesProvideTags(result),
      extraOptions: documentsApiOptions,
    }),
    postDocumentFile: builder.mutation<void, IPostFileBody>({
      query: ({ externalSkip, ...body }) => ({
        url: 'document',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Files'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        if (arg.externalSkip) return;
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: documentsApiOptions,
    }),
    addDocumentToObjectById: builder.mutation<void, IAddDocumentToObjectByIdBody>({
      query: ({ objectId, body }) => ({
        url: `inventory/object/${objectId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Files'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: documentsApiOptions,
    }),
    deleteFile: builder.mutation<any, { id: string; externalSkip?: boolean }>({
      query: ({ id }) => ({
        url: `document/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Files'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        if (arg.externalSkip) return;
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: documentsApiOptions,
    }),
    updateFile: builder.mutation<void, UpdateFileBody>({
      query: ({ id, body }) => ({
        url: `document/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Files'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: documentsApiOptions,
    }),
    copyAttachments: builder.mutation<void, { from_mo_id: number; to_mo_id: number }>({
      query: ({ from_mo_id, to_mo_id }) => ({
        url: `copy_between_objects?from_mo_id=${from_mo_id}&to_mo_id=${to_mo_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Files'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});
