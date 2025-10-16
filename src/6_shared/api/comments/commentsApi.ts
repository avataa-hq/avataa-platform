import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import {
  CommentsObjectModel,
  CreateDefaultCommentBody,
  CreateObjectCommentBody,
  DefaultCommentsModel,
  GetDefaultCommentsRequestParams,
  GetObjectCommentsRequestParam,
  UpdateDefaultCommentBody,
  UpdateObjectCommentBody,
} from './types';

const dynamicBaseQuery = generateDynamicBaseQuery('_commentsApiBase');

const commentsApiOptions = { apiName: 'commentsApi' };

export const commentsApi = createApi({
  ...setDefaultApiSettings('comments', dynamicBaseQuery),
  refetchOnMountOrArgChange: 1,
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getAllComments: builder.query<CommentsObjectModel, GetObjectCommentsRequestParam>({
      query: ({ id, ...params }) => ({ url: `comment/${id}/all`, params }),
      providesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    getCommentById: builder.query<any, number>({
      query: (id) => `comment/${id}`,
      providesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    createComment: builder.mutation<void, CreateObjectCommentBody>({
      query: ({ id, body }) => ({
        url: `comment/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    updateComment: builder.mutation<any, UpdateObjectCommentBody>({
      query: ({ id, body }) => ({
        url: `comment/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    deleteComment: builder.mutation<any, number>({
      query: (id) => ({
        url: `comment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),

    getAllDefaultComments: builder.query<DefaultCommentsModel, GetDefaultCommentsRequestParams>({
      query: ({ ...params }) => ({ url: `default_comment/all`, params }),
      providesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    getDefaultCommentById: builder.query<any, number>({
      query: (id) => `default_comment/${id}`,
      providesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    createDefaultComment: builder.mutation<void, CreateDefaultCommentBody>({
      query: (body) => ({
        url: `default_comment/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    updateDefaultComment: builder.mutation<any, UpdateDefaultCommentBody>({
      query: ({ id, body }) => ({
        url: `default_comment/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
    deleteDefaultComment: builder.mutation<any, number>({
      query: (id) => ({
        url: `default_comment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
      extraOptions: commentsApiOptions,
    }),
  }),
});
