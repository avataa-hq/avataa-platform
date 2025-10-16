export interface IInventoryGeometryModel {
  coordinates?: InventoryGeometryCoordinatesModel;
  path: IInventoryGeometryPathModel;
  path_length: number;
}

interface IInventoryGeometryPathModel {
  coordinates: InventoryGeometryCoordinatesModel;
  type: GeoJSON.GeoJsonTypes;
}

type InventoryGeometryCoordinatesModel =
  | GeoJSON.Position[]
  | GeoJSON.Position[][]
  | GeoJSON.Position[][][];
