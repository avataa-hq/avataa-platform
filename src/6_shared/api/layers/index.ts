import { layersApiV1 as layersApiBase } from './layersApi';
import { foldersApi } from './folders';
import { layersApi } from './layers';

export const layersMsApi = {
  ...layersApiBase,
  folders: foldersApi,
  layers: layersApi,
};

export * from './types';
