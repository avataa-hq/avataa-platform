import { layersApiV1, layersApiOptions } from './layersApi';
import {
  ICreateFolderBody,
  IFolderModel,
  IGetFoldersRequestParams,
  IUpdateFolderBody,
} from './types';

export const foldersApi = layersApiV1.injectEndpoints({
  endpoints: (builder) => ({
    getFolders: builder.query<IFolderModel[], IGetFoldersRequestParams>({
      query: (params) => ({
        url: 'folders/get_folders',
        params,
      }),
      providesTags: ['Folders'],
      extraOptions: layersApiOptions,
    }),
    getFoldersByParentFolderId: builder.query<IFolderModel[], { parent_folder_id?: number }>({
      query: ({ parent_folder_id }) => ({
        url: parent_folder_id
          ? `folders/get_folder_by_parent_folder_id?parent_folder_id=${parent_folder_id}`
          : `folders/get_folder_by_parent_folder_id`,
      }),
      providesTags: ['Folders'],
      extraOptions: layersApiOptions,
    }),
    createFolder: builder.mutation<IFolderModel, ICreateFolderBody>({
      query: (body) => ({
        url: 'folders/create_folder',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Folders'],
      extraOptions: layersApiOptions,
    }),
    updateFolder: builder.mutation<IFolderModel, IUpdateFolderBody>({
      query: (body) => ({
        url: 'folders/update_folder',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Folders'],
      extraOptions: layersApiOptions,
    }),
    deleteFolder: builder.mutation<string, { folder_id: number }>({
      query: ({ folder_id }) => ({
        url: `folders/delete_folder?folder_id=${folder_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Folders'],
      extraOptions: layersApiOptions,
    }),
  }),
});
