import { EndpointNames, searchApiV2 } from '6_shared';
import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import { BatchObjectsWithParametersResponse, GetObjectRequestParams } from './types';
import { transformExport } from '../../utils/transformExport';

const buildGetExportedObjectsQuery = (
  tmo_id: number,
  file_type: 'csv' | 'xlsx',
  idArr: number[] | null,
  prmTypesArr?: string[],
  filtersStr?: string,
  delimiter?: string,
) => {
  let url = `batch/export_obj_with_params/${tmo_id}?file_type=${file_type}`;

  if (delimiter) {
    url += `&delimiter=${delimiter}`;
  }

  if (idArr && idArr.length) {
    url += `&obj_ids=${idArr.join('&obj_ids=')}`;
  }

  if (prmTypesArr && prmTypesArr.length) {
    url += `&prm_type_ids=${prmTypesArr.join('&prm_type_ids=')}`;
  }

  if (filtersStr) {
    url += `${filtersStr}`;
  }

  return url;
};

const batchOperationsApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getExportedObjectsWithParameters: builder.query<Blob, GetObjectRequestParams>({
      query({ tmo_id, obj_ids, file_type, prm_type_ids, filters, delimiter }) {
        return {
          url: buildGetExportedObjectsQuery(
            tmo_id,
            file_type,
            obj_ids,
            prm_type_ids,
            filters,
            delimiter,
          ),
          method: 'GET',
          responseHandler: (response) => transformExport(response, 'pm_report', file_type),
          cache: 'no-cache',
        };
      },
      extraOptions: inventoryNewApiOptions,
    }),
    postBatchObjectsWithParameters: builder.mutation<
      BatchObjectsWithParametersResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `batch/object_and_param_values/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
          setTimeout(() => {
            dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
            dispatch(inventoryNewApi.util.invalidateTags([{ type: 'Objects', id: 'LIST' }]));
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    postBatchObjectsPreview: builder.mutation<Blob, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `batch/batch_objects_preview/${id}`,
        method: 'POST',
        body,
        responseHandler: (response) => response.arrayBuffer(),
        // responseHandler: async (response) => {
        //   const arrayBuffer = await response.arrayBuffer();
        //   await transformExport(response, 'xls');
        //   return arrayBuffer;
        // },
      }),
      extraOptions: inventoryNewApiOptions,
    }),
  }),
  overrideExisting: false,
});

export const { usePostBatchObjectsWithParametersMutation, usePostBatchObjectsPreviewMutation } =
  batchOperationsApi;
