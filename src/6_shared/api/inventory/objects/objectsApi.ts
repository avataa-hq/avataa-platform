import { GridSortModel } from '@mui/x-data-grid-premium';
import {
  AllChildrenResponse,
  IInventoryObjectModel,
  InheritLocationParentObjectModel,
} from '6_shared';
import { inventoryNewApi, inventoryNewApiOptions } from '../api';
import {
  CreateObjectBody,
  // GetObjectHistoryRequestParam,
  GetObjectRequestParams,
  GetObjectWithParametersQueryParamsRequest,
  InventoryObjectWithGroupedParametersModel,
  InventoryObjectWithGroupedParametersRequestParams,
  // InventoryObjectHistoryModel,
  IGetObjectsByObjectTypesRequestParams,
  ObjectsByObjectTypesModel,
  GetObjectsByObjectNamesRequestParams,
  ObjectByObjectNamesModel,
  ObjectsByTprmIdModel,
  GetObjectsByTprmIdRequestParams,
  ObjectsByTprmIdAndPrmValueModel,
  GetObjectsByTprmIdAndPrmValueRequestParams,
  GetObjectsByPostMethodBody,
  DeleteMultipleObjectsBody,
  UpdateMultipleObjectsBody,
  IGetObjectChildWithProcessInstanceIdModel,
} from './types';
import { searchApiV2 } from '../../searchV2';

const buildGetObjectsQuery = (
  tmo_id?: number,
  idArr?: number[],
  sortingTprmsArr?: GridSortModel,
  filtersStr?: string,
) => {
  let url = `objects/?`;

  if (tmo_id) {
    url += `object_type_id=${tmo_id}`;
  }

  if (idArr && idArr.length) {
    url += `&obj_id=${idArr.join('&obj_id=')}`;
  }

  if (sortingTprmsArr && sortingTprmsArr.length) {
    let stprmsArr: string[] = [];
    let sortDirectionsArr: boolean[] = [];

    sortingTprmsArr.forEach((item) => {
      const { field, sort } = item;
      // const strPart = `&order_by_tprms_id=${field}`;
      const isAscSort = sort === 'asc';

      stprmsArr = [...stprmsArr, field];
      sortDirectionsArr = [...sortDirectionsArr, isAscSort];
    });

    url += `&order_by_tprms_id=${stprmsArr.join('&order_by_tprms_id=')}`;
    url += `&order_by_asc=${sortDirectionsArr.join('&order_by_asc=')}`;
  }

  if (filtersStr) {
    url += `${filtersStr}`;
  }

  return url;
};

const buildGetObjectsNamesQuery = (objIds: number[]) => {
  let url = 'objects/names/?';
  if (objIds && objIds.length) {
    url += `&obj_ids=${objIds.join('&obj_ids=')}`;
  }

  return url;
};

