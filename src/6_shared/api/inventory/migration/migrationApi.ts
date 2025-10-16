import { inventoryNewApiOptions } from '6_shared';
import { inventoryNewApi } from '../api';
import { IMigrationExportBody } from './types';
import { transformExport } from '../../utils/transformExport';

export const migrationApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    migrationExport: builder.mutation<File, IMigrationExportBody>({
      query: (body) => ({
        url: 'migration/migrate_object_type_as_export',
        method: 'POST',
        params: body,
        responseHandler: (response) => {
          return transformExport(response, `Object_type_${body.object_type_id}`, 'xlsx');
        },
      }),
      extraOptions: inventoryNewApiOptions,
    }),
    migrationImport: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: 'migration/migrate_object_type_as_import',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
  }),
});
