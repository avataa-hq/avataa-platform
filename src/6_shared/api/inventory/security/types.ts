export interface InventoryPermissionsModel {
  id: number;
  itemId: number;
  rootItemId: number;
  rootPermissionId: number;
  permission: string;
  permissionName: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  admin: boolean;
}
export type CreatePermissionsBody = Omit<InventoryPermissionsModel, 'id'>;

export interface UpdatePermissionsBody {
  id: number;
  body: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    admin?: boolean;
  };
}

export interface CreateMultiplePermissionsBody {
  itemId: number;
  permission: string[];
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  admin?: boolean;
}