export const objectsApi = inventoryNewApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectRoute: builder.query<any[], number>({
      // TODO Уточнить тип роута объекта.
      query: (id) => `object/${id}/route`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectWithParameters: builder.query<
      IInventoryObjectModel,
      GetObjectWithParametersQueryParamsRequest
    >({
      query: ({ id, with_parameters }) => ({ url: `object/${id}`, params: { with_parameters } }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    deleteMultipleObjects: builder.mutation<any, DeleteMultipleObjectsBody>({
      query: (body) => ({
        url: 'massive_objects_delete',
        method: 'POST',
        body,
      }),
      // invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            searchApiV2.util.invalidateTags([
              { type: 'Objects', id: 'V2' },
              { type: 'Processes', id: 'LIST' },
            ]),
          );
          setTimeout(() => {
            dispatch(
              searchApiV2.util.invalidateTags([
                { type: 'Objects', id: 'V2' },
                { type: 'Processes', id: 'LIST' },
              ]),
            );
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    updateMultipleObjects: builder.mutation<any, UpdateMultipleObjectsBody[]>({
      query: (body) => ({
        url: 'massive_update_object/',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            searchApiV2.util.invalidateTags([
              { type: 'Objects', id: 'V2' },
              { type: 'Processes', id: 'LIST' },
            ]),
          );
          setTimeout(() => {
            dispatch(
              searchApiV2.util.invalidateTags([
                { type: 'Objects', id: 'V2' },
                { type: 'Processes', id: 'LIST' },
              ]),
            );
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    getObjects: builder.query<
      { apiResponse: IInventoryObjectModel[]; resultLength: number },
      GetObjectRequestParams
    >({
      query: ({ object_type_id, obj_id, order_by_tprms_id, filters, ...params }) => {
        return {
          url: buildGetObjectsQuery(object_type_id, obj_id, order_by_tprms_id, filters),
          params,
        };
      },
      // @ts-ignore
      transformResponse: (apiResponse, meta) => {
        return {
          apiResponse,
          resultLength: Number(meta!.response!.headers.get('result-length')),
        };
      },
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsChild: builder.query<IInventoryObjectModel[], number>({
      query: (parentId) => `objects/?p_id=${parentId}`,
      extraOptions: inventoryNewApiOptions,
    }),
    createObject: builder.mutation<IInventoryObjectModel, CreateObjectBody>({
      query: (body) => ({
        url: `object_with_parameters/`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            searchApiV2.util.invalidateTags([
              { type: 'Objects', id: 'V2' },
              { type: 'Processes', id: 'LIST' },
            ]),
          );
          setTimeout(() => {
            dispatch(
              searchApiV2.util.invalidateTags([
                { type: 'Objects', id: 'V2' },
                { type: 'Processes', id: 'LIST' },
              ]),
            );
          }, 2000);
        } catch (error) {
          console.error(error);
        }
      },
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectWithGroupedParameters: builder.query<
      InventoryObjectWithGroupedParametersModel[],
      InventoryObjectWithGroupedParametersRequestParams
    >({
      query: ({ id, ...params }) => ({ url: `object/${id}/grouped_parameters`, params }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    // TODO this endpoint no longer used, use the event manager instead
    // getObjectHistory: builder.query<InventoryObjectHistoryModel[], GetObjectHistoryRequestParam>({
    //   query: ({ ids, ...params }) => ({
    //     url: `objects/history?ids=${ids.join('&ids=')}`,
    //     params,
    //     cache: 'no-cache',
    //   }),
    //   providesTags: [{ type: 'Objects', id: 'LIST' }],
    //   extraOptions: inventoryNewApiOptions,
    //   keepUnusedDataFor: 0,
    // }),
    getObjectSiteFiber: builder.query<IInventoryObjectModel, number>({
      query: (id) => `object/${id}/fiber`,
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsByObjectTypes: builder.query<
      ObjectsByObjectTypesModel,
      IGetObjectsByObjectTypesRequestParams
    >({
      query: ({ object_type_ids, ...params }) => ({
        url: `objects_by_object_types/?object_type_ids=${object_type_ids.join(
          '&object_type_ids=',
        )}`,
        params,
      }),
      extraOptions: inventoryNewApiOptions,
    }),
    addObjectModel: builder.mutation<any, FormData>({
      query: (body) => ({
        url: `add_object_model/${body.get('id')}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsNames: builder.query<Record<number, string>, number[]>({
      query: (objIds) => {
        return {
          url: buildGetObjectsNamesQuery(objIds),
        };
      },
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsByObjectNames: builder.query<
      ObjectByObjectNamesModel,
      GetObjectsByObjectNamesRequestParams
    >({
      query: ({ tmo_id, objects_names, ...params }) => ({
        url:
          tmo_id !== null
            ? `multi_object_search?tmo_id=${tmo_id}&objects_names=${objects_names.join(
                '&objects_names=',
              )}`
            : `multi_object_search?&objects_names=${objects_names.join('&objects_names=')}`,
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsByTprmId: builder.query<ObjectsByTprmIdModel[], GetObjectsByTprmIdRequestParams>({
      query: ({ tprm_id, ...params }) => ({
        url: `object/search_by_prm_values/${tprm_id}`,
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsByTprmIdAndPrmValue: builder.query<
      ObjectsByTprmIdAndPrmValueModel,
      GetObjectsByTprmIdAndPrmValueRequestParams
    >({
      query: ({ tprm_id, value, ...params }) => ({
        url: `object/search_by_values/${tprm_id}?value=${value}`,
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getObjectsByPostMethod: builder.query<
      { apiResponse: IInventoryObjectModel[]; resultLength: number },
      GetObjectsByPostMethodBody
    >({
      query: (body) => ({
        url: 'objects/',
        method: 'POST',
        body,
      }),
      // @ts-ignore
      transformResponse: (apiResponse, meta) => {
        return {
          apiResponse,
          resultLength: Number(meta!.response!.headers.get('result-length')),
        };
      },
      providesTags: [{ type: 'Objects', id: 'LIST' }],
      extraOptions: inventoryNewApiOptions,
    }),
    getInheritLocationParentObject: builder.query<InheritLocationParentObjectModel, number>({
      query: (mo_id) => `/object/${mo_id}/inherit_location`,
    }),
    getObjectsParents: builder.query<Record<number, IInventoryObjectModel[]>, number[]>({
      query: (body) => ({ url: `get_all_parent/massive`, method: 'POST', body }),
    }),
    getAllObjectsAttributes: builder.query<string[], void>({
      query: () => `get_all_mo_attrs_available_for_hierarchy_levels`,
    }),
    getAllChildren: builder.query<AllChildrenResponse, number>({
      query: (mo_id) => `get_all_children/${mo_id}`,
    }),
    getObjectChildWithProcessInstanceId: builder.query<
      IGetObjectChildWithProcessInstanceIdModel[],
      number
    >({
      query: (parent_object_id) => `get_object_child_with_process_instance_id/${parent_object_id}`,
    }),
  }),
});

export const { useGetObjectsQuery, useGetAllObjectsAttributesQuery } = objectsApi;
