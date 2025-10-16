import { layersApiV1, layersApiOptions } from './layersApi';
import {
  ICreateLayerBody,
  IGetLayerContent,
  IGetLayersByFolderIdRequestParams,
  IGetLayersRequestParams,
  ILayerModel,
  IUpdateLayerBody,
} from './types';

export const layersApi = layersApiV1.injectEndpoints({
  endpoints: (builder) => ({
    getLayers: builder.query<ILayerModel[], IGetLayersRequestParams>({
      query: (params) => ({
        url: 'layers/get_layers',
        params,
      }),
      providesTags: ['Layers'],
      extraOptions: layersApiOptions,
    }),
    getLayersByFolderId: builder.query<ILayerModel[], IGetLayersByFolderIdRequestParams>({
      query: ({ folder_id, ...params }) => ({
        url: folder_id
          ? `layers/get_layers_by_folder_id?folder_id=${folder_id}`
          : `layers/get_layers_by_folder_id`,
        params,
      }),
      providesTags: ['Layers'],
      extraOptions: layersApiOptions,
    }),
    createLayer: builder.mutation<ILayerModel, ICreateLayerBody>({
      query: ({ layer_name, body }) => ({
        url: `layers/create_layer?layer_name=${layer_name}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Layers'],
      extraOptions: layersApiOptions,
    }),
    updateLayer: builder.mutation<ILayerModel, IUpdateLayerBody>({
      query: ({ layer_id, body }) => ({
        url: `layers/update_layer/${layer_id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Layers'],
      extraOptions: layersApiOptions,
    }),
    deleteLayer: builder.mutation<any, { layer_id: number }>({
      query: ({ layer_id }) => ({
        url: `layers/delete_layer?layer_id=${layer_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Layers'],
      extraOptions: layersApiOptions,
    }),
    getLayerContent: builder.query<string, { layer_id: number }>({
      query: ({ layer_id }) => ({
        url: `layers/get_layer_content?layer_id=${layer_id}`,
        responseHandler: (response) => response.text(),
        cache: 'no-cache',
      }),
      providesTags: ['Layers'],
      extraOptions: layersApiOptions,
      keepUnusedDataFor: 0,
    }),
  }),
});
