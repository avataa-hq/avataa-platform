import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { generateDynamicBaseQuery, setDefaultApiSettings } from '../config';
import {
  IAddTemplateObjectsBody,
  IAddTemplateParametersBody,
  ICreateObjectTemplateBody,
  IExportTemplateBody,
  IGetTemplateObjectBody,
  IGetTemplateObjectsBody,
  IGetTemplateObjectsByObjectTypeIdModel,
  IGetTemplatesByFilterBody,
  IGetTemplatesByFilterResponse,
  IObjectTemplateBody,
  IObjectTemplateModel,
  IObjectTemplateObjectModel,
  IObjectTemplateParameterModel,
  IUpdateObjectTemplateBody,
  IUpdateObjectTemplateParameterBody,
  IUpdateObjectTemplateParametersBody,
  IUpdateTemplateObjectBody,
} from './types';
import { transformExport } from '../utils/transformExport';

const dynamicBaseQuery = generateDynamicBaseQuery('_objectTemplatesApiBase');

const objectTemplatesApiOptions = { apiName: 'objectTemplates' };

export const objectTemplatesApi = createApi({
  ...setDefaultApiSettings('objectTemplates', dynamicBaseQuery),
  endpoints: (builder) => ({
    // template-registry
    createTemplate: builder.mutation<IObjectTemplateModel, ICreateObjectTemplateBody>({
      query: (body) => ({
        url: 'registry-template',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    addTemplateObjects: builder.mutation<any, IAddTemplateObjectsBody>({
      query: ({ template_id, parent_id, body }) => ({
        url: `add-objects/${template_id}`,
        method: 'POST',
        params: { parent_id },
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    addTemplateParameters: builder.mutation<
      IObjectTemplateParameterModel[],
      IAddTemplateParametersBody
    >({
      query: ({ template_object_id, body }) => ({
        url: `add-parameters/${template_object_id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),

    // template
    getTemplates: builder.query<IObjectTemplateModel[], IObjectTemplateBody | void>({
      query: (params) => ({
        url: 'templates',
        method: 'GET',
        params: { ...params },
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    getTemplatesByFilter: builder.query<IGetTemplatesByFilterResponse, IGetTemplatesByFilterBody>({
      query: (body) => ({
        url: 'search',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    updateTemplate: builder.mutation<IObjectTemplateModel, IUpdateObjectTemplateBody>({
      query: ({ template_id, ...body }) => ({
        url: `templates/${template_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    deleteTemplate: builder.mutation<any, { template_id: number }>({
      query: ({ template_id }) => ({
        url: `templates/${template_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    exportTemplate: builder.mutation<Blob, IExportTemplateBody>({
      query: (body) => ({
        url: 'templates/export',
        method: 'POST',
        body,
        responseHandler: (response) => transformExport(response, 'template', 'xlsx'),
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),

    // template-object
    getTemplateObjects: builder.query<IObjectTemplateObjectModel[], IGetTemplateObjectsBody>({
      query: (params) => ({
        url: `objects`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    getTemplateObject: builder.query<IObjectTemplateObjectModel, IGetTemplateObjectBody>({
      query: (params) => ({
        url: `object`,
        method: 'GET',
        params,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
      keepUnusedDataFor: 0,
    }),
    updteTemplateObject: builder.mutation<IObjectTemplateObjectModel, IUpdateTemplateObjectBody>({
      query: ({ object_id, ...body }) => ({
        url: `objects/${object_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    deleteTemplateObject: builder.mutation<any, { object_id: number }>({
      query: ({ object_id }) => ({
        url: `objects/${object_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    getTemplateObjectsByObjectTypeId: builder.query<
      IGetTemplateObjectsByObjectTypeIdModel[],
      { object_type_id: number }
    >({
      query: (object_type_id) => ({
        url: `objects/by_object_type_id`,
        params: object_type_id,
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),

    // template-parameter
    getTemplateObjectParameters: builder.query<
      IObjectTemplateParameterModel[],
      { template_object_id: number }
    >({
      query: (params) => ({
        url: 'parameters',
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    updateTemplateObjectParameter: builder.mutation<
      IObjectTemplateParameterModel,
      IUpdateObjectTemplateParameterBody
    >({
      query: ({ parameter_id, ...body }) => ({
        url: `parameters/${parameter_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    updateTemplateObjectParameters: builder.mutation<
      IObjectTemplateParameterModel,
      IUpdateObjectTemplateParametersBody
    >({
      query: (body) => ({
        url: `parameters`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
    deleteTemplateObjectParameter: builder.mutation<any, { parameter_id: number }>({
      query: ({ parameter_id }) => ({
        url: `parameters/${parameter_id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(
              objectTemplatesApi.util.invalidateTags([{ type: 'ObjectTemplates', id: 'LIST' }]),
            );
          }, 3000);
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: [{ type: 'ObjectTemplates', id: 'LIST' }],
      extraOptions: objectTemplatesApiOptions,
    }),
  }),
});
