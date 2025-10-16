// Folder

export interface IGetFoldersRequestParams {
  limit?: number;
  offset?: number;
}

export interface IFolderModel {
  id: number;
  name: string;
  parent_id: number | null;
  created_by: string;
  modified_by: string;
  creation_date: Date;
  modification_date: Date;
}

export interface ICreateFolderBody {
  name: string;
  parent_id?: number;
}

export interface IUpdateFolderBody {
  id: number;
  name?: string;
  parent_id?: number;
}

// Layers

export interface IGetLayersRequestParams {
  limit?: number;
  offset?: number;
}

export interface ILayerModel {
  id: number;
  name: string;
  file_link: string;
  folder_id: number;
  created_by: string;
  modified_by: string;
  creation_date: Date;
}

export interface IGetLayersByFolderIdRequestParams extends IGetLayersRequestParams {
  folder_id?: number;
}

export interface IUpdateLayerBody {
  layer_id: number;
  body: {
    folder_id: number;
  };
}

export interface IGetLayerContent {
  file_content: string;
}

interface IBaseLayer {
  folder_id?: number;
}

interface IServerLinkLayer {
  server_link: string;
}

export interface ICreateLayerBody {
  layer_name: string;
  body: IBaseLayer & (FormData | IServerLinkLayer);
}
